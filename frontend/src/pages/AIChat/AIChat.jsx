import { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  MapPin,
} from 'lucide-react';

import './AIChat.css';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

function AIChat() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text:
        "Hi! I'm your India Travel Assistant. Tell me where you want to go, how many days you have, or what kind of experience you're looking for.",
    },
  ]);

  // =====================================================
  // SEND MESSAGE TO OLLAMA THROUGH BACKEND
  // =====================================================

  const sendMessage = async () => {
    const userMessage = message.trim();

    if (!userMessage || loading) return;

    // Show user's message immediately
    setMessages((current) => [
      ...current,
      {
        sender: 'user',
        text: userMessage,
      },
    ]);

    setMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_URL}/api/ai/chat`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',

            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },

          body: JSON.stringify({
            message: userMessage,
            context:
              'You are helping a user plan a trip in India. Give practical, clear and easy-to-understand travel information.',
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Backend returned an invalid response (${response.status}).`
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            'Unable to get response from AI.'
        );
      }

      // Add real Ollama response
      setMessages((current) => [
        ...current,
        {
          sender: 'ai',
          text:
            data.response ||
            data.message ||
            'I could not generate a response.',
        },
      ]);
    } catch (error) {
      console.error('AI Chat Error:', error);

      setMessages((current) => [
        ...current,
        {
          sender: 'ai',
          text:
            error.message ||
            'Unable to connect to the AI. Please make sure the backend and Ollama are running.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SUGGESTION CLICK
  // =====================================================

  const askSuggestion = (question) => {
    setMessage(question);
  };

  return (
    <div className="page-inner ai-page">

      {/* =================================================
          HEADING
      ================================================= */}

      <div className="ai-heading">

        <div className="ai-main-icon">
          <Bot size={24} />
        </div>

        <div>
          <span>AI TRAVEL ASSISTANT</span>

          <h1>
            Ask your travel guide
          </h1>

          <p>
            Plan, discover and personalize your journey.
          </p>
        </div>

      </div>


      {/* =================================================
          AI LAYOUT
      ================================================= */}

      <div className="ai-layout">

        {/* =================================================
            CHAT WINDOW
        ================================================= */}

        <div className="chat-window card">

          {/* CHAT HEADER */}

          <div className="chat-header">

            <div className="chat-bot">

              <div className="bot-avatar">
                <Bot size={17} />
              </div>

              <div>
                <strong>
                  IndiaGuide AI
                </strong>

                <span>
                  <i></i>
                  {loading
                    ? 'Thinking...'
                    : 'Online'}
                </span>
              </div>

            </div>

            <Sparkles size={18} />

          </div>


          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className="messages">

            {messages.map(
              (item, index) => (

                <div
                  key={index}
                  className={
                    item.sender === 'user'
                      ? 'message user-message'
                      : 'message ai-message'
                  }
                >

                  {item.sender === 'ai' && (

                    <div className="message-avatar">
                      <Bot size={14} />
                    </div>

                  )}

                  <div className="message-bubble">
                    {item.text}
                  </div>

                </div>

              )
            )}

            {loading && (

              <div className="message ai-message">

                <div className="message-avatar">
                  <Bot size={14} />
                </div>

                <div className="message-bubble">
                  Thinking...
                </div>

              </div>

            )}

          </div>


          {/* =================================================
              INPUT
          ================================================= */}

          <div className="chat-input-area">

            <input
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={(event) => {

                if (
                  event.key === 'Enter' &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  sendMessage();
                }

              }}
              disabled={loading}
              placeholder={
                loading
                  ? 'AI is thinking...'
                  : 'Ask about destinations, trips, food...'
              }
            />

            <button
              onClick={sendMessage}
              disabled={
                loading ||
                !message.trim()
              }
            >
              <Send size={17} />
            </button>

          </div>

        </div>


        {/* =================================================
            SUGGESTIONS
        ================================================= */}

        <div className="ai-suggestions">

          <h3>
            Try asking
          </h3>

          {[
            'Plan a 4-day Kerala trip',
            'Best places in Rajasthan',
            'Things to do in Hyderabad',
            'Suggest a budget trip from Hyderabad',
          ].map((question) => (

            <button
              key={question}
              onClick={() =>
                askSuggestion(question)
              }
            >

              <MapPin size={14} />

              {question}

            </button>

          ))}


          {/* =================================================
              OLLAMA NOTE
          ================================================= */}

          <div className="ollama-note">

            <Sparkles size={16} />

            <div>

              <strong>
                Powered by Ollama
              </strong>

              <p>
                Your messages are sent to
                the local Ollama AI through
                the Tourist Guide backend.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIChat;