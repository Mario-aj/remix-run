import invariant from "tiny-invariant";
import type { Post } from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";

import PostForm from "~/components/PostForm";
import { getPost, updatePost } from "~/models/post.server";

export const loader = async ({ params }: LoaderArgs) => {
  return json({ post: await getPost(params.slug as string) });
};

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();

  const title = form.get("title");
  const slug = form.get("slug");
  const markdown = form.get("markdown");

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  await updatePost({ title, markdown, slug, oldSlug: params.slug } as Pick<
    Post,
    "slug" | "markdown" | "title"
  > & { oldSlug: string });
  return redirect("/posts/admin");
};

export default function EditPost() {
  const { post } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  const transition = useTransition();
  const isCreating = Boolean(transition.submission);

  return (
    <PostForm
      errors={errors}
      isCreating={isCreating}
      defaultValues={post || undefined}
    />
  );
}
