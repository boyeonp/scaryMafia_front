import React from 'react';
import '../styles/MainPage.css';
import { useNavigate } from 'react-router-dom'; 

const MainPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="main-container">
            <div className="main-content">
                <div className='logo-container'>
                     <text className="title">온라인<br />마피아게임</text><br />
                </div>
                <button onClick={() => navigate('/login')} className="login-btn">로그인</button><br />
                <button onClick={() => navigate('/signup')} className="signup-btn">회원가입</button>
            </div>
        </div>
    );
};

export default MainPage;