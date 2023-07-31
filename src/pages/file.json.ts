import type { APIRoute } from "astro";

import { fileService } from "@/services";

export const post: APIRoute = async ({ request }) => {
  const body = await request.formData();

  const fileName = body.get("fileName");
  const fileBody = body.get("fileBody");

  if (!fileName || !fileBody) {
    return new Response(
      JSON.stringify({ error: "File name and body are required" }),
      {
        status: 400,
      },
    );
  }

  const file = {
    name: fileName.toString(),
    html: fileBody.toString(),
  };

  const createdFile = await fileService.createFile(file);

  const fileId = createdFile?.id;

  if (!fileId) {
    return new Response(JSON.stringify({ error: "Error creating file." }), {
      status: 500,
    });
  }

  const response = new Response(null, { status: 300 });

  response.headers.set("HX-Redirect", "/file/" + fileId);

  return response;
};
