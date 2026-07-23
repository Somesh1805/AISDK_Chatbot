import { db } from "@/app/db";
import { chatSessionsJson } from "@/app/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const sessions = await db
    .select({
      id: chatSessionsJson.id,
      title: chatSessionsJson.title,
    })
    .from(chatSessionsJson)
    .orderBy(desc(chatSessionsJson.updatedAt));

  return Response.json(sessions);
}

// import { db } from "@/app/db";
// import { chatSessionsJson } from "@/app/db/schema";

// export async function GET() {
//   const sessions = await db
//     .select()
//     .from(chatSessionsJson);

//   return Response.json(sessions);
// }