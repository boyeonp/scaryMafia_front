import React, { useState, useEffect } from 'react';
import '../styles/IntroduceChat.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { socket } from '../socket';

interface Message {
    nickname: string;
    message: string;
    timestamp?: string;
}

const IntroduceChat: React.FC = () => {
    const { roomId, nickname } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [remainingTime, setRemainingTime] = useState(240);
    const [showNightPopup, setShowNightPopup] = useState(false);
    
    const navigate = useNavigate();


    const handleSend = () => {
        console.log('[🟡 handleSend] 호출됨');
        console.log('    ⤷ input:', input);
        console.log('    ⤷ roomId:', roomId);
        console.log('    ⤷ nickname:', nickname);

        if (!input.trim()) {
            console.log('    ⤷ 입력값 없음. 전송 중단.');
            return;
        }
        socket.emit('chat_message', {
            roomId,
            nickname,
            message: input,
        });

        console.log('[📤 socket.emit] chat_message 전송:', input);

        setInput('');
    };

    useEffect(() => {
        if (!roomId || !nickname) return;

        socket.connect();

        function onConnect() {
            console.log('[🔗 useEffect] 소켓 연결 및 이벤트 바인딩');
            socket.emit('join_room', { roomId, nickname });
            console.log('[📥 socket.emit] join_room 전송:', { roomId, nickname });
        }

        function onDisconnect() {
            console.log('socket disconnected');
        }

        function onChatHistory(history: Message[]) {
            console.log('[📜 수신] chat_history:', history);
            setMessages(history);
        }

        function onChatMessage(msg: Message) {
            console.log('[📩 수신] chat_message:', msg);
            setMessages((prev) => [...prev, msg]);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('chat_history', onChatHistory);
        socket.on('chat_message', onChatMessage);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('chat_history', onChatHistory);
            socket.off('chat_message', onChatMessage);
            socket.disconnect();
        };
    }, [roomId, nickname]);

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <=1){
                    clearInterval(timer);
                    setShowNightPopup(true);
                    setTimeout(() => navigate('/game/nightmafia'), 2000);
                    return 0;
                }
                return prev-1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds/60)
            .toString()
            .padStart(1, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="chat-page">
            <div className="timer-box">남은 시간: <span>{formatTime(remainingTime)}</span></div>

            <div className="chat-overlay">
                <div className="chat-box">
                    {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`chat-message ${msg.nickname === nickname ? 'mine': 'theirs'}`}
                    >
                        {msg.nickname !== nickname && (
                            <div className = "sender-name">{msg.nickname}</div>
                        )}
                        <div className="message-bubble">{msg.message}</div>
                    </div>
                    ))}
                </div>
                
                <div className="chat-input-box">
                    <input 
                        type="text"
                        placeholder="메시지를 입력하세요."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="send-btn" onClick={handleSend}>📤</button>
                </div>
            </div>

            {showNightPopup && (
                <div className = "night-overlay">
                    <div className='night-message'>
                        시간이 종료되었습니다. <br/>
                        밤이 되었습니다.
                    </div>
                </div>
            )}
        </div>
    )
}

export default IntroduceChat;
