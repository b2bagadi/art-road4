import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');
    const keysParam = searchParams.get('keys');

    // Single key query
    if (key) {
      const setting = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);

      if (setting.length === 0) {
        return NextResponse.json({ 
          error: 'Setting not found',
          code: 'SETTING_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(setting[0], { status: 200 });
    }

    // Multiple keys query
    if (keysParam) {
      const keys = keysParam.split(',').map(k => k.trim()).filter(k => k);
      
      if (keys.length === 0) {
        return NextResponse.json({ 
          error: 'No valid keys provided',
          code: 'INVALID_KEYS' 
        }, { status: 400 });
      }

      const settings = await db.select()
        .from(siteSettings)
        .where(inArray(siteSettings.key, keys));

      return NextResponse.json(settings, { status: 200 });
    }

    // No query params - return all settings
    const allSettings = await db.select().from(siteSettings);
    return NextResponse.json(allSettings, { status: 200 });

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
    const { key, value, description, themeMode, heroBgUrl, logoLightUrl, logoDarkUrl, whatsappNumber } = body;

    // Validate required fields
    if (!key || key.trim() === '') {
      return NextResponse.json({ 
        error: 'Key is required',
        code: 'MISSING_KEY' 
      }, { status: 400 });
    }

    if (!value || value.trim() === '') {
      return NextResponse.json({ 
        error: 'Value is required',
        code: 'MISSING_VALUE' 
      }, { status: 400 });
    }

    // Sanitize inputs
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();
    const trimmedDescription = description ? description.trim() : null;

    // Check if key already exists
    const existing = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.key, trimmedKey))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ 
        error: 'Setting with this key already exists',
        code: 'DUPLICATE_KEY' 
      }, { status: 400 });
    }

    // Create new setting with optional fields
    const insertData: any = {
      key: trimmedKey,
      value: trimmedValue,
      description: trimmedDescription,
      updatedAt: new Date().toISOString()
    };

    if (themeMode !== undefined) insertData.themeMode = themeMode.trim();
    if (heroBgUrl !== undefined) insertData.heroBgUrl = heroBgUrl ? heroBgUrl.trim() : null;
    if (logoLightUrl !== undefined) insertData.logoLightUrl = logoLightUrl ? logoLightUrl.trim() : null;
    if (logoDarkUrl !== undefined) insertData.logoDarkUrl = logoDarkUrl ? logoDarkUrl.trim() : null;
    if (whatsappNumber !== undefined) insertData.whatsappNumber = whatsappNumber ? whatsappNumber.trim() : null;

    const newSetting = await db.insert(siteSettings)
      .values(insertData)
      .returning();

    return NextResponse.json(newSetting[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if it's bulk update
    if (body.settings && Array.isArray(body.settings)) {
      const updatedSettings = [];

      for (const setting of body.settings) {
        const { key, value, description, themeMode, heroBgUrl, logoLightUrl, logoDarkUrl, whatsappNumber } = setting;

        if (!key || key.trim() === '') {
          return NextResponse.json({ 
            error: 'Key is required for all settings',
            code: 'MISSING_KEY' 
          }, { status: 400 });
        }

        if (!value || value.trim() === '') {
          return NextResponse.json({ 
            error: 'Value is required for all settings',
            code: 'MISSING_VALUE' 
          }, { status: 400 });
        }

        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        const trimmedDescription = description !== undefined ? (description ? description.trim() : null) : undefined;

        // Check if setting exists
        const existing = await db.select()
          .from(siteSettings)
          .where(eq(siteSettings.key, trimmedKey))
          .limit(1);

        if (existing.length > 0) {
          // Update existing setting
          const updateData: any = {
            value: trimmedValue,
            updatedAt: new Date().toISOString()
          };

          if (trimmedDescription !== undefined) {
            updateData.description = trimmedDescription;
          }
          if (themeMode !== undefined) updateData.themeMode = themeMode.trim();
          if (heroBgUrl !== undefined) updateData.heroBgUrl = heroBgUrl ? heroBgUrl.trim() : null;
          if (logoLightUrl !== undefined) updateData.logoLightUrl = logoLightUrl ? logoLightUrl.trim() : null;
          if (logoDarkUrl !== undefined) updateData.logoDarkUrl = logoDarkUrl ? logoDarkUrl.trim() : null;
          if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber ? whatsappNumber.trim() : null;

          const updated = await db.update(siteSettings)
            .set(updateData)
            .where(eq(siteSettings.key, trimmedKey))
            .returning();

          updatedSettings.push(updated[0]);
        } else {
          // Insert new setting
          const insertData: any = {
            key: trimmedKey,
            value: trimmedValue,
            description: trimmedDescription ?? null,
            updatedAt: new Date().toISOString()
          };

          if (themeMode !== undefined) insertData.themeMode = themeMode.trim();
          if (heroBgUrl !== undefined) insertData.heroBgUrl = heroBgUrl ? heroBgUrl.trim() : null;
          if (logoLightUrl !== undefined) insertData.logoLightUrl = logoLightUrl ? logoLightUrl.trim() : null;
          if (logoDarkUrl !== undefined) insertData.logoDarkUrl = logoDarkUrl ? logoDarkUrl.trim() : null;
          if (whatsappNumber !== undefined) insertData.whatsappNumber = whatsappNumber ? whatsappNumber.trim() : null;

          const inserted = await db.insert(siteSettings)
            .values(insertData)
            .returning();

          updatedSettings.push(inserted[0]);
        }
      }

      return NextResponse.json(updatedSettings, { status: 200 });
    }

    // Single setting update
    const { key, value, description, themeMode, heroBgUrl, logoLightUrl, logoDarkUrl, whatsappNumber } = body;

    if (!key || key.trim() === '') {
      return NextResponse.json({ 
        error: 'Key is required',
        code: 'MISSING_KEY' 
      }, { status: 400 });
    }

    if (!value || value.trim() === '') {
      return NextResponse.json({ 
        error: 'Value is required',
        code: 'MISSING_VALUE' 
      }, { status: 400 });
    }

    const trimmedKey = key.trim();
    const trimmedValue = value.trim();
    const trimmedDescription = description !== undefined ? (description ? description.trim() : null) : undefined;

    // Check if setting exists
    const existing = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.key, trimmedKey))
      .limit(1);

    if (existing.length > 0) {
      // Update existing setting
      const updateData: any = {
        value: trimmedValue,
        updatedAt: new Date().toISOString()
      };

      if (trimmedDescription !== undefined) {
        updateData.description = trimmedDescription;
      }
      if (themeMode !== undefined) updateData.themeMode = themeMode.trim();
      if (heroBgUrl !== undefined) updateData.heroBgUrl = heroBgUrl ? heroBgUrl.trim() : null;
      if (logoLightUrl !== undefined) updateData.logoLightUrl = logoLightUrl ? logoLightUrl.trim() : null;
      if (logoDarkUrl !== undefined) updateData.logoDarkUrl = logoDarkUrl ? logoDarkUrl.trim() : null;
      if (whatsappNumber !== undefined) updateData.whatsappNumber = whatsappNumber ? whatsappNumber.trim() : null;

      const updated = await db.update(siteSettings)
        .set(updateData)
        .where(eq(siteSettings.key, trimmedKey))
        .returning();

      return NextResponse.json(updated[0], { status: 200 });
    } else {
      // Insert new setting (upsert logic)
      const insertData: any = {
        key: trimmedKey,
        value: trimmedValue,
        description: trimmedDescription ?? null,
        updatedAt: new Date().toISOString()
      };

      if (themeMode !== undefined) insertData.themeMode = themeMode.trim();
      if (heroBgUrl !== undefined) insertData.heroBgUrl = heroBgUrl ? heroBgUrl.trim() : null;
      if (logoLightUrl !== undefined) insertData.logoLightUrl = logoLightUrl ? logoLightUrl.trim() : null;
      if (logoDarkUrl !== undefined) insertData.logoDarkUrl = logoDarkUrl ? logoDarkUrl.trim() : null;
      if (whatsappNumber !== undefined) insertData.whatsappNumber = whatsappNumber ? whatsappNumber.trim() : null;

      const inserted = await db.insert(siteSettings)
        .values(insertData)
        .returning();

      return NextResponse.json(inserted[0], { status: 200 });
    }

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}