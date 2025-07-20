import React, { useEffect, useState } from 'react';
import '../styles/NightMafia.css';
import { useNavigate } from 'react-router-dom';

const NightChat: React.FC = () => {
  const [messages, setMessages] = useState([
    { sender: '유진', text: '안녕하세요. 저는 시민입니다.' },
    { sender: '민지', text: '저도 마피아 하고 싶네요 ..' },
    { sender: '나', text: '안녕하세요. 저는 마피아에요\n히히히' },
  ]);

  const [input, setInput] = useState('');
  const [remainingTime, setRemainingTime] = useState(10); // 예시로 60초
  const navigate = useNavigate();

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { sender: '나', text: input }]);
    setInput('');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(1, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleVote = () => {
    navigate('/game/selecttarget'); // 투표 페이지로 이동
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleVote();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="night-page">
      <div className="timer-box">남은 시간: <span>{formatTime(remainingTime)}</span></div>
      <div className="title-text">마피아의 밤</div>

      <div className="chat-overlay">
        <div className="chat-box">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.sender === '나' ? 'mine' : 'theirs'}`}>
              <div className="sender-name">{msg.sender}</div>
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

      <button className="vote-btn" onClick={handleVote}>투표하러 이동</button>
    </div>
  );
};

export default NightChat;
