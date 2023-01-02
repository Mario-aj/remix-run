import type { Post } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(
  post: Pick<Post, "slug" | "markdown" | "title">
) {
  return prisma.post.create({ data: post });
}

export async function delelePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}

export async function updatePost({
  oldSlug,
  ...post
}: Pick<Post, "slug" | "markdown" | "title"> & { oldSlug: string }) {
  return prisma.post.update({
    where: { slug: oldSlug },
    data: post,
  });
}
