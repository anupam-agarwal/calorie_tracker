import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { createApiResponse } from '@/lib/api-response';

// Registration schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

type RegisterInput = z.infer<typeof registerSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const { email, password, name } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        createApiResponse(false, 'User with this email already exists'),
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${passwordHash}, ${name || null})
      RETURNING id, email, name, created_at
    `;

    const newUser = result.rows[0];

    return NextResponse.json(
      createApiResponse(true, 'User registered successfully', {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        createApiResponse(false, 'Validation error', { errors: error.errors }),
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      createApiResponse(false, 'Registration failed'),
      { status: 500 }
    );
  }
}
