import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { services } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single service fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const service = await db.select()
        .from(services)
        .where(eq(services.id, parseInt(id)))
        .limit(1);

      if (service.length === 0) {
        return NextResponse.json({ 
          error: 'Service not found',
          code: 'SERVICE_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(service[0], { status: 200 });
    }

    // List services with pagination, filtering, search, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const isActiveParam = searchParams.get('isActive');
    const isFavouriteParam = searchParams.get('isFavourite');
    const sortField = searchParams.get('sort') ?? 'orderIndex';
    const sortOrder = searchParams.get('order') ?? 'asc';

    let query = db.select().from(services);

    // Build where conditions
    const conditions = [];

    // Filter by isActive
    if (isActiveParam !== null) {
      const isActiveValue = isActiveParam === 'true';
      conditions.push(eq(services.isActive, isActiveValue));
    }

    // Filter by isFavourite
    if (isFavouriteParam !== null) {
      const isFavouriteValue = isFavouriteParam === 'true';
      conditions.push(eq(services.isFavourite, isFavouriteValue));
    }

    // Search across title fields
    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(
        or(
          like(services.titleEn, searchTerm),
          like(services.titleFr, searchTerm),
          like(services.titleAr, searchTerm)
        )
      );
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply sorting
    const validSortFields = ['orderIndex', 'createdAt', 'updatedAt', 'titleEn', 'priceStart'];
    const sortColumn = validSortFields.includes(sortField) ? sortField : 'orderIndex';
    
    if (sortOrder === 'desc') {
      query = query.orderBy(desc(services[sortColumn as keyof typeof services]));
    } else {
      query = query.orderBy(asc(services[sortColumn as keyof typeof services]));
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'titleEn', 'titleFr', 'titleAr',
      'descriptionEn', 'descriptionFr', 'descriptionAr',
      'imageUrl', 'icon'
    ];

    for (const field of requiredFields) {
      if (!body[field] || typeof body[field] !== 'string' || body[field].trim() === '') {
        return NextResponse.json({ 
          error: `${field} is required and must be a non-empty string`,
          code: 'MISSING_REQUIRED_FIELD' 
        }, { status: 400 });
      }
    }

    // Validate priceStart if provided
    let priceStart = 0;
    if (body.priceStart !== undefined) {
      priceStart = parseInt(body.priceStart);
      if (isNaN(priceStart) || priceStart < 0) {
        return NextResponse.json({ 
          error: 'priceStart must be a non-negative integer',
          code: 'INVALID_PRICE_START' 
        }, { status: 400 });
      }
    }

    // Validate currency if provided
    const currency = body.currency ? body.currency.trim() : 'MAD';
    if (currency.length > 10) {
      return NextResponse.json({ 
        error: 'currency must be 10 characters or less',
        code: 'INVALID_CURRENCY' 
      }, { status: 400 });
    }

    // Sanitize and prepare data
    const serviceData = {
      titleEn: body.titleEn.trim(),
      titleFr: body.titleFr.trim(),
      titleAr: body.titleAr.trim(),
      descriptionEn: body.descriptionEn.trim(),
      descriptionFr: body.descriptionFr.trim(),
      descriptionAr: body.descriptionAr.trim(),
      imageUrl: body.imageUrl.trim(),
      icon: body.icon.trim(),
      priceStart: priceStart,
      currency: currency,
      isFavourite: body.isFavourite !== undefined ? Boolean(body.isFavourite) : false,
      orderIndex: body.orderIndex !== undefined ? parseInt(body.orderIndex) : 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Validate orderIndex is a valid integer
    if (isNaN(serviceData.orderIndex)) {
      return NextResponse.json({ 
        error: 'orderIndex must be a valid integer',
        code: 'INVALID_ORDER_INDEX' 
      }, { status: 400 });
    }

    // Insert service
    const newService = await db.insert(services)
      .values(serviceData)
      .returning();

    return NextResponse.json(newService[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if service exists
    const existingService = await db.select()
      .from(services)
      .where(eq(services.id, parseInt(id)))
      .limit(1);

    if (existingService.length === 0) {
      return NextResponse.json({ 
        error: 'Service not found',
        code: 'SERVICE_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    // Sanitize and validate string fields
    const stringFields = [
      'titleEn', 'titleFr', 'titleAr',
      'descriptionEn', 'descriptionFr', 'descriptionAr',
      'imageUrl', 'icon'
    ];

    for (const field of stringFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== 'string' || body[field].trim() === '') {
          return NextResponse.json({ 
            error: `${field} must be a non-empty string`,
            code: 'INVALID_FIELD_VALUE' 
          }, { status: 400 });
        }
        updateData[field] = body[field].trim();
      }
    }

    // Validate and add priceStart
    if (body.priceStart !== undefined) {
      const priceStart = parseInt(body.priceStart);
      if (isNaN(priceStart) || priceStart < 0) {
        return NextResponse.json({ 
          error: 'priceStart must be a non-negative integer',
          code: 'INVALID_PRICE_START' 
        }, { status: 400 });
      }
      updateData.priceStart = priceStart;
    }

    // Validate and add currency
    if (body.currency !== undefined) {
      const currency = body.currency.trim();
      if (currency.length === 0 || currency.length > 10) {
        return NextResponse.json({ 
          error: 'currency must be between 1 and 10 characters',
          code: 'INVALID_CURRENCY' 
        }, { status: 400 });
      }
      updateData.currency = currency;
    }

    // Validate and add isFavourite
    if (body.isFavourite !== undefined) {
      updateData.isFavourite = Boolean(body.isFavourite);
    }

    // Validate and add orderIndex
    if (body.orderIndex !== undefined) {
      const orderIndex = parseInt(body.orderIndex);
      if (isNaN(orderIndex)) {
        return NextResponse.json({ 
          error: 'orderIndex must be a valid integer',
          code: 'INVALID_ORDER_INDEX' 
        }, { status: 400 });
      }
      updateData.orderIndex = orderIndex;
    }

    // Validate and add isActive
    if (body.isActive !== undefined) {
      updateData.isActive = Boolean(body.isActive);
    }

    // Update service
    const updatedService = await db.update(services)
      .set(updateData)
      .where(eq(services.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedService[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if service exists
    const existingService = await db.select()
      .from(services)
      .where(eq(services.id, parseInt(id)))
      .limit(1);

    if (existingService.length === 0) {
      return NextResponse.json({ 
        error: 'Service not found',
        code: 'SERVICE_NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete service
    const deleted = await db.delete(services)
      .where(eq(services.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Service deleted successfully',
      service: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}