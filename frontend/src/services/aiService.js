import { apiRequest } from './api';

export function sendAIMessage(message, context = {}) {
  return apiRequest('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      context,
    }),
  });
}