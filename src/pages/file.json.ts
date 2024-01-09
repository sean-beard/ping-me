import type { APIRoute } from "astro";

import { fileService } from "@/services";
import { getUser, isAuthenticated } from "@/utils/auth";

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(null, {
      status: 400,
      statusText: "Invalid Authorization header.",
    });
  }

  const body = await request.formData();

  const fileName = body.get("fileName");
  const fileBody = body.get("fileBody");
  const folderId = body.get("folderId");

  if (!fileName) {
    return new Response(
      JSON.stringify({ error: "File name and body are required" }),
      {
        status: 400,
      },
    );
  }

  const file = {
    name: fileName.toString(),
    html: fileBody ? fileBody.toString() : "",
  };

  const user = getUser(cookies);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found." }), {
      status: 404,
    });
  }

  const createdFile = await fileService.createFile(
    file,
    user.id,
    folderId?.toString(),
  );

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
