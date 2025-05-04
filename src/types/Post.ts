export interface Post {
  id: string;
  author: string;
  content: string;
  image?: string;
  avatar?: string | number;
  createdAt?: Date | string;
  likes: number;
  comments: number;
  views?: number;
} 