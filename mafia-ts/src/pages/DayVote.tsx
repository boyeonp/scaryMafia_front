import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DayVote.css'; // 새로운 CSS

const DayVote: React.FC = () => {
  const navigate = useNavigate();
  const players = ['병주', '유진', '보연', '민지', '정우', '수아'];

  const [selectedName, setSelectedName] = useState<string | null>(null);

  const handleVote = () => {
    if (selectedName) {
      console.log('투표된 사람:', selectedName);
      navigate('/game/updown', { state: { deadPlayer: selectedName } });
    }
  };

  return (
    <div className="vote-page">
      <div className="vote-container">
        <p className="vote-title">이제 투표를 시작합니다.<br/>
            마피아로 의심되는 사람을 고르세요</p>

        <div className="button-grid">
          {players.map((name, index) => (
            <button
              key={index}
              className={`player-btn ${selectedName === name ? 'selected' : ''}`}
              onClick={() => setSelectedName(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <button className="confirm-btn" onClick={handleVote} disabled={!selectedName}>
          투표 완료
        </button>
      </div>
    </div>
  );
};

export default DayVote;
