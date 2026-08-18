import PG from "pg";

const { Pool } = PG;

const url = process.env.TEST_DATABASE_URL;
if (!url) throw new Error("TEST_DATABASE_URL is not set");

export const testPool = new Pool({ connectionString: url });
