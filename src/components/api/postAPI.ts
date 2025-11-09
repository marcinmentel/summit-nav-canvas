import apiClient from "../../integrations/supabase/apiClient";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  createdAt: string;
  
  featuredImageId: number;
  featuredImage: Image; // Pełny obiekt obrazu

  postTags: Tag[];
  galleryImages: Image[];
}

export const getAllPosts = async (): Promise<BlogPost[]> => {
  const res = await apiClient.get("/api/Posts/GetAll");
  return res.data;
};

export const getPostById = async (id: number): Promise<BlogPost> => {
  const res = await apiClient.get(`/api/Posts/ById/${id}`);
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
  