import { userService } from "@/services";
import { isAuthenticated } from "@/utils/auth";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(null, {
      status: 400,
      statusText: "Invalid Authorization header.",
    });
  }

  const body = await request.json();

  const userId = body.userId;
  const enabled = body.enabled;

  if (!userId || enabled === undefined || enabled === null) {
    return new Response(
      JSON.stringify({ error: "User ID and enabled values are required" }),
      {
        status: 400,
      },
    );
  }

  try {
    await userService.setNotificationsEnabledPreference(
      Number(userId),
      Boolean(enabled),
    );
  } catch {
    return new Response(
      JSON.stringify({
        error: "Error setting notifications enabled preference.",
      }),
      {
        status: 500,
      },
    );
  }

  return new Response(null, { status: 201 });
};
