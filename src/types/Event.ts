export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'university' | 'personal' | 'academic' | 'cultural' | 'sports' | 'conference' | 'workshop' | 'meeting' | 'exam' | 'deadline';
  start_datetime: string;
  end_datetime?: string;
  location: string;
  organizer: EventOrganizer;
  participants_count: number;
  average_rating: number;
  is_public: boolean;
  requires_registration: boolean;
  max_participants?: number;
  is_past: boolean;
  is_today: boolean;
  user_is_participant: boolean;
  user_participation_status?: 'registered' | 'confirmed' | 'attended' | 'cancelled';
  created_at: string;
}

export interface EventOrganizer {
  id: number;
  username: string;
  full_name: string;
  avatar_url?: string;
  role: string;
}

export interface EventReviewAuthor {
  id: number;
  username: string;
  full_name: string;
  avatar_url?: string;
}

export interface EventParticipant {
  user: EventOrganizer;
  status: 'registered' | 'confirmed' | 'attended' | 'cancelled';
  registered_at: string;
  notes: string;
}

export interface EventReview {
  id: string;
  author: EventReviewAuthor;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface EventDetail extends Event {
  participants: EventParticipant[];
  reviews: EventReview[];
  related_post?: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  category: string;
  location: string;
}

export interface CalendarData {
  year: number;
  month: number;
  events: { [day: number]: CalendarEvent[] };
}

export interface CreateEventFromPost {
  post_id: string;
  title: string;
  start_datetime: string;
  end_datetime?: string;
  location?: string;
  category?: string;
  description?: string;
  is_public?: boolean;
  requires_registration?: boolean;
  max_participants?: number;
}
