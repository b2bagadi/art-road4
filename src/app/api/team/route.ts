import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { team } from '@/db/schema';
import { eq, like, or, desc, asc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single team member by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const teamMember = await db
        .select()
        .from(team)
        .where(eq(team.id, parseInt(id)))
        .limit(1);

      if (teamMember.length === 0) {
        return NextResponse.json(
          { error: 'Team member not found', code: 'TEAM_MEMBER_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(teamMember[0], { status: 200 });
    }

    // List all team members with filtering and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const orderIndexFilter = searchParams.get('orderIndex');
    const sortField = searchParams.get('sort') ?? 'orderIndex';
    const sortOrder = searchParams.get('order') ?? 'asc';

    // Validate sort field
    const validSortFields = ['orderIndex', 'createdAt', 'updatedAt', 'nameEn'];
    if (!validSortFields.includes(sortField)) {
      return NextResponse.json(
        { error: 'Invalid sort field', code: 'INVALID_SORT_FIELD' },
        { status: 400 }
      );
    }

    // Build query
    let query = db.select().from(team);

    // Apply filters
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(team.nameEn, `%${search}%`),
          like(team.nameFr, `%${search}%`),
          like(team.nameAr, `%${search}%`)
        )
      );
    }

    if (orderIndexFilter) {
      const orderIndexValue = parseInt(orderIndexFilter);
      if (!isNaN(orderIndexValue)) {
        conditions.push(eq(team.orderIndex, orderIndexValue));
      }
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply sorting
    const sortColumn = {
      orderIndex: team.orderIndex,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      nameEn: team.nameEn,
    }[sortField];

    if (sortOrder === 'desc') {
      query = query.orderBy(desc(sortColumn));
    } else {
      query = query.orderBy(asc(sortColumn));
    }

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
    const { nameEn, nameFr, nameAr, photoUrl, orderIndex } = body;

    // Validate required fields
    const trimmedNameEn = nameEn?.trim();
    const trimmedNameFr = nameFr?.trim();
    const trimmedNameAr = nameAr?.trim();
    const trimmedPhotoUrl = photoUrl?.trim();

    if (!trimmedNameEn) {
      return NextResponse.json(
        { error: 'English name is required', code: 'NAME_EN_REQUIRED' },
        { status: 400 }
      );
    }

    if (!trimmedNameFr) {
      return NextResponse.json(
        { error: 'French name is required', code: 'NAME_FR_REQUIRED' },
        { status: 400 }
      );
    }

    if (!trimmedNameAr) {
      return NextResponse.json(
        { error: 'Arabic name is required', code: 'NAME_AR_REQUIRED' },
        { status: 400 }
      );
    }

    if (!trimmedPhotoUrl) {
      return NextResponse.json(
        { error: 'Photo URL is required', code: 'PHOTO_URL_REQUIRED' },
        { status: 400 }
      );
    }

    // Validate orderIndex if provided
    let validatedOrderIndex = 0;
    if (orderIndex !== undefined && orderIndex !== null) {
      validatedOrderIndex = parseInt(orderIndex);
      if (isNaN(validatedOrderIndex)) {
        return NextResponse.json(
          { error: 'Order index must be a valid integer', code: 'INVALID_ORDER_INDEX' },
          { status: 400 }
        );
      }
    }

    // Create new team member
    const now = new Date().toISOString();
    const newTeamMember = await db
      .insert(team)
      .values({
        nameEn: trimmedNameEn,
        nameFr: trimmedNameFr,
        nameAr: trimmedNameAr,
        photoUrl: trimmedPhotoUrl,
        orderIndex: validatedOrderIndex,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newTeamMember[0], { status: 201 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const teamId = parseInt(id);

    // Check if team member exists
    const existingTeamMember = await db
      .select()
      .from(team)
      .where(eq(team.id, teamId))
      .limit(1);

    if (existingTeamMember.length === 0) {
      return NextResponse.json(
        { error: 'Team member not found', code: 'TEAM_MEMBER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { nameEn, nameFr, nameAr, photoUrl, orderIndex } = body;

    // Build update object
    const updates: Record<string, string | number> = {
      updatedAt: new Date().toISOString(),
    };

    // Validate and add fields to update
    if (nameEn !== undefined) {
      const trimmedNameEn = nameEn.trim();
      if (!trimmedNameEn) {
        return NextResponse.json(
          { error: 'English name cannot be empty', code: 'NAME_EN_EMPTY' },
          { status: 400 }
        );
      }
      updates.nameEn = trimmedNameEn;
    }

    if (nameFr !== undefined) {
      const trimmedNameFr = nameFr.trim();
      if (!trimmedNameFr) {
        return NextResponse.json(
          { error: 'French name cannot be empty', code: 'NAME_FR_EMPTY' },
          { status: 400 }
        );
      }
      updates.nameFr = trimmedNameFr;
    }

    if (nameAr !== undefined) {
      const trimmedNameAr = nameAr.trim();
      if (!trimmedNameAr) {
        return NextResponse.json(
          { error: 'Arabic name cannot be empty', code: 'NAME_AR_EMPTY' },
          { status: 400 }
        );
      }
      updates.nameAr = trimmedNameAr;
    }

    if (photoUrl !== undefined) {
      const trimmedPhotoUrl = photoUrl.trim();
      if (!trimmedPhotoUrl) {
        return NextResponse.json(
          { error: 'Photo URL cannot be empty', code: 'PHOTO_URL_EMPTY' },
          { status: 400 }
        );
      }
      updates.photoUrl = trimmedPhotoUrl;
    }

    if (orderIndex !== undefined && orderIndex !== null) {
      const validatedOrderIndex = parseInt(orderIndex);
      if (isNaN(validatedOrderIndex)) {
        return NextResponse.json(
          { error: 'Order index must be a valid integer', code: 'INVALID_ORDER_INDEX' },
          { status: 400 }
        );
      }
      updates.orderIndex = validatedOrderIndex;
    }

    // Update team member
    const updated = await db
      .update(team)
      .set(updates)
      .where(eq(team.id, teamId))
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const teamId = parseInt(id);

    // Check if team member exists
    const existingTeamMember = await db
      .select()
      .from(team)
      .where(eq(team.id, teamId))
      .limit(1);

    if (existingTeamMember.length === 0) {
      return NextResponse.json(
        { error: 'Team member not found', code: 'TEAM_MEMBER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete team member
    const deleted = await db
      .delete(team)
      .where(eq(team.id, teamId))
      .returning();

    return NextResponse.json(
      {
        message: 'Team member deleted successfully',
        teamMember: deleted[0],
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