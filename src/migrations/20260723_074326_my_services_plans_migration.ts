import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "services_pricing_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_pricing_plans_features_locales" (
  	"feature" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"price" numeric NOT NULL
  );
  
  CREATE TABLE "services_pricing_plans_locales" (
  	"name" varchar NOT NULL,
  	"price_suffix" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "services" ADD COLUMN "cta_link" varchar DEFAULT 'https://wa.me/628xxx';
  ALTER TABLE "services" ADD COLUMN "is_featured" boolean DEFAULT false;
  ALTER TABLE "services" ADD COLUMN "content_content" jsonb;
  ALTER TABLE "services_locales" ADD COLUMN "cta_text" varchar DEFAULT 'Hubungi Kami';
  ALTER TABLE "services_locales" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "services_locales" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "news" ADD COLUMN "slug" varchar NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "slug" varchar NOT NULL;
  ALTER TABLE "projects" ADD COLUMN "meta_client_id" integer;
  ALTER TABLE "services_pricing_plans_features" ADD CONSTRAINT "services_pricing_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_pricing_plans_features_locales" ADD CONSTRAINT "services_pricing_plans_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_pricing_plans_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_pricing_plans" ADD CONSTRAINT "services_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_pricing_plans_locales" ADD CONSTRAINT "services_pricing_plans_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_pricing_plans_features_order_idx" ON "services_pricing_plans_features" USING btree ("_order");
  CREATE INDEX "services_pricing_plans_features_parent_id_idx" ON "services_pricing_plans_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_pricing_plans_features_locales_locale_parent_id_uni" ON "services_pricing_plans_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_pricing_plans_order_idx" ON "services_pricing_plans" USING btree ("_order");
  CREATE INDEX "services_pricing_plans_parent_id_idx" ON "services_pricing_plans" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_pricing_plans_locales_locale_parent_id_unique" ON "services_pricing_plans_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_meta_client_id_clients_id_fk" FOREIGN KEY ("meta_client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_meta_meta_image_idx" ON "services_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_meta_meta_client_idx" ON "projects" USING btree ("meta_client_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_pricing_plans_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_pricing_plans_features_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_pricing_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_pricing_plans_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_pricing_plans_features" CASCADE;
  DROP TABLE "services_pricing_plans_features_locales" CASCADE;
  DROP TABLE "services_pricing_plans" CASCADE;
  DROP TABLE "services_pricing_plans_locales" CASCADE;
  ALTER TABLE "services_locales" DROP CONSTRAINT "services_locales_meta_image_id_media_id_fk";
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_meta_client_id_clients_id_fk";
  
  DROP INDEX "services_meta_meta_image_idx";
  DROP INDEX "news_slug_idx";
  DROP INDEX "projects_slug_idx";
  DROP INDEX "projects_meta_meta_client_idx";
  ALTER TABLE "services" DROP COLUMN "cta_link";
  ALTER TABLE "services" DROP COLUMN "is_featured";
  ALTER TABLE "services" DROP COLUMN "content_content";
  ALTER TABLE "services_locales" DROP COLUMN "cta_text";
  ALTER TABLE "services_locales" DROP COLUMN "meta_title";
  ALTER TABLE "services_locales" DROP COLUMN "meta_description";
  ALTER TABLE "services_locales" DROP COLUMN "meta_image_id";
  ALTER TABLE "news" DROP COLUMN "slug";
  ALTER TABLE "projects" DROP COLUMN "slug";
  ALTER TABLE "projects" DROP COLUMN "meta_client_id";`)
}
