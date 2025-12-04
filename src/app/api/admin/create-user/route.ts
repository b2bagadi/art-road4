import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, account } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required', code: 'MISSING_PASSWORD' },
        { status: 400 }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, normalizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists', code: 'DUPLICATE_EMAIL' },
        { status: 409 }
      );
    }

    // Generate unique IDs
    const userId = randomUUID();
    const accountId = randomUUID();

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get current timestamp
    const now = new Date();

    // Insert user and account in a transaction-like manner
    // Note: SQLite/Turso with Drizzle doesn't support traditional transactions in the same way
    // We'll insert sequentially and handle errors
    let createdUser;
    let createdAccount;

    try {
      // Insert user
      createdUser = await db
        .insert(user)
        .values({
          id: userId,
          name: name.trim(),
          email: normalizedEmail,
          emailVerified: true,
          image: null,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      if (createdUser.length === 0) {
        throw new Error('Failed to create user');
      }

      // Insert account
      createdAccount = await db
        .insert(account)
        .values({
          id: accountId,
          accountId: normalizedEmail,
          providerId: 'credential',
          userId: userId,
          password: hashedPassword,
          accessToken: null,
          refreshToken: null,
          idToken: null,
          accessTokenExpiresAt: null,
          refreshTokenExpiresAt: null,
          scope: null,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      if (createdAccount.length === 0) {
        // Rollback: delete the user if account creation fails
        await db.delete(user).where(eq(user.id, userId));
        throw new Error('Failed to create account');
      }
    } catch (insertError) {
      // Attempt cleanup if user was created but account failed
      if (createdUser && createdUser.length > 0) {
        try {
          await db.delete(user).where(eq(user.id, userId));
        } catch (cleanupError) {
          console.error('Cleanup error after failed account creation:', cleanupError);
        }
      }
      throw insertError;
    }

    // Return created user without password
    const userResponse = {
      id: createdUser[0].id,
      name: createdUser[0].name,
      email: createdUser[0].email,
      emailVerified: createdUser[0].emailVerified,
      image: createdUser[0].image,
      createdAt: createdUser[0].createdAt,
      updatedAt: createdUser[0].updatedAt,
    };

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}