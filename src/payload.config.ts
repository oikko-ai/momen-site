import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { collections } from "./cms/collections";
import { globals } from "./cms/globals";
import { seed } from "./cms/seed";
import { migrations as sqliteMigrations } from "./migrations/sqlite";
import { migrations as postgresMigrations } from "./migrations/postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const dbUrl = process.env.DATABASE_URL || "";

// On Vercel the file system is temporary, so a real database and secret are required.
if (process.env.VERCEL && !process.env.PAYLOAD_SECRET) throw new Error("Set PAYLOAD_SECRET in the Vercel project's environment variables.");
if (process.env.VERCEL && !dbUrl.startsWith("postgres")) throw new Error("Set DATABASE_URL to a Postgres database (for example Neon) in the Vercel project's environment variables.");

// Content lives in SQLite (data/cms.db) by default. Set DATABASE_URL to a postgres:// URL in production.
export default buildConfig({
  admin: {
    user: "users",
    meta: { titleSuffix: " · Momen CMS" },
  },
  collections,
  globals,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-only-secret-change-me",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  db: dbUrl.startsWith("postgres")
    ? postgresAdapter({
        pool: { connectionString: dbUrl },
        migrationDir: path.resolve(dirname, "migrations/postgres"),
        prodMigrations: postgresMigrations,
      })
    : sqliteAdapter({
        client: { url: dbUrl || `file:${path.resolve(dirname, "../data/cms.db")}` },
        migrationDir: path.resolve(dirname, "migrations/sqlite"),
        prodMigrations: sqliteMigrations,
      }),
  sharp,
  // On Vercel, uploads go to Vercel Blob (set BLOB_READ_WRITE_TOKEN). Elsewhere they are saved to media/.
  plugins: process.env.BLOB_READ_WRITE_TOKEN
    ? [vercelBlobStorage({ collections: { media: true }, token: process.env.BLOB_READ_WRITE_TOKEN })]
    : [],
  onInit: seed,
});
