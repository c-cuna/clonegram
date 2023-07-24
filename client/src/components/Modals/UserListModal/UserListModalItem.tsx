import { useState, useEffect } from 'react'
import Image from 'next/image'
import { User } from '../../../constants/types';


export default function UserListModalItem(user: User) {
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
        <li>
            <span className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50  group dark:text-white">
                <span> <Image
                    src={user?.profile_picture || "/default-profile-picture.svg"}
                    alt={user?.username}
                    className='object-cover w-10 h-10 rounded-full'
                    width={500}
                    height={500}
                /></span>
                <span className="flex-1 ml-3 whitespace-nowrap">{user?.username}</span>
                {!user.is_self && (!isFollowing ?
                    <button onClick={() => follow(user?.id)} className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-white bg-blue-500 rounded">Follow</button>
                    :
                    <button onClick={() => unfollow(user?.id)} className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">Unfollow</button>
                )}
            </span>
        </li>
    )
}
