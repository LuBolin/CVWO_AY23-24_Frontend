import { ReactNode, createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { jwtCheck } from "../scripts/BackendComm";

type AuthContextType = {
  isSignedIn: boolean;
  setIsSignedIn: (isSignedIn: boolean) => void;
  username: string;
  setUsername: (username: string) => void;
  user_id: number;
  setUser_id: (user_id: number) => void;
};

const defaultState: AuthContextType = {
  isSignedIn: false,
  setIsSignedIn: () => {},
  username: '',
  setUsername: () => {},
  user_id: -1,
  setUser_id: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultState);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(defaultState.isSignedIn);
  const [user_id, setUser_id] = useState<number>(defaultState.user_id);
  const [username, setUsername] = useState<string>(defaultState.username);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    jwtCheck()
      .then(result => {
        if (result && typeof result.user_id !== 'undefined') {
          setIsSignedIn(true);
          setUser_id(result.user_id);
          setUsername(result.username);
        } else {
          setIsSignedIn(false);
          setUser_id(-1);
          setUsername("");
          if (location.pathname === '/newpost') {
            navigate('/account/signin');
          }
        }
      })
      .catch(() => {
        setIsSignedIn(false);
        setUser_id(-1);
        setUsername("");
        if (location.pathname === '/newpost') {
          navigate('/account/signin');
        }
      });
  }, [location, navigate]);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, username, setUsername, user_id, setUser_id }}>
      {children}
    </AuthContext.Provider>
  );
};
