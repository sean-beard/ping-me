import type { APIRoute } from "astro";

import { getUser, isAuthenticated } from "@/utils/auth";
import { folderService } from "../../../services";
import type { FolderNotificationPreference } from "../../../services/types";
import { FolderRow } from "../../../components/FolderRow";

const isValidNotificationPreference = (
  pref: string,
): pref is FolderNotificationPreference =>
  ["daily", "weekly", "never"].includes(pref.toString());

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

  const html = `
    <li hx-trigger='cancel' hx-get="/folder/${folder.id}">
        <label for="folder-name">Folder name</label>
        <input type="text" id="folder-name" name="folderName" value='${folder.name}' />

        <button hx-get="/folder/${folder.id}/row.json">
            Cancel
        </button>

        <button hx-put="/folder/${folder.id}/edit.json" hx-include="closest li">
            Save
        </button>
    </li>
  `;

  return new Response(html, { status: 200 });
};

export const post: APIRoute = async ({ request, params, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(null, {
      status: 400,
      statusText: "Invalid Authorization header.",
    });
  }

  const user = getUser(cookies);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found." }), {
      status: 404,
    });
  }

  const folderId = params.folderId;

  if (!folderId || isNaN(Number(folderId))) {
    return new Response(JSON.stringify({ error: "Folder ID is required" }), {
      status: 400,
    });
  }

  const body = await request.formData();

  const notificationPreferenceFormData = body.get("notificationPreference");

  if (!notificationPreferenceFormData) {
    return new Response(
      JSON.stringify({ error: "Notification preference is required" }),
      { status: 400 },
    );
  }

  const notificationPreference = notificationPreferenceFormData.toString();

  if (!isValidNotificationPreference(notificationPreference)) {
    console.log(`Invalid notification preference: ${notificationPreference}`);

    return new Response(
      JSON.stringify({ error: "Invalid notification preference" }),
      { status: 400 },
    );
  }

  const result = folderService.setNotificationPreference(
    user.id,
    Number(folderId),
    notificationPreference,
  );

  if (!result) {
    return new Response(
      JSON.stringify({ error: "Error updating notification preference" }),
      { status: 500 },
    );
  }

  return new Response("<p>Notification preference updated</p>", {
    status: 200,
  });
};

export const put: APIRoute = async ({ request, params, cookies }) => {
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

  const body = await request.formData();

  const folderName = body.get("folderName");

  if (!folderName) {
    return new Response(JSON.stringify({ error: "Folder name is required" }), {
      status: 400,
    });
  }

  const folder = await folderService.updateFolder(Number(folderId), {
    name: folderName.toString(),
  });

  if (!folder) {
    return new Response(
      JSON.stringify({ error: "Error updating folder with ID: " + folderId }),
      {
        status: 500,
      },
    );
  }

  const response = FolderRow({ folder });

  return new Response(response, { status: 200 });
};
