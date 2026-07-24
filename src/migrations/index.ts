import * as migration_20260722_222256_rename_service_to_services from './20260722_222256_rename_service_to_services';
import * as migration_20260723_074326_my_services_plans_migration from './20260723_074326_my_services_plans_migration';
import * as migration_20260723_075503_add_base_price_to_plans from './20260723_075503_add_base_price_to_plans';
import * as migration_20260723_094825_change_project_services_to_single_relation from './20260723_094825_change_project_services_to_single_relation';

export const migrations = [
  {
    up: migration_20260722_222256_rename_service_to_services.up,
    down: migration_20260722_222256_rename_service_to_services.down,
    name: '20260722_222256_rename_service_to_services',
  },
  {
    up: migration_20260723_074326_my_services_plans_migration.up,
    down: migration_20260723_074326_my_services_plans_migration.down,
    name: '20260723_074326_my_services_plans_migration',
  },
  {
    up: migration_20260723_075503_add_base_price_to_plans.up,
    down: migration_20260723_075503_add_base_price_to_plans.down,
    name: '20260723_075503_add_base_price_to_plans',
  },
  {
    up: migration_20260723_094825_change_project_services_to_single_relation.up,
    down: migration_20260723_094825_change_project_services_to_single_relation.down,
    name: '20260723_094825_change_project_services_to_single_relation'
  },
];
