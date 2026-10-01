import * as migration_20260930_231009_initial from './20260930_231009_initial';
import * as migration_20260930_232524_work_pages from './20260930_232524_work_pages';
import * as migration_20260930_234346_media_personas from './20260930_234346_media_personas';
import * as migration_20261001_021237_notes_articles from './20261001_021237_notes_articles';
import * as migration_20261001_102336_relations_polish from './20261001_102336_relations_polish';
import * as migration_20261001_104629_activity_chat from './20261001_104629_activity_chat';

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
    name: '20260930_234346_media_personas',
  },
  {
    up: migration_20261001_021237_notes_articles.up,
    down: migration_20261001_021237_notes_articles.down,
    name: '20261001_021237_notes_articles',
  },
  {
    up: migration_20261001_102336_relations_polish.up,
    down: migration_20261001_102336_relations_polish.down,
    name: '20261001_102336_relations_polish',
  },
  {
    up: migration_20261001_104629_activity_chat.up,
    down: migration_20261001_104629_activity_chat.down,
    name: '20261001_104629_activity_chat'
  },
];
