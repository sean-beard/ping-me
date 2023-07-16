import type { APIRoute } from "astro";

import { folderService } from "@/services";

export const del: APIRoute = async ({ params }) => {
  const folderId = params.folderId;
  const fileId = params.fileId;

  if (!folderId || isNaN(Number(folderId))) {
    return new Response(JSON.stringify({ error: "File ID is required" }), {
      status: 400,
    });
  }

  if (!fileId || isNaN(Number(fileId))) {
    return new Response(JSON.stringify({ error: "File ID is required" }), {
      status: 400,
    });
  }

  const updatedFolder = await folderService.deleteFiles(Number(folderId), [
    Number(fileId),
  ]);

  if (!updatedFolder) {
    return new Response(
      JSON.stringify({ error: "Error deleting file with ID: " + fileId }),
      { status: 500 }
    );
  }

  const response = new Response(null, { status: 201 });

  response.headers.set("HX-Refresh", "true");

  return response;
};
