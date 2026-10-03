import { apiRequest } from './api';

export function createTrip(data) {
  return apiRequest('/trips', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getMyTrips() {
  return apiRequest('/trips');
}

export function getTrip(tripId) {
  return apiRequest(`/trips/${tripId}`);
}