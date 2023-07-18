import { useState } from "react"
import Head from 'next/head'
import LoginForm from "./LoginForm";
import RegisterForm from './RegisterForm'

export default function AuthFormContainer() {
    const [openForm, setOpenForm] = useState(0);
    return (
        <>
            <Head>
                <title>Clonegram</title>
            </Head>
            <main>
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className={openForm === 0 ? "block" : "hidden"} id="link0">
                        <LoginForm setOpenForm={setOpenForm} />
                    </div>
                    <div className={openForm === 1 ? "block" : "hidden"} id="link0">
                        <RegisterForm setOpenForm={setOpenForm} />
                    </div>
                </div>
            </main>
        </>
    )

}