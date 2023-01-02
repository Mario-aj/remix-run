import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import invariant from "tiny-invariant";

import { delelePost, getPost } from "~/models/post.server";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, "params.slug is required");
  const post = await getPost(params.slug as string);

  invariant(post, `Post not found: ${params.slug}`);
  const html = marked(post.markdown);

  return json({
    post,
    html,
  });
};

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  const edit = form.get("edit");

  if (!edit) {
    await delelePost(params.slug as string);
    return redirect("/posts/admin");
  }

  return redirect(`/posts/admin/edit/${params.slug}`);
};

export default function AdminPostBySlug() {
  const { post, html } = useLoaderData<typeof loader>();

  return (
    <main className="relative mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        Some Post: {post.title}
      </h1>
      <Form method="post" className="absolute right-0 flex items-center gap-2">
        <input
          type="submit"
          id="edit"
          value="Edit"
          name="edit"
          className="rounded border border-solid border-indigo-300 p-2 text-sm text-indigo-400"
        />
        <input
          type="submit"
          id="delete"
          value="Delete"
          name="delete"
          className="rounded border border-solid border-indigo-300 p-2 text-sm text-indigo-400"
        />
      </Form>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
