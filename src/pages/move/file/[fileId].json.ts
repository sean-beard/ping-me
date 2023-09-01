import type { APIRoute } from "astro";

import { fileService, folderService } from "@/services";
import { getUser, isAuthenticated } from "@/utils/auth";

export const post: APIRoute = async ({ params, request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(null, {
      status: 400,
      statusText: "Invalid Authorization header.",
    });
  }

  const body = await request.formData();

  const folderIds = body.getAll("folderIds");

  if (!folderIds.length) {
    return new Response(JSON.stringify({ error: "folderIds required" }), {
      status: 400,
    });
  }

  const user = getUser(cookies);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found." }), {
      status: 404,
    });
  }

  const file = await fileService.getFile(Number(params.fileId), user.id);

  if (!file) {
    return new Response(JSON.stringify({ error: "File not found." }), {
      status: 404,
    });
  }

  const promises = folderIds.map((folderId) => {
    return folderService.addFiles(Number(folderId), [file], user.id);
  });

  try {
    await Promise.all(promises);
  } catch {
    // TODO: more granular error handling
    return new Response(JSON.stringify({ error: "Error moving file." }), {
      status: 500,
    });
  }

  const response = `
    <h2>File moved successfully!</h2>
  `;

  return new Response(response, { status: 200 });
};
