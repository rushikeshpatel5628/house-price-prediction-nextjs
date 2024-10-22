// src/app/api/users/signup/route.js
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // Adjust the import path if needed

export async function POST(req) {
  const { first_name, last_name, email, password } = await req.json();

  try {
    // Check if the user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [first_name, last_name, email, hashedPassword]
    );

    // Send a success response
    const newUser = result.rows[0];
    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
      },
    }, { status: 201 });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
