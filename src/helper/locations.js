import fs from 'fs';
import path from 'path';

let locations = null;
let data_columns = null;

export function loadSavedArtifacts() {
  try {
    console.log("Loading saved artifacts...start");

    const columnsFilePath = path.join(process.cwd(), 'src', 'models', 'columns.json');
    const columnsData = fs.readFileSync(columnsFilePath, 'utf-8');
    data_columns = JSON.parse(columnsData).data_columns;
    locations = data_columns.slice(3); // first 3 columns are sqft, bath, bhk

    console.log("Loading saved artifacts...done");
  } catch (error) {
    console.error("Error loading artifacts:", error);
  }
}

export function get_location_names() {
  if (!locations) {
    loadSavedArtifacts();
  }
  return locations;
}
