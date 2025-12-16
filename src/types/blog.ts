export interface BlogResponseDto {
  id: number;
  image: string | null;
  title: string | null;
  slug: string | null;
  author: string | null;
  details: string | null;
  tags: string[];
  files: string[] | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBlogRequestDto {
  image?: string;
  title?: string;
  slug?: string;
  author?: string;
  details?: string;
  tags?: string[];
  files?: string[];
  status?: boolean;
}

export interface CreateBlogRequestDto {
  image?: string;
  title?: string;
  slug?: string;
  author?: string;
  details?: string;
  tags: string[];
  files?: string[];
  status?: boolean;
}

export interface BlogI {
  id: number;
  image: string | null;
  title: string | null;
  slug: string | null;
  author: string | null;
  details: string | null;
  tags: string[];
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  files?: any;
}

export interface CreateBlogTagRequestDto {
  title?: string;
  slug?: string;
}

export interface UpdateBlogTagRequestDto {
  title?: string;
  slug?: string;
}

export interface BlogTagResponseDto {
  id: number;
  title: string | null;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogTagI {
  id: number;
  title: string | null;
  slug: string | null;
  createdAt: Date;
  updatedAt: Date;
}








export interface TopicI {
  id?: number;
  title: string;
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ==============================
// DTOs
// ==============================
export interface CreateTopicRequestDto {
  title: string;
}

export interface UpdateTopicRequestDto {
  title?: string;
  slug?: string;
}

