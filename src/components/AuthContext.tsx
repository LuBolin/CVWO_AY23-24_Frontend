import { ReactNode, createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { jwtCheck } from "../scripts/BackendComm";

type AuthContextType = {
  isSignedIn: boolean;
  setIsSignedIn: (isSignedIn: boolean) => void;
  user_id: number;
  setUser_id: (user_id: number) => void;
};

const defaultState: AuthContextType = {
  isSignedIn: false,
  setIsSignedIn: () => {},
  user_id: -1,
  setUser_id: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultState);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(defaultState.isSignedIn);
  const [user_id, setUser_id] = useState<number>(defaultState.user_id);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    jwtCheck()
      .then(result => {
        if (result && typeof result.user_id !== 'undefined') {
          setIsSignedIn(true);
          setUser_id(result.user_id);
        } else {
          setIsSignedIn(false);
          setUser_id(-1);
          if (location.pathname === '/newpost') {
            navigate('/accounts/signin');
          }
        }
      })
      .catch(() => {
        setIsSignedIn(false);
        setUser_id(-1);
        if (location.pathname === '/newpost') {
          navigate('/accounts/signin');
        }
      });
  }, [location, navigate]);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, user_id, setUser_id }}>
      {children}
    </AuthContext.Provider>
  );
};
