import type { APIRoute } from "astro";

import { fileService, folderService } from "@/services";
import { getUser, isAuthenticated } from "@/utils/auth";

export const POST: APIRoute = async ({ params, request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(null, {
      status: 400,
      statusText: "Invalid Authorization header.",
    });
  }

  const body = await request.formData();

  const { folderId } = params;
  const fileIds = body.getAll("fileIds");

  if (!folderId) {
    return new Response(JSON.stringify({ error: "folderId required" }), {
      status: 400,
    });
  }

  if (!fileIds.length) {
    return new Response(JSON.stringify({ error: "fileIds required" }), {
      status: 400,
    });
  }

  const user = getUser(cookies);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found." }), {
      status: 404,
    });
  }

  const files = await fileService.getFilesByIds(fileIds.map(Number), user.id);

  if (!files) {
    return new Response(JSON.stringify({ error: "Failed to fetch files" }), {
      status: 404,
    });
  }

  try {
    await folderService.addFiles(Number(folderId), files, user.id);
  } catch {
    // TODO: more granular error handling
    return new Response(JSON.stringify({ error: "Error moving files." }), {
      status: 500,
    });
  }

  const response = new Response(null, { status: 201 });

  response.headers.set("HX-Refresh", "true");

  return response;
};
