import { useEffect, useState, useMemo, createContext, useContext, ReactNode } from "react";

type AuthProps = {
    children: ReactNode,
};

export const WSStateContext = createContext<WebSocket | null>(null);

export default function WebsocketContainer({ children }: AuthProps) {
    const [token, setToken] = useState("");
    const isBrowser = typeof window !== "undefined";
    const wsInstance = useMemo(() => (isBrowser && token != "") ? new WebSocket(process.env.NEXT_PUBLIC_MACHINE_WEBSOCKET + "/ws/notifications/?token=" + token ) : null, [token]);

    const fetchToken = async () => {
        const response = await fetch("/api/accounts/token/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const newData = await response.json();
        setToken(newData.token)
    }

    useEffect(() => {
        fetchToken();
    });

    useEffect(() => {
        if(wsInstance){
            wsInstance.onopen = function(e) {
                console.log("Successfully connected to the WebSocket.");
            }   
            wsInstance.onerror = function(err: any) {
                console.log("WebSocket encountered an error: " + err.data);
                console.log("Closing the socket.");
                wsInstance.close();
            }
        }
    }, [wsInstance]);



    return (
        <WSStateContext.Provider value={wsInstance}>
            {children}
        </WSStateContext.Provider>
    )
}


export function useWS(): WebSocket {
    const context = useContext(WSStateContext);
  
    if (context == undefined) {
      throw new Error('useWS must be used within a WSProvider');
    }
  
    return context;
}