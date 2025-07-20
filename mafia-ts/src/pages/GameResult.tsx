import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/GameResult.css';

const GameEndPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const winningTeam = location.state?.winningTeam || '???';

  return (
    <div className="game-end-page">
      <div className="game-end-textbox">
        <p className="end-text">게임이 종료되었습니다.</p>
        <p className="end-highlight">
          {winningTeam} 팀이 승리하였습니다.
        </p>
        <button className="end-btn" onClick={() => navigate('/lobby')}>
          로비로 이동
        </button>
      </div>
    </div>
  );
};

export default GameEndPage;
