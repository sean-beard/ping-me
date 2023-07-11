import type { APIRoute } from "astro";
import { folderService } from "../../../services";
import { FolderRow } from "../../../components/FolderRow";

export const get: APIRoute = async ({ params }) => {
  const folderId = params.folderId;

  if (!folderId || isNaN(Number(folderId))) {
    return new Response(JSON.stringify({ error: "Folder ID is required" }), {
      status: 400,
    });
  }

  const folder = await folderService.getFolder(Number(folderId));

  if (!folder) {
    return new Response(JSON.stringify({ error: "Folder not found" }), {
      status: 404,
    });
  }

  const response = FolderRow({ folder });

  return new Response(response, { status: 200 });
};
