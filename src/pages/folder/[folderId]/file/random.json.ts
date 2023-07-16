import type { APIRoute } from "astro";

import { folderService } from "@/services";

export const get: APIRoute = async ({ params }) => {
  const folderId = params.folderId;

  if (!folderId || isNaN(Number(folderId))) {
    return new Response(JSON.stringify({ error: "Folder ID is required" }), {
      status: 400,
    });
  }

  const randomFile = await folderService.getRandomFile(Number(folderId));

  if (!randomFile) {
    return new Response(
      JSON.stringify({
        error: "Error getting random file from folder with ID: " + folderId,
      }),
      { status: 500 }
    );
  }

  const html = `
    <div>
        <h2>${randomFile.name}</h2>
        ${randomFile.html}
    </div>
  `;

  return new Response(html, { status: 200 });
};
