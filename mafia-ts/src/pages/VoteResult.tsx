import React, {useEffect} from 'react';
import '../styles/VoteResult.css';
import { useLocation, useNavigate } from 'react-router-dom';


const ResultAnnounce: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const deadPlayer = location.state?.deadPlayer || '???';
    
    useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/game/day');
    }, 5000); // 5초 후 이동

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
  }, [navigate]);

    return (
    <div className="result-page">
    <p className="result-title">결과 발표</p>
      <div className="result-box">
        <p className="result-text bold">아침이 밝았습니다.</p>
        <p className="result-text">
          어젯밤, <span className="highlight">{deadPlayer}</span>님이 죽었습니다.
        </p>
      </div>
    </div>
  );
};

export default ResultAnnounce;
