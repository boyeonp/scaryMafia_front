import React, { useState, useEffect } from 'react';
import '../styles/IntroduceChat.css';
import { useNavigate } from 'react-router-dom';

const DayChat: React.FC = () => {
  const [messages, setMessages] = useState([
    { sender: '병주', text: '안녕하세요. 저는 시민입니다.' },
    { sender: '유진', text: '안녕하세요. 저도 시민입니다.' },
    { sender: '민지', text: '저도 마피아 하고 싶네요 ..' },
    { sender: '나', text: '안녕하세요. 저는 마피아에요\n히히히' },
  ]);
  const [input, setInput] = useState('');
  const [remainingTime, setRemainingTime] = useState(10); // 8분 = 480초
  const navigate = useNavigate();

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { sender: '나', text: input }]);
    setInput('');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/game/dayvote'); // 다음 페이지 경로로 이동
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString();
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="chat-page">
      <div className="timer-box">남은 시간: <span>{formatTime(remainingTime)}</span></div>

      <div className="chat-overlay">
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${msg.sender === '나' ? 'mine' : 'theirs'}`}
            >
              {msg.sender !== '나' && <div className="sender-name">{msg.sender}</div>}
              <div className="message-bubble">{msg.text}</div>
            </div>
          ))}
        </div>

        <div className="chat-input-box">
          <input
            type="text"
            placeholder="메시지를 입력하세요."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}>📤</button>
        </div>
      </div>
    </div>
  );
};

export default DayChat;
