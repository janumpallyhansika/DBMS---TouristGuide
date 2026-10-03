import { apiRequest } from './api';

export function loginUser(data) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function registerUser(data) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}