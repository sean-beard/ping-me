import type { APIRoute } from "astro";

import { folderService } from "@/services";

export const POST: APIRoute = async ({ request }) => {
  if (
    request.headers.get("origin") !==
    process.env.NOTIFICATION_ENDPOINT_ALLOWED_ORIGIN
  ) {
    console.error(
      "WARNING: Invalid origin attempting to send notifications:",
      request.headers.get("origin") ?? "unknown",
    );
    return new Response(null, { status: 403 });
  }

  try {
    await folderService.sendNotifications();
  } catch (error) {
    console.log("Error sending notifications", error);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 201 });
};
