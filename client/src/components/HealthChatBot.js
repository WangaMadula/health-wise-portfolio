
import React, { useState, useRef, useEffect } from 'react';

const fallbackResponse = "Sorry, I can only assist with health-related questions or help you book an appointment. Please ask about our services, your symptoms, or how to contact us.";

const feverAdvice = "For a fever, make sure to rest, drink plenty of fluids, and monitor your temperature. If your fever is above 39°C (102°F), lasts more than 3 days, or you have other symptoms like difficulty breathing, please seek medical attention or book an appointment. Would you like to book now?";

const symptomSolutions = [
  { pattern: /headache|migraine/i, response: "For headaches or migraines, rest in a quiet, dark room, stay hydrated, and consider over-the-counter pain relief. If your headache is severe, persistent, or accompanied by vision changes, please consult a doctor." },
  { pattern: /cough|sore throat/i, response: "For coughs and sore throats, stay hydrated, use throat lozenges, and rest your voice. If symptoms persist or worsen, please see a doctor." },
  { pattern: /stomach|nausea|vomit|diarrhea|tummy/i, response: "For stomach aches or sore tummy, stick to bland foods, stay hydrated, and rest. If you can't keep fluids down, have severe pain, or symptoms last more than 2 days, seek medical care." },
  { pattern: /flu|cold|runny nose|congestion/i, response: "For flu or cold symptoms, rest, drink fluids, and use over-the-counter remedies as needed. If you have trouble breathing or high fever, contact a doctor." },
  { pattern: /sinus|sinuses|sinusitis/i, response: "For sinus issues, try steam inhalation, stay hydrated, and use saline nasal sprays. If pain or congestion persists, consult a healthcare provider." },
  { pattern: /pain|fatigue|tired|dizzy/i, response: "For general pain or fatigue, rest and monitor your symptoms. If pain is severe or you feel very unwell, please consult a healthcare provider." }
];

export default function HealthChatBot() {
  const WELCOME_MSG = 'Hi! I am your Healthwise Clinic assistant. You can ask me anything about our services, your health, or booking an appointment.';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [awaitingSymptom, setAwaitingSymptom] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = (e) => {
    e.preventDefault();
    const userMsg = input.trim();
    if (!userMsg) return;
    setMessages(msgs => [...msgs, { from: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      // If this is the first message and it's "Hello" or "Hi", show the welcome message
      if (messages.length === 0 && /^(hello|hi)$/i.test(userMsg)) {
        setMessages(msgs => [...msgs, { from: 'bot', text: WELCOME_MSG }]);
        return;
      }
      // Fever-specific advice
      if (/fever/i.test(userMsg)) {
        setMessages(msgs => [...msgs, { from: 'bot', text: feverAdvice }]);
        setAwaitingSymptom(false);
        return;
      }
      // "I am not well" or similar triggers symptom follow-up
      if (/^(i('| a)m|i am|i'm|im|not well|unwell|sick|ill|not feeling well)/i.test(userMsg)) {
        setMessages(msgs => [...msgs, { from: 'bot', text: "I'm sorry to hear that. Can you tell me more about your symptoms?" }]);
        setAwaitingSymptom(true);
        return;
      }
      // If awaiting symptom, try to match a solution
      if (awaitingSymptom) {
        let found = false;
        for (const entry of symptomSolutions) {
          if (entry.pattern.test(userMsg)) {
            setMessages(msgs => [...msgs, { from: 'bot', text: entry.response }]);
            found = true;
            break;
          }
        }
        if (!found) {
          setMessages(msgs => [...msgs, { from: 'bot', text: fallbackResponse }]);
        }
        setAwaitingSymptom(false);
        return;
      }
      // General bot responses
      const botResponses = [
        {
          pattern: /appointment|book|see doctor|consult|visit/i,
          response: "You can book an appointment directly on our website. Would you like help with the booking process?"
        },
        {
          pattern: /hours|open|close|when/i,
          response: "Our clinic is open Monday to Friday 7:00 AM - 8:00 PM, Saturday 8:00 AM - 4:00 PM, and Sunday 10:00 AM - 2:00 PM (Urgent Care). Emergency services are available 24/7."
        },
        {
          pattern: /services|offer|what can you do|specialist|lab|test|vaccin|check-up|consultation/i,
          response: "We offer general and specialist consultations, laboratory tests, vaccinations, medical check-ups, and emergency care. Would you like more details about a specific service?"
        },
        {
          pattern: /location|where|address|find/i,
          response: "We are located at 247 Oxford Road, Rosebank Medical Centre, Johannesburg, Gauteng 2196."
        },
        {
          pattern: /thank|thanks|thank you/i,
          response: "You're welcome! If you have any more questions, feel free to ask."
        }
      ];
      let found = false;
      for (const entry of botResponses) {
        if (entry.pattern.test(userMsg)) {
          setMessages(msgs => [...msgs, { from: 'bot', text: entry.response }]);
          found = true;
          break;
        }
      }
      if (!found) {
        setMessages(msgs => [...msgs, { from: 'bot', text: fallbackResponse }]);
      }
      setAwaitingSymptom(false);
    }, 600);
  };

  const handleClose = () => {
    // Reset conversation when the user exits the chat
    setMessages([]);
    setInput('');
    setAwaitingSymptom(false);
    setOpen(false);
  };

  // Chat bubble UI
  if (!open) {
    return (
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
        <button
          aria-label="Open Healthwise ChatBot"
          onClick={() => setOpen(true)}
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#1e3c72',
            color: '#fff',
            border: 'none',
            boxShadow: '0 4px 16px rgba(30,60,114,0.18)',
            fontSize: 32,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'box-shadow 0.2s',
          }}
        >
          <span role="img" aria-label="Chat">💬</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, width: 340, maxWidth: '90vw', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(30,60,114,0.18)', border: '1.5px solid #e0e7ef', overflow: 'hidden', fontFamily: 'inherit' }}>
      <div style={{ background: '#1e3c72', color: '#fff', padding: '14px 18px', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Healthwise ChatBot
        <button
          aria-label="Close ChatBot"
          onClick={handleClose}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', marginLeft: 8 }}
        >×</button>
      </div>
      <div style={{ maxHeight: 320, overflowY: 'auto', padding: 16, background: '#f7fafd' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 10, textAlign: msg.from === 'user' ? 'right' : 'left' }}>
            <span style={{
              display: 'inline-block',
              background: msg.from === 'user' ? '#e0f2fe' : '#e0e7ef',
              color: '#1e3c72',
              borderRadius: 8,
              padding: '8px 12px',
              maxWidth: '80%',
              fontSize: 15,
              boxShadow: msg.from === 'user' ? '0 2px 8px #bae6fd44' : '0 2px 8px #e0e7ef44'
            }}>{msg.text}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #e0e7ef', background: '#f7fafd' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, border: 'none', outline: 'none', padding: '12px', fontSize: 15, background: 'transparent' }}
        />
        <button type="submit" style={{ background: '#1e3c72', color: '#fff', border: 'none', padding: '0 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Send</button>
      </form>
    </div>
  );
}
