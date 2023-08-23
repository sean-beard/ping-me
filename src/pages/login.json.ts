import jwt from "jsonwebtoken";
import type { APIRoute } from "astro";

import { userService } from "@/services";

const JWT_OPTIONS: jwt.SignOptions = { expiresIn: "7d" };

export const post: APIRoute = async ({ request, cookies }) => {
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
    const user = await userService.login(username, password);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found." }), {
        status: 404,
      });
    }

    // TODO: add this env var
    const userJwt = jwt.sign(user, import.meta.env.SECRET_JWT_KEY, JWT_OPTIONS);
    cookies.set("ping-me-user", userJwt, { path: "/" });

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { ["HX-Refresh"]: "true" },
    });
  } catch (error) {
    const genericErrorMessage = "Error logging in.";

    if (error instanceof Error) {
      // TODO: render form with error messages
      switch (error.message) {
        case "User not found":
          return new Response(JSON.stringify({ error: "User not found." }), {
            status: 404,
          });
        case "Invalid password":
          return new Response(JSON.stringify({ error: "Invalid password." }), {
            status: 401,
          });
        default:
          return new Response(JSON.stringify({ error: genericErrorMessage }), {
            status: 500,
          });
      }
    }

    return new Response(JSON.stringify({ error: genericErrorMessage }), {
      status: 500,
    });
  }
};
