import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/SelectTargetPage.css';

const SelectTargetPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || '마피아'; // 기본값: 마피아
  const players = ['병주', '유진', '보연', '민지', '정우', '수아']; // 예시 플레이어 목록

  const [selectedName, setSelectedName] = useState<string | null>(null);

  const getMessage = () => {
    switch (role) {
      case '마피아':
        return { text: '죽일 사람의 이름을 입력하세요.', highlight: '죽일 사람', color: 'red' };
      case '의사':
        return { text: '살릴 사람의 이름을 입력하세요.', highlight: '살릴 사람', color: 'skyblue' };
      case '경찰':
        return { text: '조사하고 싶은 사람의 이름을 입력하세요.', highlight: '조사하고 싶은 사람', color: 'royalblue' };
      default:
        return { text: '대상을 선택하세요.', highlight: '', color: 'black' };
    }
  };

  const { text, highlight, color } = getMessage();

  const handleConfirm = () => {
    if (selectedName) {
      console.log(`선택된 대상 (${role}):`, selectedName);
      navigate('/game/voteresult' , { state: { deadPlayer: selectedName } });
    }
  };

  return (
    <div className="select-page">
      <div className="select-container">
        <p className="select-text">
          <span style={{ color }}>{highlight}</span>
          {text.replace(highlight, '')}
        </p>

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

        <button className="confirm-btn" onClick={handleConfirm} disabled={!selectedName}>
          완료
        </button>
      </div>
    </div>
  );
};

export default SelectTargetPage;
