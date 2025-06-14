import { API_BASE_URL, getAuthToken } from './api';
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
      let errorMessage = 'Failed to join event';
      try {
        const error = await response.json();
        errorMessage = error.error || error.message || errorMessage;
      } catch (parseError) {
        // Если не удается парсить JSON, используем статус ответа
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to leave event';
      try {
        const error = await response.json();
        errorMessage = error.error || error.message || errorMessage;
      } catch (parseError) {
        // Если не удается парсить JSON, используем статус ответа
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
    console.log(`🔍 Creating review for event ${eventId}:`, review);

    const token = await this.getAuthToken();
    console.log(`🔑 Token available: ${token ? 'Yes' : 'No'}`);

    const url = `${this.baseUrl}/${eventId}/reviews/`;
    console.log(`🔗 Request URL: ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });

    console.log(`📡 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = 'Failed to create event review';
      try {
        const error = await response.json();
        console.log(`❌ Error response:`, error);
        errorMessage = error.error || error.message || error.detail || errorMessage;
      } catch (parseError) {
        // Если не удается парсить JSON, используем статус ответа
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
        console.log(`❌ Parse error, using status: ${errorMessage}`);
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log(`✅ Review created successfully:`, result);
    return result;
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
    // Используем токен из api.ts
    const token = getAuthToken();
    console.log(`🔑 EventService getAuthToken: ${token ? 'Token found' : 'No token'}`);
    if (!token) {
      throw new Error('No auth token found');
    }
    return token;
  }
}

export const eventService = new EventService();
