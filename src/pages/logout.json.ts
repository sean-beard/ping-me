import { isAuthenticated } from "@/utils/auth";
import type { APIRoute } from "astro";

export const post: APIRoute = async ({ cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(null, {
      status: 400,
      statusText: "Invalid Authorization header.",
    });
  }

  cookies.delete("ping-me-user", { path: "/" });

  return new Response(null, {
    status: 201,
    headers: { ["HX-Redirect"]: "/" },
  });
};
