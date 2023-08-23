import type { APIRoute } from "astro";
import { folderService } from "../../../services";
import { FolderRow } from "../../../components/FolderRow";
import { getUser, isAuthenticated } from "@/utils/auth";

export const get: APIRoute = async ({ params, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(null, {
      status: 400,
      statusText: "Invalid Authorization header.",
    });
  }

  const folderId = params.folderId;

  if (!folderId || isNaN(Number(folderId))) {
    return new Response(JSON.stringify({ error: "Folder ID is required" }), {
      status: 400,
    });
  }

  const user = getUser(cookies);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found." }), {
      status: 404,
    });
  }

  const folder = await folderService.getFolder(Number(folderId), user.id);

  if (!folder) {
    return new Response(JSON.stringify({ error: "Folder not found" }), {
      status: 404,
    });
  }

  const response = FolderRow({ folder });

  return new Response(response, { status: 200 });
};
