import apiClient from "../../integrations/supabase/apiClient";


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

export const postCommentInPost = async (comment: CommentToSend ): Promise<void> => {
  //console.log("comment: ",comment);
  const res = await apiClient.post("/api/Posts/addComment",comment);
  return res.data;
};

export const postLike = async (like: LikeDto ): Promise<void> => {
  console.log("likeToSendAdd: ",like);
  const res = await apiClient.post("/api/Posts/addLike",like);
  return res.data;
};

export const deleteLike = async (like: LikeDto ): Promise<void> => {
  //console.log("likeToSendDel: ",like);
  const res = await apiClient.post("/api/Posts/removeLike",like);
  return res.data;
};


export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  createdAt: string;
  slug: string;
  featuredImageId: number;
  featuredImage: string; 
  postTags: string[];
  galleryImages: string[];
  comments: Comment[];
  likes: Like[]
}

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

export interface Comment{
  authorId: string;
  content: string;
  createdAt: string;
  isApproved: boolean
}

export interface CommentToSend{
  authorId: string;
  content: string;
  postId: number
}

export interface Like{
  userId: string;
}
export interface LikeDto{
  postId: number;
  userId: string;
}