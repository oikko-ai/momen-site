import * as migration_20260930_231559_initial from './20260930_231559_initial';
import * as migration_20260930_232549_work_pages from './20260930_232549_work_pages';

export const migrations = [
  {
    up: migration_20260930_231559_initial.up,
    down: migration_20260930_231559_initial.down,
    name: '20260930_231559_initial',
  },
  {
    up: migration_20260930_232549_work_pages.up,
    down: migration_20260930_232549_work_pages.down,
    name: '20260930_232549_work_pages'
  },
];
