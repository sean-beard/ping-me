import type { APIRoute } from "astro";

import { fileService } from "@/services";

export const del: APIRoute = async ({ params }) => {
  const fileId = params.fileId;

  if (!fileId || isNaN(Number(fileId))) {
    return new Response(JSON.stringify({ error: "File ID is required" }), {
      status: 400,
    });
  }

  const deletedFileId = await fileService.deleteFile(Number(fileId));

  if (!deletedFileId) {
    return new Response(
      JSON.stringify({ error: "Error deleting file with ID: " + fileId }),
      { status: 500 },
    );
  }

  const response = new Response(null, { status: 201 });

  response.headers.set("HX-Refresh", "true");

  return response;
};
