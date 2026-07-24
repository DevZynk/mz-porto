import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_pricing_plans" ADD COLUMN "base_price" numeric;
  ALTER TABLE "services_locales" DROP COLUMN "description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_locales" ADD COLUMN "description" varchar NOT NULL;
  ALTER TABLE "services_pricing_plans" DROP COLUMN "base_price";`)
}
