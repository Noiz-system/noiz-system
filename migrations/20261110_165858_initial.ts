import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_markets_status" AS ENUM('live', 'next', 'study');
  CREATE TYPE "public"."enum_posts_category" AS ENUM('product', 'logistics', 'company');
  CREATE TYPE "public"."enum_landing_sections_capabilities_items_icon" AS ENUM('mobile', 'logistics', 'platform');
  CREATE TABLE "products_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_bullets_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"image_id" integer,
  	"cta_href" varchar,
  	"app_store_url" varchar,
  	"play_store_url" varchar,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_locales" (
  	"status" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"cta" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "markets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_markets_status" DEFAULT 'study' NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "markets_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "markets_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"link" varchar,
  	"category" "enum_posts_category" DEFAULT 'company' NOT NULL,
  	"published_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"markets_id" integer,
  	"posts_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "landing_hero_ticker" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_hero_ticker_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "landing_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_hero_stats_locales" (
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "landing_sections_capabilities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_landing_sections_capabilities_items_icon" NOT NULL
  );
  
  CREATE TABLE "landing_sections_capabilities_items_locales" (
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "landing_sections_method_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_sections_method_steps_locales" (
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "landing" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"contact_email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "landing_locales" (
  	"hero_kicker" varchar NOT NULL,
  	"hero_title" varchar NOT NULL,
  	"hero_body" varchar NOT NULL,
  	"hero_primary_cta" varchar NOT NULL,
  	"hero_secondary_cta" varchar NOT NULL,
  	"sections_products_title" varchar NOT NULL,
  	"sections_products_lede" varchar NOT NULL,
  	"sections_capabilities_title" varchar NOT NULL,
  	"sections_capabilities_lede" varchar NOT NULL,
  	"sections_method_title" varchar NOT NULL,
  	"sections_markets_title" varchar NOT NULL,
  	"sections_markets_body" varchar NOT NULL,
  	"sections_markets_note" varchar,
  	"sections_news_title" varchar NOT NULL,
  	"sections_faq_title" varchar NOT NULL,
  	"contact_title" varchar NOT NULL,
  	"contact_body" varchar NOT NULL,
  	"footer_tagline" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"seo_og_description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "products_bullets" ADD CONSTRAINT "products_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_bullets_locales" ADD CONSTRAINT "products_bullets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_bullets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "markets_locales" ADD CONSTRAINT "markets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "markets_rels" ADD CONSTRAINT "markets_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "markets_rels" ADD CONSTRAINT "markets_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_markets_fk" FOREIGN KEY ("markets_id") REFERENCES "public"."markets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_hero_ticker" ADD CONSTRAINT "landing_hero_ticker_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_hero_ticker_locales" ADD CONSTRAINT "landing_hero_ticker_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_hero_ticker"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_hero_stats" ADD CONSTRAINT "landing_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_hero_stats_locales" ADD CONSTRAINT "landing_hero_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_hero_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_capabilities_items" ADD CONSTRAINT "landing_sections_capabilities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_capabilities_items_locales" ADD CONSTRAINT "landing_sections_capabilities_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_method_steps" ADD CONSTRAINT "landing_sections_method_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_method_steps_locales" ADD CONSTRAINT "landing_sections_method_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_method_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing" ADD CONSTRAINT "landing_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_locales" ADD CONSTRAINT "landing_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_bullets_order_idx" ON "products_bullets" USING btree ("_order");
  CREATE INDEX "products_bullets_parent_id_idx" ON "products_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_bullets_locales_locale_parent_id_unique" ON "products_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "markets_updated_at_idx" ON "markets" USING btree ("updated_at");
  CREATE INDEX "markets_created_at_idx" ON "markets" USING btree ("created_at");
  CREATE UNIQUE INDEX "markets_locales_locale_parent_id_unique" ON "markets_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "markets_rels_order_idx" ON "markets_rels" USING btree ("order");
  CREATE INDEX "markets_rels_parent_idx" ON "markets_rels" USING btree ("parent_id");
  CREATE INDEX "markets_rels_path_idx" ON "markets_rels" USING btree ("path");
  CREATE INDEX "markets_rels_products_id_idx" ON "markets_rels" USING btree ("products_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_markets_id_idx" ON "payload_locked_documents_rels" USING btree ("markets_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "landing_hero_ticker_order_idx" ON "landing_hero_ticker" USING btree ("_order");
  CREATE INDEX "landing_hero_ticker_parent_id_idx" ON "landing_hero_ticker" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "landing_hero_ticker_locales_locale_parent_id_unique" ON "landing_hero_ticker_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "landing_hero_stats_order_idx" ON "landing_hero_stats" USING btree ("_order");
  CREATE INDEX "landing_hero_stats_parent_id_idx" ON "landing_hero_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "landing_hero_stats_locales_locale_parent_id_unique" ON "landing_hero_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "landing_sections_capabilities_items_order_idx" ON "landing_sections_capabilities_items" USING btree ("_order");
  CREATE INDEX "landing_sections_capabilities_items_parent_id_idx" ON "landing_sections_capabilities_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "landing_sections_capabilities_items_locales_locale_parent_id" ON "landing_sections_capabilities_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "landing_sections_method_steps_order_idx" ON "landing_sections_method_steps" USING btree ("_order");
  CREATE INDEX "landing_sections_method_steps_parent_id_idx" ON "landing_sections_method_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "landing_sections_method_steps_locales_locale_parent_id_uniqu" ON "landing_sections_method_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "landing_hero_hero_image_idx" ON "landing" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "landing_locales_locale_parent_id_unique" ON "landing_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_bullets" CASCADE;
  DROP TABLE "products_bullets_locales" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "markets" CASCADE;
  DROP TABLE "markets_locales" CASCADE;
  DROP TABLE "markets_rels" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "landing_hero_ticker" CASCADE;
  DROP TABLE "landing_hero_ticker_locales" CASCADE;
  DROP TABLE "landing_hero_stats" CASCADE;
  DROP TABLE "landing_hero_stats_locales" CASCADE;
  DROP TABLE "landing_sections_capabilities_items" CASCADE;
  DROP TABLE "landing_sections_capabilities_items_locales" CASCADE;
  DROP TABLE "landing_sections_method_steps" CASCADE;
  DROP TABLE "landing_sections_method_steps_locales" CASCADE;
  DROP TABLE "landing" CASCADE;
  DROP TABLE "landing_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_markets_status";
  DROP TYPE "public"."enum_posts_category";
  DROP TYPE "public"."enum_landing_sections_capabilities_items_icon";`)
}
