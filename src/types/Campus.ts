export interface Building {
  id: string;
  name: string;
  address: string;
  description: string;
  image?: string;
  floors: number;
  latitude?: number;
  longitude?: number;
  average_rating: number;
  total_rooms: number;
}

export interface Room {
  id: string;
  number: string;
  building: Building;
  building_name: string;
  floor: number;
  room_type: 'classroom' | 'laboratory' | 'lecture' | 'admin' | 'library' | 'computer' | 'conference' | 'workshop';
  room_type_display: string;
  capacity: number;
  description: string;
  equipment: string[];
  is_accessible: boolean;
  average_rating: number;
  reviews_count: number;
}

export interface RoomDetail extends Room {
  reviews: RoomReview[];
  user_review?: RoomReview;
  created_at: string;
  updated_at: string;
}

export interface RoomReview {
  id: string;
  author: RoomReviewAuthor;
  rating: number;
  category: 'cleanliness' | 'equipment' | 'comfort' | 'accessibility' | 'lighting' | 'acoustics' | 'temperature' | 'general';
  comment: string;
  cleanliness_rating?: number;
  equipment_rating?: number;
  comfort_rating?: number;
  created_at: string;
  updated_at: string;
}

export interface RoomReviewAuthor {
  id: number;
  username: string;
  full_name: string;
  avatar_url?: string;
}

export interface CreateRoomReview {
  rating: number;
  category?: string;
  comment?: string;
  cleanliness_rating?: number;
  equipment_rating?: number;
  comfort_rating?: number;
}

export interface RoomStatistics {
  room_id: string;
  total_reviews: number;
  average_rating: number;
  rating_distribution: { [rating: number]: number };
  category_ratings: { [category: string]: number };
}

export interface BuildingStatistics {
  building_id: string;
  total_rooms: number;
  total_reviews: number;
  average_rating: number;
  room_types: {
    [type: string]: {
      count: number;
      average_rating: number;
      total_capacity: number;
    };
  };
}
