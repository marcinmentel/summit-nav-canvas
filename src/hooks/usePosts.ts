import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getPostById, getPostBySlug } from "@/components/api/postAPI";

export const usePostsQuery = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });
};

export const usePostQuery = (id: number) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPostById(id),
    enabled: !!id, // tylko jeśli id istnieje
  });
};
export const usePostSlugQuery = (slug: string) => {
    return useQuery({
      queryKey: ["posts", slug],
      queryFn: () => getPostBySlug(slug),
      enabled: !!slug, // tylko jeśli id istnieje
    });
  };
