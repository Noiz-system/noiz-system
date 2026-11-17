import * as migration_20261110_165858_initial from './20261110_165858_initial';
import * as migration_20261117_064608_company_vision_sections from './20261117_064608_company_vision_sections';

export const migrations = [
  {
    up: migration_20261110_165858_initial.up,
    down: migration_20261110_165858_initial.down,
    name: '20261110_165858_initial',
  },
  {
    up: migration_20261117_064608_company_vision_sections.up,
    down: migration_20261117_064608_company_vision_sections.down,
    name: '20261117_064608_company_vision_sections'
  },
];
