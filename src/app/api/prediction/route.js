import { NextResponse } from 'next/server';
import * as ort from 'onnxruntime-node';
import fs from 'fs/promises';
import path from 'path';

const modelPath = path.join(process.cwd(), 'src', 'models', 'banglore_home_prices_model.onnx');
const columnsPath = path.join(process.cwd(), 'src', 'models', 'columns.json');
let session;
let locationMapping;

async function initializeSession() {
  if (!session) {
    const model = await fs.readFile(modelPath);
    session = await ort.InferenceSession.create(model.buffer);

    const columnsData = await fs.readFile(columnsPath, 'utf-8');
    const columns = JSON.parse(columnsData).data_columns;
    locationMapping = {};
    for (let i = 3; i < columns.length; i++) {
      locationMapping[columns[i]] = i - 3;
    }
  }
}

function prepareInput(data) {
  const { location, total_sqft, bath, bhk } = data;
  const locationEncoded = new Array(Object.keys(locationMapping).length).fill(0);
  
  if (locationMapping.hasOwnProperty(location.toLowerCase())) {
    locationEncoded[locationMapping[location.toLowerCase()]] = 1;
  } else {
    console.warn(`Unknown location: ${location}`);
  }
  
  return [total_sqft, bath, bhk, ...locationEncoded];
}

export async function POST(request) {
  try {
    await initializeSession();

    const body = await request.json();
    console.log('Received body:', body);

    if (!body || typeof body !== 'object' || !body.location || !body.total_sqft || !body.bath || !body.bhk) {
      throw new Error('Invalid input: expected an object with location, total_sqft, bath, and bhk properties');
    }

    const input = prepareInput(body);
    console.log('Prepared input:', input);

    const tensor = new ort.Tensor('float32', input, [1, input.length]);
    const feeds = { float_input: tensor };
    const outputs = await session.run(feeds);

    console.log('Model outputs:', JSON.stringify(outputs, null, 2));

    let prediction;
    if (outputs && typeof outputs === 'object') {
      // Try to find the output tensor
      const outputTensor = Object.values(outputs)[0];
      if (outputTensor && outputTensor.data) {
        prediction = Array.from(outputTensor.data)[0];
      } else {
        throw new Error('Unable to extract prediction from model output');
      }
    } else {
      throw new Error('Unexpected output format from the model');
    }

    console.log('Prediction:', prediction);

    return NextResponse.json({ prediction });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({ 
      error: 'Prediction failed', 
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}