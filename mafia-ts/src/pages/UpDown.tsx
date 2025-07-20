import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/UpDown.css';
import { ThumbUp, ThumbDown } from '@mui/icons-material';

const UpDownPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const target = location.state?.deadPlayer || '???';

  const [selection, setSelection] = useState<'agree' | 'disagree' | null>(null);

  const handleConfirm = () => {
    if (selection) {
      console.log(`투표 결과: ${selection === 'agree' ? '찬성' : '반대'}`);
      navigate('/game/dayvoteresult'); // 다음 페이지 경로로 수정하세요
    }
  };

  return (
    <div className="confirm-vote-page">
      <p className="confirm-vote-title">투표 결과, <span className="highlight">{target}</span>님이 지목되었습니다.<br/>
        <span className="highlight">{target}</span>님을 제외한 다른 참가자들은 찬반 투표를 진행해주세요</p>

      <div className="icon-options">
        <div
          className={`icon-circle ${selection === 'agree' ? 'selected' : ''}`}
          onClick={() => setSelection('agree')}
        >
          <ThumbUp fontSize="large" />
        </div>
        <div
          className={`icon-circle ${selection === 'disagree' ? 'selected' : ''}`}
          onClick={() => setSelection('disagree')}
        >
          <ThumbDown fontSize="large" />
        </div>
      </div>

      <button
        className="vote-finish-btn"
        onClick={handleConfirm}
        disabled={!selection}
      >
        투표 완료
      </button>
    </div>
  );
};

export default UpDownPage;
