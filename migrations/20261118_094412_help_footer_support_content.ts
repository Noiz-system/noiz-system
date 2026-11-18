import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "support_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "support_page_locales" (
  	"hero_kicker" varchar NOT NULL,
  	"hero_title" varchar NOT NULL,
  	"hero_intro" varchar NOT NULL,
  	"hero_product_tagline" varchar NOT NULL,
  	"aside_title" varchar NOT NULL,
  	"aside_body" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"seo_og_description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "landing" ADD COLUMN "footer_address" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "sections_help_kicker" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "sections_help_cta" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "sections_help_title" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "sections_help_body" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "footer_cta_kicker" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "footer_cta_title" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "footer_cta_button" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "footer_support_link" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "footer_rights" varchar;
  ALTER TABLE "landing_locales" ADD COLUMN "footer_legal" varchar;
  ALTER TABLE "support_page_locales" ADD CONSTRAINT "support_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."support_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "support_page_locales_locale_parent_id_unique" ON "support_page_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "support_page" CASCADE;
  DROP TABLE "support_page_locales" CASCADE;
  ALTER TABLE "landing" DROP COLUMN "footer_address";
  ALTER TABLE "landing_locales" DROP COLUMN "sections_help_kicker";
  ALTER TABLE "landing_locales" DROP COLUMN "sections_help_cta";
  ALTER TABLE "landing_locales" DROP COLUMN "sections_help_title";
  ALTER TABLE "landing_locales" DROP COLUMN "sections_help_body";
  ALTER TABLE "landing_locales" DROP COLUMN "footer_cta_kicker";
  ALTER TABLE "landing_locales" DROP COLUMN "footer_cta_title";
  ALTER TABLE "landing_locales" DROP COLUMN "footer_cta_button";
  ALTER TABLE "landing_locales" DROP COLUMN "footer_support_link";
  ALTER TABLE "landing_locales" DROP COLUMN "footer_rights";
  ALTER TABLE "landing_locales" DROP COLUMN "footer_legal";`)
}
