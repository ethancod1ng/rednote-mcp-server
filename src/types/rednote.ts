export interface RedNoteUser {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  description?: string;
  followerCount: number;
  followingCount: number;
  noteCount: number;
  likeCount: number;
  verified: boolean;
}

export interface RedNoteNote {
  id: string;
  title: string;
  content: string;
  images: string[];
  video?: string;
  author: RedNoteUser;
  tags: string[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  collectCount: number;
  createdAt: string;
  updatedAt: string;
  type: 'note' | 'video';
  location?: string;
}

export interface RedNoteComment {
  id: string;
  content: string;
  author: RedNoteUser;
  likeCount: number;
  createdAt: string;
  replies?: RedNoteComment[];
}

export interface RedNoteTopic {
  id: string;
  name: string;
  description: string;
  noteCount: number;
  participantCount: number;
  trending: boolean;
}

export interface SearchParams {
  keyword: string;
  type?: 'note' | 'video' | 'all';
  sort?: 'latest' | 'popular' | 'relevant';
  limit?: number;
  cursor?: string;
}

export interface SearchResult {
  notes: RedNoteNote[];
  hasMore: boolean;
  nextCursor?: string;
  total?: number;
}

export interface AnalysisResult {
  sentiment?: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  keywords?: string[];
  category?: string;
  topics?: string[];
}