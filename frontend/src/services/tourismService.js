import { apiRequest } from './api';

export function getStates() {
  return apiRequest('/states');
}

export function getCities(stateId) {
  return apiRequest(`/states/${stateId}/cities`);
}

export function getPlaces(cityId) {
  return apiRequest(`/cities/${cityId}/places`);
}