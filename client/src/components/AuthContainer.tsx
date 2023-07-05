import { useEffect, useState, useMemo, createContext, useContext, ReactNode } from "react";
import { useAuth } from "../auth";
import { useRouter } from "next/router";
import cookie from 'cookie';

type AuthProps = {
    children: ReactNode,
};

export default function AuthContainer({ children }: AuthProps) {
    const { loading, isAuthenticated, refreshToken, isExpired } = useAuth();
    const router = useRouter();

    async function refreshExpiredToken() {
        await refreshToken();
        console.log("refreshing");
        setTimeout(refreshExpiredToken, 1000 * 60 * 60);
    }

    useEffect(() => {
        setTimeout(refreshExpiredToken, 1000 * 60 * 60);
    }, []);

    useEffect(() => {
        if (!loading && !isAuthenticated) {

            router.push('/');
        }
    }, [loading, isAuthenticated])

    return (
        <>
            {!loading && children}
        </>
    )
}