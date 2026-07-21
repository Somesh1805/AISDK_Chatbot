import { db } from "../../db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return Response.json({ message: "Database Connected ✅" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Connection Failed ❌" }, { status: 500 });
  }
}