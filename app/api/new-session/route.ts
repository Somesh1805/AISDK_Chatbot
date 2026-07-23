import { createJsonSession } from "@/app/db/queries-json/chat";

export async function POST() {
  const session = await createJsonSession();

  return Response.json(session);
}