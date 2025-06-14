import { API_BASE_URL } from './api';
import { Event, EventDetail, EventReview, CalendarData, CreateEventFromPost } from '../types/Event';

class EventService {
  private baseUrl = `${API_BASE_URL}/events`;

  async getEvents(params?: {
    category?: string;
    date?: 'today' | 'upcoming' | 'past';
    year?: number;
    month?: number;
    my_events?: boolean;
  }): Promise<Event[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.category) queryParams.append('category', params.category);
    if (params?.date) queryParams.append('date', params.date);
    if (params?.year) queryParams.append('year', params.year.toString());
    if (params?.month) queryParams.append('month', params.month.toString());
    if (params?.my_events) queryParams.append('my_events', 'true');

    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}?${queryParams}`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    return response.json();
  }

  async getEvent(id: string): Promise<EventDetail> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/${id}/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }

    return response.json();
  }

  async createEvent(eventData: Partial<Event>): Promise<EventDetail> {
    const token = await this.getAuthToken();
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Failed to create event');
    }

    return response.json();
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<EventDetail> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Failed to update event');
    }

    return response.json();
  }

  async deleteEvent(id: string): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  }

  async joinEvent(id: string): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/${id}/join/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to join event');
    }
  }

  async leaveEvent(id: string): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/${id}/leave/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to leave event');
    }
  }

  async getEventReviews(eventId: string): Promise<EventReview[]> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/${eventId}/reviews/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch event reviews');
    }

    return response.json();
  }

  async createEventReview(eventId: string, review: { rating: number; comment?: string }): Promise<EventReview> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/${eventId}/reviews/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      throw new Error('Failed to create event review');
    }

    return response.json();
  }

  async createEventFromPost(data: CreateEventFromPost): Promise<EventDetail> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/create-from-post/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create event from post');
    }

    return response.json();
  }

  async getCalendarEvents(year: number, month: number): Promise<CalendarData> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/calendar/?year=${year}&month=${month}`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }

    return response.json();
  }

  private async getAuthToken(): Promise<string> {
    // Здесь должна быть логика получения токена из AsyncStorage
    // Пока возвращаем пустую строку, но это нужно будет исправить
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }
    return token;
  }
}

export const eventService = new EventService();
