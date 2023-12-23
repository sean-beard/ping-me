import type { APIRoute } from "astro";

import { folderService } from "@/services";
import { isAuthenticated } from "@/utils/auth";

export const POST: APIRoute = async ({ cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(null, {
      status: 400,
      statusText: "Invalid Authorization header.",
    });
  }

  folderService.sendNotifications();

  return new Response(null, { status: 201 });
};
