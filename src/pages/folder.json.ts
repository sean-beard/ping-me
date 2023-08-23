import type { APIRoute } from "astro";

import { folderService } from "../services";
// @ts-ignore
import CreateFolderButtonSuccess from "./create-folder-button-success.html";
import { FolderRow } from "../components/FolderRow";
import { getUser, isAuthenticated } from "@/utils/auth";

export const post: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(null, {
      status: 400,
      statusText: "Invalid Authorization header.",
    });
  }

  const body = await request.formData();

  const folderName = body.get("folderName");

  if (!folderName) {
    return new Response(JSON.stringify({ error: "Folder name is required" }), {
      status: 400,
    });
  }

  const user = getUser(cookies);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found." }), {
      status: 404,
    });
  }

  const createdFolder = await folderService.createFolder(
    folderName.toString(),
    user.id,
  );

  const folderId = createdFolder?.id;

  if (!folderId) {
    return new Response(JSON.stringify({ error: "Error creating folder." }), {
      status: 500,
    });
  }

  const html = `
    <div hx-swap-oob="afterbegin:#folder-list">
        ${FolderRow({ folder: createdFolder })}
    </div>

    ${CreateFolderButtonSuccess({ slots: [] })}
  `;

  return new Response(html, { status: 200 });
};
