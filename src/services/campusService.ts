import { API_BASE_URL } from './api';
import { Building, Room, RoomDetail, RoomReview, CreateRoomReview, RoomStatistics, BuildingStatistics } from '../types/Campus';

class CampusService {
  private baseUrl = `${API_BASE_URL}/campus`;

  async getBuildings(): Promise<Building[]> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/buildings/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch buildings');
    }

    return response.json();
  }

  async getBuilding(id: string): Promise<Building> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/buildings/${id}/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch building');
    }

    return response.json();
  }

  async getRooms(params?: {
    building?: string;
    floor?: number;
    type?: string;
    search?: string;
  }): Promise<Room[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.building) queryParams.append('building', params.building);
    if (params?.floor) queryParams.append('floor', params.floor.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.search) queryParams.append('search', params.search);

    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/rooms/?${queryParams}`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rooms');
    }

    return response.json();
  }

  async getRoom(id: string): Promise<RoomDetail> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/rooms/${id}/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch room');
    }

    return response.json();
  }

  async getRoomReviews(roomId: string): Promise<RoomReview[]> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/rooms/${roomId}/reviews/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch room reviews');
    }

    return response.json();
  }

  async createRoomReview(roomId: string, review: CreateRoomReview): Promise<RoomReview> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/rooms/${roomId}/reviews/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create room review');
    }

    return response.json();
  }

  async updateRoomReview(reviewId: string, review: Partial<CreateRoomReview>): Promise<RoomReview> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/reviews/${reviewId}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      throw new Error('Failed to update room review');
    }

    return response.json();
  }

  async deleteRoomReview(reviewId: string): Promise<void> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/reviews/${reviewId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete room review');
    }
  }

  async getRoomStatistics(roomId: string): Promise<RoomStatistics> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/rooms/${roomId}/statistics/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch room statistics');
    }

    return response.json();
  }

  async getBuildingStatistics(buildingId: string): Promise<BuildingStatistics> {
    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseUrl}/buildings/${buildingId}/statistics/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch building statistics');
    }

    return response.json();
  }

  private async getAuthToken(): Promise<string> {
    // Здесь должна быть логика получения токена из AsyncStorage
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }
    return token;
  }
}

export const campusService = new CampusService();
