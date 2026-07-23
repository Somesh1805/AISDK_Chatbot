import { getConversation } from "@/app/db/queries-json/chat";

export async function POST(req: Request) {
  const { sessionId } = await req.json();

  const conversation = await getConversation(sessionId);

  return Response.json(conversation);
}