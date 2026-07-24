import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_rels" DROP CONSTRAINT "projects_rels_services_fk";
  
  DROP INDEX "projects_rels_services_id_idx";
  ALTER TABLE "projects" ADD COLUMN "meta_services_id" integer;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_meta_services_id_services_id_fk" FOREIGN KEY ("meta_services_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_meta_meta_services_idx" ON "projects" USING btree ("meta_services_id");
  ALTER TABLE "projects_rels" DROP COLUMN "services_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" DROP CONSTRAINT "projects_meta_services_id_services_id_fk";
  
  DROP INDEX "projects_meta_meta_services_idx";
  ALTER TABLE "projects_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_rels_services_id_idx" ON "projects_rels" USING btree ("services_id");
  ALTER TABLE "projects" DROP COLUMN "meta_services_id";`)
}
