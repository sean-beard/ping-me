import jwt from "jsonwebtoken";
import type { AstroCookies } from "astro";
import type { User } from "@/services/types";

export const getUser = (cookies: AstroCookies): User | null => {
  let user: User | undefined;
  const userJwt = cookies.get("ping-me-user")?.value ?? "";

  if (!userJwt) return null;

  try {
    user = jwt.verify(userJwt, import.meta.env.SECRET_JWT_KEY) as User;
  } catch {
    console.log(`User not found in JWT: ${userJwt}`);
    return null;
  }

  return user;
};

export const isAuthenticated = (cookies: AstroCookies): boolean => {
  const user = getUser(cookies);

  return !!user;
};

export const signIn = (
  user: User,
  cookies: AstroCookies,
  redirect: string = "/",
) => {
  const JWT_OPTIONS: jwt.SignOptions = { expiresIn: "7d" };
  const userJwt = jwt.sign(user, import.meta.env.SECRET_JWT_KEY, JWT_OPTIONS);

  cookies.set("ping-me-user", userJwt, { path: "/" });

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { ["HX-Redirect"]: redirect },
  });
};
