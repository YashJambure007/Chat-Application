import { useState } from 'react';
import axios from 'axios';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      const res = await axios.post('/api/ai/ask', { message: input });
      const aiMessage = { sender: 'ai', text: res.data.reply };
      setMessages(prev => [...prev, aiMessage]);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error! Try again later.' }]);
    }

    setInput('');
  };

  return (
    <div className="w-full max-w-md p-4 shadow-md bg-white rounded">
      <div className="h-80 overflow-y-auto mb-2 border p-2 rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className={`my-1 text-sm ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className="px-2 py-1 bg-gray-200 rounded inline-block">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-grow p-2 border rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the AI..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
