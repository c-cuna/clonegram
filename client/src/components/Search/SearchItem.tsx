import { useState, useEffect } from "react"
import Image from 'next/image'
import OutlineIcons from '@heroicons/react/24/outline';
import { User } from "../../constants/types";

interface IProps {
    user: User
}

export default function Search({ user }: IProps) {
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        setIsFollowing(user?.is_following || false);
    }, [user]);

    const follow = (user_id: string) => {

        fetch("/api/accounts/follow/", {
            method: "POST",
            body: JSON.stringify({ user_id }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        setIsFollowing(true);
    }

    const unfollow = (user_id: string) => {

        fetch("/api/accounts/unfollow/", {
            method: "DELETE",
            body: JSON.stringify({ user_id }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        setIsFollowing(false);
    }

    return (
        <div className="flex justify-between w-full py-4 pt-8">
            <div className="flex flex-row">
                <a href={"/" + user?.username}>
                    <Image
                        src={user?.profile.profile_picture || 'default-profile-picture.svg'}
                        alt={user?.username || ''}
                        className='object-cover w-12 h-12 md:w-16 md:h-16 rounded-full dark:bg-gray-400'
                        width={500}
                        height={500}
                    />
                </a>
                <span className="font-bold text-xs sm:text-sm ml-3 self-center"><a href={"/" + user?.username}>{user.username}</a></span>
            </div>
            <div className="inline-flex self-center flex-row h-8 ">
                {!user?.is_self && (!isFollowing ?
                    <button onClick={() => follow(user.id)} className="inline-flex items-center mr-2 justify-center px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded">Follow</button>
                    :
                    <button onClick={() => unfollow(user.id)} className="inline-flex items-center mr-2 h-8 justify-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">Unfollow</button>
                )}
                 <a href={"/" + user?.username}><button className="hidden sm:inline-flex items-center px-3 py-1 ml-1 h-8 text-xs text-white rounded bg-gray-700 dark:text-white hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700"><OutlineIcons.UserIcon className='h-5 w-5' /></button></a>
            </div>
        </div>
    )
}