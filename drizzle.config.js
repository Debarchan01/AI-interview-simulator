import { defineConfig } from "drizzle-kit";

/** @type {import("drizzle-kit").Config} */
export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_9qXMpi7IswGg@ep-white-morning-a57opc4x-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
  },
});
