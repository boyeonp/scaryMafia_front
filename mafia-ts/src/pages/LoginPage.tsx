import React from 'react';
import '../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // API 호출을 위한 axios 인스턴스

const LoginPage: React.FC = () => {

    const navigate = useNavigate();
    const [userEmail, setUserEmail] = React.useState("");
    const [password, setPassword] = React.useState(""); 

    // 로그인 폼 제출 핸들러
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // 폼 제출 이벤트 방지
        if (!userEmail || !password) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }
        try {
            const response = await api.post("/auth/login", {
                userEmail,
                password,
            });

            // 로그인 성공 처리 (토큰 저장)
            // const token = response.data.token;
            // localStorage.setItem("token", token);

            alert("로그인 성공! 로비 페이지로 이동합니다.");
            console.log("로그인 성공:", response.data);
            navigate('/lobby'); // 로그인 후 로비 페이지로 이동
        } catch (error) {
            console.error("로그인 실패:", error);
            alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <p className="login-title"> 로그인 </p>
                <div className="input-container">
                    <span className="login-input-title">아이디</span>
                    <input onChange={(event) => setUserEmail(event.target.value)} value={userEmail} type="text" className="input-box" placeholder=" 아이디를 입력하세요" />
                </div>
                <div className="input-container">
                    <span className="login-input-title">비밀번호</span>
                    <input onChange={(event) => setPassword(event.target.value)} value={password} type="password" className="input-box" placeholder=" 비밀번호를 입력하세요" />
                </div>    
            <button type="submit" className="submit-btn">완료</button>
            </form>
        </div>
    );
}

export default LoginPage;