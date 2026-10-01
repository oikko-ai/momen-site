import * as migration_20260930_231559_initial from './20260930_231559_initial';
import * as migration_20260930_232549_work_pages from './20260930_232549_work_pages';
import * as migration_20260930_234351_media_personas from './20260930_234351_media_personas';
import * as migration_20261001_021254_notes_articles from './20261001_021254_notes_articles';
import * as migration_20261001_102350_relations_polish from './20261001_102350_relations_polish';

export const migrations = [
  {
    up: migration_20260930_231559_initial.up,
    down: migration_20260930_231559_initial.down,
    name: '20260930_231559_initial',
  },
  {
    up: migration_20260930_232549_work_pages.up,
    down: migration_20260930_232549_work_pages.down,
    name: '20260930_232549_work_pages',
  },
  {
    up: migration_20260930_234351_media_personas.up,
    down: migration_20260930_234351_media_personas.down,
    name: '20260930_234351_media_personas',
  },
  {
    up: migration_20261001_021254_notes_articles.up,
    down: migration_20261001_021254_notes_articles.down,
    name: '20261001_021254_notes_articles',
  },
  {
    up: migration_20261001_102350_relations_polish.up,
    down: migration_20261001_102350_relations_polish.down,
    name: '20261001_102350_relations_polish'
  },
];
