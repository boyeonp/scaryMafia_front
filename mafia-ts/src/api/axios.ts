import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000", // 백엔드 서버 주소
    withCredentials: true, // 쿠키를 포함한 요청 허용
    timeout: 5000, // 5초 타임아웃
});

export default api;
