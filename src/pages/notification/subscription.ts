import type { APIRoute } from "astro";

import { notificationService } from "@/services";
import { getUser, isAuthenticated } from "@/utils/auth";

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(null, {
      status: 400,
      statusText: "Invalid Authorization header.",
    });
  }

  const body = await request.json();

  const subscription = body.subscription;
  const origin = body.origin;

  if (!subscription || !origin) {
    return new Response(
      JSON.stringify({ error: "Subscription and origin are required" }),
      {
        status: 400,
      },
    );
  }

  const userId = getUser(cookies)?.id;

  if (!userId) {
    return new Response(JSON.stringify({ error: "User not found." }), {
      status: 404,
    });
  }

  await notificationService.createSubscription(userId, subscription, origin);

  return new Response(null, { status: 201 });
};
