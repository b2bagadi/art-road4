import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single lead fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const lead = await db.select()
        .from(leads)
        .where(eq(leads.id, parseInt(id)))
        .limit(1);

      if (lead.length === 0) {
        return NextResponse.json({ 
          error: 'Lead not found',
          code: "LEAD_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(lead[0], { status: 200 });
    }

    // List leads with filtering, search, pagination, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const statusFilter = searchParams.get('status');
    const sourceFilter = searchParams.get('source');
    const sortField = searchParams.get('sort') ?? 'createdAt';
    const sortOrder = searchParams.get('order') ?? 'desc';

    let query = db.select().from(leads);

    // Build where conditions
    const conditions = [];

    // Status filter
    if (statusFilter) {
      const validStatuses = ['new', 'contacted', 'converted', 'closed'];
      if (!validStatuses.includes(statusFilter)) {
        return NextResponse.json({ 
          error: "Invalid status. Must be one of: new, contacted, converted, closed",
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
      conditions.push(eq(leads.status, statusFilter));
    }

    // Source filter
    if (sourceFilter) {
      conditions.push(eq(leads.source, sourceFilter));
    }

    // Search across name, email, phone
    if (search) {
      conditions.push(
        or(
          like(leads.name, `%${search}%`),
          like(leads.email, `%${search}%`),
          like(leads.phone, `%${search}%`)
        )
      );
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply sorting
    const sortColumn = sortField === 'createdAt' ? leads.createdAt : 
                       sortField === 'updatedAt' ? leads.updatedAt :
                       sortField === 'name' ? leads.name :
                       sortField === 'status' ? leads.status :
                       leads.createdAt;

    query = sortOrder === 'asc' 
      ? query.orderBy(asc(sortColumn))
      : query.orderBy(desc(sortColumn));

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, serviceInterest } = body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ 
        error: "Missing required fields: name, email, phone, and message are required",
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    // Trim string inputs
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();
    const trimmedServiceInterest = serviceInterest ? serviceInterest.trim() : null;

    // Validate trimmed required fields are not empty
    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedMessage) {
      return NextResponse.json({ 
        error: "Required fields cannot be empty after trimming",
        code: "EMPTY_REQUIRED_FIELDS" 
      }, { status: 400 });
    }

    // Basic email validation
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return NextResponse.json({ 
        error: "Invalid email format. Email must contain @ and .",
        code: "INVALID_EMAIL_FORMAT" 
      }, { status: 400 });
    }

    // Create new lead
    const newLead = await db.insert(leads)
      .values({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        message: trimmedMessage,
        serviceInterest: trimmedServiceInterest,
        source: 'website',
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newLead[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
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

    const body = await request.json();

    // Check if lead exists
    const existingLead = await db.select()
      .from(leads)
      .where(eq(leads.id, parseInt(id)))
      .limit(1);

    if (existingLead.length === 0) {
      return NextResponse.json({ 
        error: 'Lead not found',
        code: "LEAD_NOT_FOUND" 
      }, { status: 404 });
    }

    // Validate status if provided
    if (body.status) {
      const validStatuses = ['new', 'contacted', 'converted', 'closed'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ 
          error: "Invalid status. Must be one of: new, contacted, converted, closed",
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
    }

    // Validate email format if provided
    if (body.email) {
      const trimmedEmail = body.email.trim().toLowerCase();
      if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
        return NextResponse.json({ 
          error: "Invalid email format. Email must contain @ and .",
          code: "INVALID_EMAIL_FORMAT" 
        }, { status: 400 });
      }
    }

    // Build update object with trimmed values
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.email !== undefined) updates.email = body.email.trim().toLowerCase();
    if (body.phone !== undefined) updates.phone = body.phone.trim();
    if (body.message !== undefined) updates.message = body.message.trim();
    if (body.serviceInterest !== undefined) updates.serviceInterest = body.serviceInterest ? body.serviceInterest.trim() : null;
    if (body.source !== undefined) updates.source = body.source.trim();
    if (body.status !== undefined) updates.status = body.status;

    // Update lead
    const updatedLead = await db.update(leads)
      .set(updates)
      .where(eq(leads.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedLead[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
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

    // Check if lead exists before deleting
    const existingLead = await db.select()
      .from(leads)
      .where(eq(leads.id, parseInt(id)))
      .limit(1);

    if (existingLead.length === 0) {
      return NextResponse.json({ 
        error: 'Lead not found',
        code: "LEAD_NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete lead
    const deletedLead = await db.delete(leads)
      .where(eq(leads.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Lead deleted successfully',
      lead: deletedLead[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}