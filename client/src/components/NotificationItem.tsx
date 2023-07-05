import { User } from '../constants/types';
import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { PMStateContext } from './Layout';
interface IProps {
    id: string,
    is_read: boolean,
    sender: User,
    timestamp: string,
    message: string,
    notification_type: string,
    post: string
}

export default function NotificationItem(props: IProps) {
    const router = useRouter();
    const { id, is_read, sender, post, notification_type, message, timestamp } = props;
    const [read, setRead] = useState(false);
    const context  = useContext(PMStateContext);

    useEffect(() => {
        setRead(is_read);
    }, [is_read])

    const markNotificationAsRead = async () => {
        const response = await fetch("/api/accounts/notification/read/" + id + "/", {
            method: "PUT",
            body: JSON.stringify({ is_read: true }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const newData = await response.json();
        if(notification_type == "like" || notification_type ==  "comment"){
            if(context){
                context.setValues({
                    isOpen: true,
                    postId: post
                });
            }
        } else if(notification_type == "follow"){
            router.push(`/${sender}`);
        }
        if (newData) {
            setRead(true);
        }
    }
    return (
            <div onClick={() => { markNotificationAsRead() }} className={(read ? " bg-neutral-200 dark:bg-zinc-700 " : "bg-white dark:bg-black ") + " mt-1 w-full shadow-sm flex justify-start items-center p-4 "}>
                <div className='flex mr-8 flex-col'>
                    <div className='flex'>
                        <a href={"/" + sender.username}>
                            <Image
                                src={sender.profile.profile_picture || "/default-profile-picture.svg"}
                                alt={sender.username}
                                className="w-14 h-14 mr-4 lg:w-16 lg:h-16 rounded-full object-cover dark:bg-gray-400"
                                width={500}
                                height={500}

                            />
                        </a>
                        <div className="flex flex-col items-start justify-center">
                            <p className='font-bold'><a href={"/" + sender.username}>{sender.first_name + " " + sender.last_name}</a></p>
                            <p className='text-xs text-gray-600 dark:text-gray-200'><a href={"/" + sender.username}>@{sender.username} </a></p>
                            <p className='text-xs text-gray-600 dark:text-gray-400'>{timestamp}</p>
                            <p>{message}</p>
                        </div>
                    </div>

                </div>
            </div>
    )
}