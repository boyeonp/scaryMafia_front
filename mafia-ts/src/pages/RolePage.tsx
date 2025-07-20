import React, { useEffect, useState } from 'react';
import '../styles/RolePage.css';
import { useNavigate } from 'react-router-dom';

const RolePage: React.FC = () => {
  const [role, setRole] = useState<'마피아' | '시민' | '빌런' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const roles: ('마피아' | '시민' | '빌런')[] = ['마피아', '시민', '빌런'];

    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    setRole(randomRole);

    // 10초 후에 /introduce 로 이동
    const timer = setTimeout(() => {
      navigate('/game/introduce');
    }, 5000);

    return () => clearTimeout(timer); // cleanup
    }, [navigate]);

  const getColor = () => {
    switch (role) {
      case '마피아':
        return '#ff4d4d';
      case '시민':
        return '#66ff66';
      case '빌런':
        return '#6699ff';
      default:
        return 'white';
    }
  };

  return (
    <div className="role-page">

      <div className="role-text-wrapper">
        <p className="role-title">역할 안내</p>
        <p className="role-line">당신은</p>
        {role && (
          <p className="role-line">
            <span className="role-role" style={{ color: getColor() }}>{role}   </span>입니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default RolePage;