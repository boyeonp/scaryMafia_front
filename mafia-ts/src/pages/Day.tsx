import React, { useEffect } from 'react';
import '../styles/Day.css';
import { useNavigate } from 'react-router-dom';

const DayGuide: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
        navigate('/game/daychat');
        }, 5000); // 5초 후 이동

        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, [navigate]);
   return (
    <div className="vote-guide-page">
      <div className="vote-guide-textbox">
        <p>
          이제, 시민들은 채팅을 통해 어젯밤의 일을 추리하고,
          <br />
          투표를 통해 <span className="highlight-red">용의자를 지목</span>합니다.
          <br />
          채팅 시간은 <span className="highlight-bold">8분</span>입니다.
        </p>
      </div>
    </div>
  );
};

export default DayGuide;
