import jwt from "jsonwebtoken";
import type { AstroCookies } from "astro";
import type { User } from "@/services/types";

export const getUser = (cookies: AstroCookies): User | null => {
  let user: User | undefined;
  const userJwt = cookies.get("ping-me-user").value ?? "";

  try {
    user = jwt.verify(userJwt, import.meta.env.SECRET_JWT_KEY) as User;
  } catch {
    console.log("User not found in JWT");
    return null;
  }

  return user;
};

export const isAuthenticated = (cookies: AstroCookies): boolean => {
  const user = getUser(cookies);

  return !!user;
};
