import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "landing_sections_company_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_sections_company_paragraphs_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "landing_sections_vision_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "landing_sections_vision_items_locales" (
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "products" ADD COLUMN "wordmark_id" integer;
  ALTER TABLE "landing" ADD COLUMN "sections_company_founder_name" varchar;
  ALTER TABLE "landing" ADD COLUMN "sections_company_founder_portrait_id" integer;
  ALTER TABLE "landing_locales" ADD COLUMN "hero_tagline" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "sections_company_title" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "sections_company_lead" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "sections_company_founder_role" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "sections_company_founder_kicker" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "sections_company_founder_cta" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "sections_vision_title" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "sections_vision_lede" varchar;
  ALTER TABLE "landing_sections_company_paragraphs" ADD CONSTRAINT "landing_sections_company_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_company_paragraphs_locales" ADD CONSTRAINT "landing_sections_company_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_company_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_vision_items" ADD CONSTRAINT "landing_sections_vision_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_sections_vision_items_locales" ADD CONSTRAINT "landing_sections_vision_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_sections_vision_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "landing_sections_company_paragraphs_order_idx" ON "landing_sections_company_paragraphs" USING btree ("_order");
  CREATE INDEX "landing_sections_company_paragraphs_parent_id_idx" ON "landing_sections_company_paragraphs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "landing_sections_company_paragraphs_locales_locale_parent_id" ON "landing_sections_company_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "landing_sections_vision_items_order_idx" ON "landing_sections_vision_items" USING btree ("_order");
  CREATE INDEX "landing_sections_vision_items_parent_id_idx" ON "landing_sections_vision_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "landing_sections_vision_items_locales_locale_parent_id_uniqu" ON "landing_sections_vision_items_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "products" ADD CONSTRAINT "products_wordmark_id_media_id_fk" FOREIGN KEY ("wordmark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing" ADD CONSTRAINT "landing_sections_company_founder_portrait_id_media_id_fk" FOREIGN KEY ("sections_company_founder_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_wordmark_idx" ON "products" USING btree ("wordmark_id");
  CREATE INDEX "landing_sections_company_founder_sections_company_founde_idx" ON "landing" USING btree ("sections_company_founder_portrait_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing_sections_company_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "landing_sections_company_paragraphs_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "landing_sections_vision_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "landing_sections_vision_items_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "landing_sections_company_paragraphs" CASCADE;
  DROP TABLE "landing_sections_company_paragraphs_locales" CASCADE;
  DROP TABLE "landing_sections_vision_items" CASCADE;
  DROP TABLE "landing_sections_vision_items_locales" CASCADE;
  ALTER TABLE "products" DROP CONSTRAINT "products_wordmark_id_media_id_fk";
  
  ALTER TABLE "landing" DROP CONSTRAINT "landing_sections_company_founder_portrait_id_media_id_fk";
  
  DROP INDEX "products_wordmark_idx";
  DROP INDEX "landing_sections_company_founder_sections_company_founde_idx";
  ALTER TABLE "products" DROP COLUMN "wordmark_id";
  ALTER TABLE "landing" DROP COLUMN "sections_company_founder_name";
  ALTER TABLE "landing" DROP COLUMN "sections_company_founder_portrait_id";
  ALTER TABLE "landing_locales" DROP COLUMN "hero_tagline";
  ALTER TABLE "landing_locales" DROP COLUMN "sections_company_title";
  ALTER TABLE "landing_locales" DROP COLUMN "sections_company_lead";
  ALTER TABLE "landing_locales" DROP COLUMN "sections_company_founder_role";
  ALTER TABLE "landing_locales" DROP COLUMN "sections_company_founder_kicker";
  ALTER TABLE "landing_locales" DROP COLUMN "sections_company_founder_cta";
  ALTER TABLE "landing_locales" DROP COLUMN "sections_vision_title";
  ALTER TABLE "landing_locales" DROP COLUMN "sections_vision_lede";`)
}
