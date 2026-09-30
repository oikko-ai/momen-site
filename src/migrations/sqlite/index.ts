import * as migration_20260930_231009_initial from './20260930_231009_initial';
import * as migration_20260930_232524_work_pages from './20260930_232524_work_pages';
import * as migration_20260930_234346_media_personas from './20260930_234346_media_personas';

export const migrations = [
  {
    up: migration_20260930_231009_initial.up,
    down: migration_20260930_231009_initial.down,
    name: '20260930_231009_initial',
  },
  {
    up: migration_20260930_232524_work_pages.up,
    down: migration_20260930_232524_work_pages.down,
    name: '20260930_232524_work_pages',
  },
  {
    up: migration_20260930_234346_media_personas.up,
    down: migration_20260930_234346_media_personas.down,
    name: '20260930_234346_media_personas'
  },
];
