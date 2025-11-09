import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getPostById } from "@/components/api/postAPI";

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
