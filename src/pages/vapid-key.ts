import { isAuthenticated } from "@/utils/auth";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(null, {
      status: 400,
      statusText: "Invalid Authorization header.",
    });
  }

  const vapidKey = process.env.VAPID_PUBLIC_KEY;

  if (!vapidKey) {
    return new Response(JSON.stringify({ error: "Error getting vapid key." }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ vapidKey }), { status: 200 });
};
