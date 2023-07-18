import { useState, useEffect, useContext } from 'react';

import { WSStateContext } from '../components/WebSocketContainer';
import { Notification } from '../constants/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import NotificationItem  from './NotificationItem';

interface IProfile {
    id: number,
    profile_picture: string,
    username: string,
    bio: string,
    first_name: string,
    last_name: string,
    location: string,
    followers_count: string,
    following_count: string,
    posts_count: string,
    is_following: boolean,
    is_self: boolean,
}

export default function NotificationItems() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            const response = await fetch("/api/accounts/notifications?page=" + page, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            const { results, has_next: hasNext, page_number } = data;
            setNotifications(results);
            setHasNextPage(hasNext);
            setPage(parseInt(page_number) + 1);

        }

        fetchInitialData();
    }, []);

    const loadNotifications = async () => {
        const response = await fetch("/api/accounts/notifications?page=" + page, {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        const { results, has_next: hasNext, page_number } = data;
        if (hasNextPage) {
            setNotifications((prevItems) => [...prevItems, ...results]);
            setPage((previous_page) => { return previous_page + 1 });
            setHasNextPage(hasNext);
        }
    }

   

    const getNotificationData = async (notif_id: string) => {
        const response = await fetch("/api/accounts/notification/get/" + notif_id, {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        setNotifications((prevItems) => [data, ...prevItems]);
    }

    const wsInstance = useContext(WSStateContext);
    if (wsInstance) {
        wsInstance.onmessage = function (event) {
            const audio = new Audio('notification_sound.mp3');
            audio.volume = 0.4;
           
            console.log(`[message] Data received from server: ${event.data}`);
            const data = JSON.parse(event.data);
            switch(data.notification_type){
                case "like":
                    getNotificationData(data.notif_id);
                    audio.play();
                    break;
                case "comment":
                    getNotificationData(data.notif_id);
                    audio.play();
                    break;
                default:
                    setNotifications((prevItems) => prevItems.filter((item) => item.id !== data.notif_id));
                    break;
            }
    
        };
    }

    return notifications ? <InfiniteScroll
            dataLength={notifications.length}
            next={loadNotifications}
            hasMore={hasNextPage}
            loader={<p>Loading...</p>}
            endMessage={<div className="mt-8"></div>}
            scrollableTarget="sidebar-notification"
        >
            {notifications.length > 0 && notifications.map(notification => (
             
                    <NotificationItem {...notification} />
              
            ))}
        </InfiniteScroll>
        :
        <>No items</>
}