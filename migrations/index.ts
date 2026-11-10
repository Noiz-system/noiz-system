import * as migration_20261110_165858_initial from './20261110_165858_initial';

export const migrations = [
  {
    up: migration_20261110_165858_initial.up,
    down: migration_20261110_165858_initial.down,
    name: '20261110_165858_initial'
  },
];
