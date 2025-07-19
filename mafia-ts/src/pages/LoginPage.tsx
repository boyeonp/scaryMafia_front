import React from 'react';
import '../styles/LoginPage.css';   
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {

    const navigate = useNavigate();
    return (
        <div className="login-container">
            <div className="login-content">
                <div className='logo-container'>
                    <text className="title"> 로그인 </text>
                </div>
                <div className="input-container">
                    <text className="input-title">아이디</text>
                    <input type="text" className="input-box" placeholder=" 아이디를 입력하세요" />
                </div>
                <div className="input-container">
                    <text className="input-title">비밀번호</text>
                    <input type="password" className="input-box" placeholder=" 비밀번호를 입력하세요" />
                </div>    
            <button onClick={() => navigate('/lobby')}className="submit-btn">완료</button>
            </div>
        </div>
    );
}

export default LoginPage;
