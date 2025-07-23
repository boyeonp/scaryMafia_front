import { createContext, useContext, useState } from 'react';

interface UserContextType {
  nickname: string;
  roomId: string;
  setNickname: (name: string) => void;
  setRoomId: (id: string) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');

  return (
    <UserContext.Provider value={{ nickname, roomId, setNickname, setRoomId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('UserContext not found');
  return ctx;
};
