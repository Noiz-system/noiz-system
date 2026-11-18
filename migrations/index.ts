import * as migration_20261110_165858_initial from './20261110_165858_initial';
import * as migration_20261117_064608_company_vision_sections from './20261117_064608_company_vision_sections';
import * as migration_20261118_094412_help_footer_support_content from './20261118_094412_help_footer_support_content';
import * as migration_20261118_103307_media_storage_prefix from './20261118_103307_media_storage_prefix';

export const migrations = [
  {
    up: migration_20261110_165858_initial.up,
    down: migration_20261110_165858_initial.down,
    name: '20261110_165858_initial',
  },
  {
    up: migration_20261117_064608_company_vision_sections.up,
    down: migration_20261117_064608_company_vision_sections.down,
    name: '20261117_064608_company_vision_sections',
  },
  {
    up: migration_20261118_094412_help_footer_support_content.up,
    down: migration_20261118_094412_help_footer_support_content.down,
    name: '20261118_094412_help_footer_support_content',
  },
  {
    up: migration_20261118_103307_media_storage_prefix.up,
    down: migration_20261118_103307_media_storage_prefix.down,
    name: '20261118_103307_media_storage_prefix'
  },
];
