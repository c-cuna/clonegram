import { useState, useEffect } from "react"
import Layout from '../components/Layout';
import { User } from "../constants/types";
import SearchItem from '../components/Search/SearchItem';

import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


type FormValues = {
    username: String,
};

export default function Search() {
    const [users, setUsers] = useState<User[]>([]);
    const [hasUsers, setHasUsers] = useState(true);
    const validationSchema = Yup.object().shape({
        username: Yup.string(),
    }); 
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState } = useForm<FormValues>(formOptions);

    const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
        setHasUsers(true)
        let { username } = data;
        const response = await fetch("/api/accounts/search/" + username, {
            method: "GET",
            credentials: "include"
        });
        const users_data = await response.json();
        setUsers(users_data.data);
        if(!users_data.data){
            setHasUsers(false);
        }
    }

    return (
        <Layout>
            <div className="flex items-start justify-start min-h-screen w-full">
                <div className="rounded-lg mt-8 bg-white dark:bg-zinc-900 p-8 w-full">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row">
                        <input type="text" className="w-full px-4 p-1 mr-4  border rounded-md focus:ring-1 focus:ring-blue-600 focus:outline-none  dark:bg-gray-800 dark:placeholder-white dark:border-gray-600" placeholder="Search Username" {...register("username")} />
                        <input type="submit" className="btn bg-blue-500 dark:bg-gray-700 text-white py-1 px-3 rounded cursor-pointer" value="Search"  />
                    </form>
                    {!hasUsers && <p className='mt-6 text-center'>No users found with that username</p>}
                    {users && users?.length > 0 && users.map((user, key) => (
                        <SearchItem user={user} key={key} />
                    ))}
                </div>
            </div>
        </Layout>
    )
}