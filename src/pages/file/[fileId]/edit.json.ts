import type { APIRoute } from "astro";

import { fileService } from "@/services";

export const get: APIRoute = async ({ params }) => {
  const fileId = params.fileId;

  if (!fileId || isNaN(Number(fileId))) {
    return new Response(JSON.stringify({ error: "Folder ID is required" }), {
      status: 400,
    });
  }

  const file = await fileService.getFile(Number(fileId));

  if (!file) {
    return new Response(JSON.stringify({ error: "File not found" }), {
      status: 404,
    });
  }

  const response = `
    <form hx-put="/file/${file.id}/edit.json">
        <label for="file-name">File name</label>
        <br />
        <input type="text" id="file-name" name="fileName" value="${file.name}" />

        <br />
        <br />

        <label for="file-body">Body</label>
        <br />
        <textarea id="file-body" name="fileBody">${file.html}</textarea>

        <br />
        <br />

        <button type="submit">Update</button>
    </form>
  `;

  return new Response(response, { status: 200 });
};

export const put: APIRoute = async ({ request, params }) => {
  const fileId = params.fileId;

  if (!fileId || isNaN(Number(fileId))) {
    return new Response(JSON.stringify({ error: "File ID is required" }), {
      status: 400,
    });
  }

  const body = await request.formData();

  const fileName = body.get("fileName");
  const fileBody = body.get("fileBody");

  if (!fileName || !fileBody) {
    return new Response(
      JSON.stringify({ error: "File name and body are required" }),
      { status: 400 }
    );
  }

  const file = {
    name: fileName.toString(),
    html: fileBody.toString(),
  };

  const updatedFile = await fileService.updateFile(Number(fileId), file);

  if (!updatedFile) {
    return new Response(
      JSON.stringify({ error: "Error updating file with ID: " + fileId }),
      { status: 500 }
    );
  }

  const response = new Response(null, { status: 201 });

  response.headers.set("HX-Refresh", "true");

  return response;
};
