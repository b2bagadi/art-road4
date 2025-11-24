import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { trustedCompanies } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(trustedCompanies)
        .where(eq(trustedCompanies.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Trusted company not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const isActiveParam = searchParams.get('isActive');
    const sortField = searchParams.get('sort') ?? 'orderIndex';
    const sortOrder = searchParams.get('order') ?? 'asc';

    let query = db.select().from(trustedCompanies);

    // Apply isActive filter
    if (isActiveParam !== null) {
      const isActiveValue = isActiveParam === 'true';
      query = query.where(eq(trustedCompanies.isActive, isActiveValue));
    }

    // Apply sorting
    const sortColumn =
      sortField === 'createdAt'
        ? trustedCompanies.createdAt
        : sortField === 'updatedAt'
        ? trustedCompanies.updatedAt
        : trustedCompanies.orderIndex;

    if (sortOrder === 'desc') {
      query = query.orderBy(desc(sortColumn));
    } else {
      query = query.orderBy(asc(sortColumn));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required field
    if (!body.logoUrl || typeof body.logoUrl !== 'string') {
      return NextResponse.json(
        { error: 'logoUrl is required and must be a string', code: 'MISSING_LOGO_URL' },
        { status: 400 }
      );
    }

    // Sanitize and validate logoUrl
    const logoUrl = body.logoUrl.trim();
    if (!logoUrl) {
      return NextResponse.json(
        { error: 'logoUrl cannot be empty', code: 'EMPTY_LOGO_URL' },
        { status: 400 }
      );
    }

    // Validate optional fields
    let orderIndex = 0;
    if (body.orderIndex !== undefined) {
      if (typeof body.orderIndex !== 'number' || isNaN(body.orderIndex)) {
        return NextResponse.json(
          { error: 'orderIndex must be a valid integer', code: 'INVALID_ORDER_INDEX' },
          { status: 400 }
        );
      }
      orderIndex = body.orderIndex;
    }

    let isActive = true;
    if (body.isActive !== undefined) {
      if (typeof body.isActive !== 'boolean') {
        return NextResponse.json(
          { error: 'isActive must be a boolean', code: 'INVALID_IS_ACTIVE' },
          { status: 400 }
        );
      }
      isActive = body.isActive;
    }

    // Create new record
    const now = new Date().toISOString();
    const newCompany = await db
      .insert(trustedCompanies)
      .values({
        logoUrl,
        orderIndex,
        isActive,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newCompany[0], { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const companyId = parseInt(id);

    // Check if company exists
    const existing = await db
      .select()
      .from(trustedCompanies)
      .where(eq(trustedCompanies.id, companyId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Trusted company not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and sanitize logoUrl if provided
    if (body.logoUrl !== undefined) {
      if (typeof body.logoUrl !== 'string') {
        return NextResponse.json(
          { error: 'logoUrl must be a string', code: 'INVALID_LOGO_URL' },
          { status: 400 }
        );
      }
      const logoUrl = body.logoUrl.trim();
      if (!logoUrl) {
        return NextResponse.json(
          { error: 'logoUrl cannot be empty', code: 'EMPTY_LOGO_URL' },
          { status: 400 }
        );
      }
      updates.logoUrl = logoUrl;
    }

    // Validate orderIndex if provided
    if (body.orderIndex !== undefined) {
      if (typeof body.orderIndex !== 'number' || isNaN(body.orderIndex)) {
        return NextResponse.json(
          { error: 'orderIndex must be a valid integer', code: 'INVALID_ORDER_INDEX' },
          { status: 400 }
        );
      }
      updates.orderIndex = body.orderIndex;
    }

    // Validate isActive if provided
    if (body.isActive !== undefined) {
      if (typeof body.isActive !== 'boolean') {
        return NextResponse.json(
          { error: 'isActive must be a boolean', code: 'INVALID_IS_ACTIVE' },
          { status: 400 }
        );
      }
      updates.isActive = body.isActive;
    }

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    // Update the record
    const updated = await db
      .update(trustedCompanies)
      .set(updates)
      .where(eq(trustedCompanies.id, companyId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const companyId = parseInt(id);

    // Check if company exists
    const existing = await db
      .select()
      .from(trustedCompanies)
      .where(eq(trustedCompanies.id, companyId))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Trusted company not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the record
    const deleted = await db
      .delete(trustedCompanies)
      .where(eq(trustedCompanies.id, companyId))
      .returning();

    return NextResponse.json(
      {
        message: 'Trusted company deleted successfully',
        data: deleted[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}