import apiClient from "../../integrations/supabase/apiClient";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  createdAt: string;
  slug: string;
  featuredImageId: number;
  featuredImage: string; // Pełny obiekt obrazu

  postTags: string[];
  galleryImages: string[];
}

export const getAllPosts = async (): Promise<BlogPost[]> => {
  const res = await apiClient.get("/api/Posts/GetAll");
  return res.data;
};

export const getPostById = async (id: number): Promise<BlogPost> => {
  const res = await apiClient.get(`/api/Posts/ById/${id}`);
  return res.data;
};
export const getPostBySlug = async (slug: string): Promise<BlogPost> => {
  const res = await apiClient.get(`/api/Posts/${slug}`);
  return res.data;
};
export interface Image {
    id: number;
    url: string;
    altText: string;
    caption: string;
    // Opcjonalnie: ImageType, PostId (ale te nie są zwykle potrzebne na frontendzie)
};
export interface Tag {
  id: number;
  name: string;
  slug: string;
};
  