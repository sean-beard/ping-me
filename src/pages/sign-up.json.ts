import type { APIRoute } from "astro";

import { userService } from "@/services";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.formData();

  const username = body.get("username")?.toString();
  const password = body.get("password")?.toString();

  if (!username || !password) {
    return new Response(
      JSON.stringify({ error: "Username and password are required" }),
      {
        status: 400,
      },
    );
  }

  try {
    const user = await userService.createUser(username, password);

    if (!user) {
      return new Response(JSON.stringify({ error: "Error signing up." }), {
        status: 500,
      });
    }

    // TODO: render form with success message
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error signing up.";

    // TODO: render form with error messages
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
};
