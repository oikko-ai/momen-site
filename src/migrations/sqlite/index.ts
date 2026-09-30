import * as migration_20260930_231009_initial from './20260930_231009_initial';

export const migrations = [
  {
    up: migration_20260930_231009_initial.up,
    down: migration_20260930_231009_initial.down,
    name: '20260930_231009_initial'
  },
];
