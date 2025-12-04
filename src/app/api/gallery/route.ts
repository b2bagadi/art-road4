import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { gallery } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

const VALID_CATEGORIES = ['led-panels', '3d-decoration', 'events', 'other'] as const;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
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
        .from(gallery)
        .where(eq(gallery.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Gallery item not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '12'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const isActive = searchParams.get('isActive');
    const showOnHomepage = searchParams.get('showOnHomepage');
    const sort = searchParams.get('sort') ?? 'orderIndex';
    const order = searchParams.get('order') ?? 'asc';

    let query = db.select().from(gallery);

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(gallery.titleEn, `%${search}%`),
          like(gallery.titleFr, `%${search}%`),
          like(gallery.titleAr, `%${search}%`)
        )
      );
    }

    if (category) {
      if (!VALID_CATEGORIES.includes(category as any)) {
        return NextResponse.json(
          { error: 'Invalid category', code: 'INVALID_CATEGORY' },
          { status: 400 }
        );
      }
      conditions.push(eq(gallery.category, category));
    }

    if (featured === 'true') {
      conditions.push(eq(gallery.isFeatured, true));
    } else if (featured === 'false') {
      conditions.push(eq(gallery.isFeatured, false));
    }

    if (isActive === 'true') {
      conditions.push(eq(gallery.isActive, true));
    } else if (isActive === 'false') {
      conditions.push(eq(gallery.isActive, false));
    }

    if (showOnHomepage === 'true') {
      conditions.push(eq(gallery.showOnHomepage, true));
    } else if (showOnHomepage === 'false') {
      conditions.push(eq(gallery.showOnHomepage, false));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = sort === 'createdAt' ? gallery.createdAt : gallery.orderIndex;
    query = order === 'desc' ? query.orderBy(desc(sortColumn)) : query.orderBy(asc(sortColumn));

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'titleEn',
      'titleFr',
      'titleAr',
      'descriptionEn',
      'descriptionFr',
      'descriptionAr',
      'beforeImageUrl',
      'afterImageUrl',
      'category',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required`, code: 'MISSING_REQUIRED_FIELD' },
          { status: 400 }
        );
      }
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(body.category)) {
      return NextResponse.json(
        {
          error: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
          code: 'INVALID_CATEGORY',
        },
        { status: 400 }
      );
    }

    // Validate optional fields if provided
    if (body.orderIndex !== undefined && typeof body.orderIndex !== 'number') {
      return NextResponse.json(
        { error: 'orderIndex must be a number', code: 'INVALID_ORDER_INDEX' },
        { status: 400 }
      );
    }

    if (body.isFeatured !== undefined && typeof body.isFeatured !== 'boolean') {
      return NextResponse.json(
        { error: 'isFeatured must be a boolean', code: 'INVALID_IS_FEATURED' },
        { status: 400 }
      );
    }

    // Prepare data with defaults and sanitization
    const now = new Date().toISOString();
    const insertData = {
      titleEn: body.titleEn.trim(),
      titleFr: body.titleFr.trim(),
      titleAr: body.titleAr.trim(),
      descriptionEn: body.descriptionEn.trim(),
      descriptionFr: body.descriptionFr.trim(),
      descriptionAr: body.descriptionAr.trim(),
      beforeImageUrl: body.beforeImageUrl.trim(),
      afterImageUrl: body.afterImageUrl.trim(),
      category: body.category.trim(),
      orderIndex: body.orderIndex ?? 0,
      isFeatured: body.isFeatured ?? false,
      createdAt: now,
      updatedAt: now,
    };

    const newRecord = await db.insert(gallery).values(insertData).returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(gallery)
      .where(eq(gallery.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Gallery item not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate category if provided
    if (body.category && !VALID_CATEGORIES.includes(body.category)) {
      return NextResponse.json(
        {
          error: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
          code: 'INVALID_CATEGORY',
        },
        { status: 400 }
      );
    }

    // Validate optional fields if provided
    if (body.orderIndex !== undefined && typeof body.orderIndex !== 'number') {
      return NextResponse.json(
        { error: 'orderIndex must be a number', code: 'INVALID_ORDER_INDEX' },
        { status: 400 }
      );
    }

    if (body.isFeatured !== undefined && typeof body.isFeatured !== 'boolean') {
      return NextResponse.json(
        { error: 'isFeatured must be a boolean', code: 'INVALID_IS_FEATURED' },
        { status: 400 }
      );
    }

    if (body.isActive !== undefined && typeof body.isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean', code: 'INVALID_IS_ACTIVE' },
        { status: 400 }
      );
    }

    if (body.showOnHomepage !== undefined && typeof body.showOnHomepage !== 'boolean') {
      return NextResponse.json(
        { error: 'showOnHomepage must be a boolean', code: 'INVALID_SHOW_ON_HOMEPAGE' },
        { status: 400 }
      );
    }

    // Prepare update data with sanitization
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (body.titleEn) updates.titleEn = body.titleEn.trim();
    if (body.titleFr) updates.titleFr = body.titleFr.trim();
    if (body.titleAr) updates.titleAr = body.titleAr.trim();
    if (body.descriptionEn) updates.descriptionEn = body.descriptionEn.trim();
    if (body.descriptionFr) updates.descriptionFr = body.descriptionFr.trim();
    if (body.descriptionAr) updates.descriptionAr = body.descriptionAr.trim();
    if (body.beforeImageUrl) updates.beforeImageUrl = body.beforeImageUrl.trim();
    if (body.afterImageUrl) updates.afterImageUrl = body.afterImageUrl.trim();
    if (body.category) updates.category = body.category.trim();
    if (body.orderIndex !== undefined) updates.orderIndex = body.orderIndex;
    if (body.isFeatured !== undefined) updates.isFeatured = body.isFeatured;
    if (body.isActive !== undefined) updates.isActive = body.isActive;
    if (body.showOnHomepage !== undefined) updates.showOnHomepage = body.showOnHomepage;

    const updated = await db
      .update(gallery)
      .set(updates)
      .where(eq(gallery.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(gallery)
      .where(eq(gallery.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Gallery item not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(gallery)
      .where(eq(gallery.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Gallery item deleted successfully',
        deleted: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}