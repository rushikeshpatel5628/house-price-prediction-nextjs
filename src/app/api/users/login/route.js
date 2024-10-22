// src/app/api/users/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../../../lib/db'; // Adjust the import path if needed

export async function POST(req) {
  const { email, password } = await req.json(); // Change from req.body to req.json()

  try {
    // Check if the user exists in the database
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      // User not found
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];

    // Compare the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Password does not match
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create a JWT (JSON Web Token) for the user
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Store your secret key in .env file
      { expiresIn: '1d' }
    );

    // seeting up a cookies
    
    
    const response = NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
    }, { status: 200 });
    
    response.cookies.set('token', token, { httpOnly: true })

    return response 
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req) {
  // If you want to handle GET requests, you can add logic here
  return NextResponse.json({ message: 'GET method is not supported' }, { status: 405 });
}
