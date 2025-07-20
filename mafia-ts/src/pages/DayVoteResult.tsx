import React from 'react';
import '../styles/DayVoteResult.css';

interface VoteFinalResultProps {
  votedPlayer: string;
  isMafia: boolean;
  agree: number;
  disagree: number;
}

const DayVoteResult: React.FC<VoteFinalResultProps> = ({ votedPlayer, isMafia, agree, disagree }) => {
  return (
    <div className="vote-result-page">
      <div className="vote-result-box">
        <p className="vote-result-line">
          찬성 <span className="bold">{agree}</span>, 반대 <span className="bold">{disagree}</span>로{' '}
          <span className="highlight">{votedPlayer}</span>님은 죽었습니다.
        </p>
        <p className="vote-result-line">
          <span className="highlight">{votedPlayer}</span>님은{' '}
          <span className="role-reveal">{isMafia ? '마피아' : '시민'}</span>입니다.
        </p>
      </div>
    </div>
  );
};

export default DayVoteResult;
