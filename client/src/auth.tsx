import React, { useState, useEffect, useContext } from "react";

interface User {
    id: string,
    email: string,
    name: string,
    username: string
}

const fetchAccessToken = (username: string, password: string): Promise<Response> => {
    return fetch("/api/accounts/login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
    });
};

const refreshAccessToken = (): Promise<Response> => {
    return fetch("/api/accounts/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    });
  };

async function fetchUser(): Promise<Response> {
    return fetch("/api/accounts/user/", {
      method: "GET",
    });
}

async function clearAccessToken(){
  return await fetch("/api/accounts/logout/", {
    method: "POST",
    credentials: "include",
  });
}

async function checkAuthentication(){
  return await fetch("/api/accounts/verify/", {
    method: "GET",
    credentials: "include",
  });
}

type AuthContextProps = {
    isAuthenticated: boolean;
    loading: boolean;
    user: User | null;
    login: (username: string, password: string) => Promise<Response>;
    logout: () => void;
    getToken: () => Promise<string>;
}

const AuthContext = React.createContext<Partial<AuthContextProps>>({});
  
interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isExpired, setIsExpired] = useState(true);
    const [accessToken, setAccessToken] = useState<string>("");
    const [accessTokenExpiry, setAccessTokenExpiry] = useState<number | null>(null);
  
    useEffect(() => {
      initAuth();
    }, []);

    const setNotAuthenticated = (): void => {
      setIsAuthenticated(false);
      setLoading(false);
      setIsExpired(false);
      setUser(null);
    };

    const initAuth = async (): Promise<void> => {
      setLoading(true);
      const resp = await checkAuthentication();
      
      if (!resp.ok) {
        if(resp.status == 403){
          setIsAuthenticated(false);
          setLoading(false);
          return;
        } 
        console.log("Invalid access token");
        console.log("Retrieving new token...");
        await refreshToken();
      } else {
        setIsAuthenticated(true);
        setLoading(false);
        await initUser();
      }
    };

    const login = async (username: string, password: string): Promise<Response> => {
      const resp = await fetchAccessToken(username, password);
      if (resp.ok) {
        setIsAuthenticated(true);
        await initUser();
      } else {
        setIsAuthenticated(false);
        setLoading(true);
      }
      return resp;
    };
    
    const logout = (): void => {
      setNotAuthenticated();
      clearAccessToken();
    };
    
    const refreshToken = async (): Promise<void> => {
      setLoading(true);
      const resp = await refreshAccessToken();
      if (!resp.ok) {
        setIsExpired(true);
        setNotAuthenticated();
        return;
      }
      const tokenData = await resp.json();
      setIsAuthenticated(true);
      setLoading(false);
      await initUser();
      if (user === null) {
        console.log("No user loaded so loading data from refreshed token");
      }
    }
  
    const initUser = async (): Promise<void> => {
      const resp = await fetchUser();
      const user = await resp.json();
      setUser(user);
    }
  
    const value = {
      isAuthenticated,
      user,
      loading,
      refreshToken,
      isExpired,
      login,
      logout,
    };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  
  export const useAuth = (): any => useContext(AuthContext);