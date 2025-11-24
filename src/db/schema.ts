import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Services table
export const services = sqliteTable('services', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titleEn: text('title_en').notNull(),
  titleFr: text('title_fr').notNull(),
  titleAr: text('title_ar').notNull(),
  descriptionEn: text('description_en').notNull(),
  descriptionFr: text('description_fr').notNull(),
  descriptionAr: text('description_ar').notNull(),
  imageUrl: text('image_url').notNull(),
  icon: text('icon').notNull(),
  priceStart: integer('price_start').notNull().default(0),
  currency: text('currency').notNull().default('MAD'),
  isFavourite: integer('is_favourite', { mode: 'boolean' }).notNull().default(false),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Gallery table
export const gallery = sqliteTable('gallery', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titleEn: text('title_en').notNull(),
  titleFr: text('title_fr').notNull(),
  titleAr: text('title_ar').notNull(),
  descriptionEn: text('description_en').notNull(),
  descriptionFr: text('description_fr').notNull(),
  descriptionAr: text('description_ar').notNull(),
  beforeImageUrl: text('before_image_url').notNull(),
  afterImageUrl: text('after_image_url').notNull(),
  category: text('category').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  showOnHomepage: integer('show_on_homepage', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Leads table
export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  message: text('message').notNull(),
  serviceInterest: text('service_interest'),
  source: text('source').notNull().default('website'),
  status: text('status').notNull().default('new'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Site Settings table
export const siteSettings = sqliteTable('site_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  themeMode: text('theme_mode').notNull().default('dark'),
  heroBgUrl: text('hero_bg_url'),
  logoLightUrl: text('logo_light_url'),
  logoDarkUrl: text('logo_dark_url'),
  whatsappNumber: text('whatsapp_number'),
  updatedAt: text('updated_at').notNull(),
});

// Add team table
export const team = sqliteTable('team', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nameEn: text('name_en').notNull(),
  nameFr: text('name_fr').notNull(),
  nameAr: text('name_ar').notNull(),
  photoUrl: text('photo_url').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add trusted companies table
export const trustedCompanies = sqliteTable('trusted_companies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  logoUrl: text('logo_url').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});