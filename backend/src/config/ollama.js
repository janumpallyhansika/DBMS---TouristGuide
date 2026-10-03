import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ollama = axios.create({
  baseURL: process.env.OLLAMA_URL || 'http://localhost:11434',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default ollama;