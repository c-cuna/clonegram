import OutlineIcons from "@heroicons/react/24/outline";
import SolidIcons from "@heroicons/react/24/solid";
import { useAuth } from "../auth";
import Image from 'next/image';
import { useRouter } from 'next/router'
import { useEffect, useState, useContext } from "react";
import { WSStateContext, useWS } from '../components/WebSocketContainer';
import WebsocketContainer from "./WebSocketContainer";
import NotificationItems from './NotificationItems';
import { useTheme } from "next-themes";

function Sidebar() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    const pathName = router.pathname;
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const toggleNotificationSidebar = () => {
        setIsProfileMenuOpen(false);
        setIsNotificationOpen(!isNotificationOpen);
    };

    const toggleProfileMenuSidebar = () => {
        setIsNotificationOpen(false);
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const getNotificationsCount = async () => {
        console.log("getting data");
        const response = await fetch("/api/accounts/notification/count/", {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        setNotificationsCount(data.notification_count);
    }

    const logoutUser = () => {
        logout();
        router.push('/');
        router.reload();
    }

    useEffect(() => {
        getNotificationsCount();
    }, []);


    const wsInstance = useContext(WSStateContext);
    if (wsInstance) {
        wsInstance.onmessage = function (event) {
            console.log(`[message] Data received from server: ${event.data}`);
            getNotificationsCount();
        };
    }

    return (<>
        <div className="w-full">
           
            {isNotificationOpen &&
                <div className="opacity-50 fixed inset-0 z-10 bg-black" onClick={() => toggleNotificationSidebar()} ></div>
            }
            <div id="sidebar-notification" className={`w-full xl:w-96 z-20 ${isNotificationOpen ? 'translate-x-64' : '-translate-x-32'} bg-gray-100  fixed left-0 top-0  max-h-screen  overflow-auto transform transition-transform duration-300 ease-in-out dark:bg-zinc-600`}>
                <WebsocketContainer>
                    <NotificationItems />
                </WebsocketContainer>
            </div>
        </div>
        <div className="w-full">
            {isProfileMenuOpen &&
                <div className="opacity-50 fixed inset-0 z-10 bg-black" onClick={() => toggleProfileMenuSidebar()} ></div>
            }
            <div className={`w-full xl:w-48 z-20 ${isProfileMenuOpen ? 'translate-x-64' : '-translate-x-32'} fixed left-0 h-fit bg-gray-100 dark:bg-zinc-900 top-[220px] overflow-auto transform transition-transform duration-300 ease-in-out `}>
                <ul className="flex justify-between bg-white p-4 dark:bg-zinc-900 lg:block lg:space-y-3 font-medium">
                    <a href={"/" + user?.username} className="flex items-center p-2  rounded-md text-gray-900  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <SolidIcons.UserIcon className='btn w-6 lg:w-5 text-black-500' />
                        <span className="hidden ml-2 xl:block">Go to Profile</span>
                    </a>
                    <div onClick={() => logoutUser()} className="flex items-center p-2  rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <SolidIcons.ArrowRightOnRectangleIcon className='btn w-6 lg:w-5 text-black-500' />
                        <span className="hidden ml-2 xl:block">Logout</span>
                    </div>
                </ul>
            </div>
        </div>
        <aside id="default-sidebar" className="fixed z-20 top-0 left-0 w-full h-8 transition-transform sm:block lg:translate-x-0 lg:w-16 xl:w-64 lg:h-screen" aria-label="Sidebar">
            <div className="p-2 lg:px-3 lg:py-4 overflow-y-auto border-b bg-white lg:h-full lg:border-r lg:border-b-0 dark:bg-zinc-900 dark:border-zinc-800">
                <ul className="flex justify-between lg:block lg:space-y-3 font-medium">

                    <li>
                        <span className="ml-2 mr-3 pt-2 hidden sm:block lg:hidden xl:block justify-self-start self-center"> <a href="/">Clonegram</a></span>

                    </li>

                    <div className="flex lg:block">
                        <li>
                            {pathName == '/' ?
                                <a href="/" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <SolidIcons.HomeIcon className='btn w-6 lg:w-5 text-black-500' />
                                    <span className="ml-3 font-bold hidden xl:block">Home</span>
                                </a>
                                :
                                <a href="/" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <OutlineIcons.HomeIcon className='btn w-6 lg:w-5 text-black-500' />
                                    <span className="ml-3 hidden xl:block">Home</span>
                                </a>
                            }
                        </li>
                        <li>
                            {pathName == '/search' ?
                                <a href="/search" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <SolidIcons.MagnifyingGlassIcon className='btn w-6 lg:w-5' />
                                    <span className="flex-1 ml-3 whitespace-nowrap hidden xl:block">Search</span>
                                </a>
                                :
                                <a href="/search" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <OutlineIcons.MagnifyingGlassIcon className='btn w-6 lg:w-5' />
                                    <span className="flex-1 ml-3 whitespace-nowrap hidden xl:block">Search</span>
                                </a>
                            }
                        </li>
                        <li>


                            <div onClick={() => toggleNotificationSidebar()} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white ${isNotificationOpen && 'bg-gray-100 dark:bg-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`} >

                                <strong className="relative inline-flex items-center text-xs">
                                    {notificationsCount > 0 && <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-600 text-white flex justify-center items-center items xl:hidden"><span>{notificationsCount}</span></span>}
                                    {!isNotificationOpen ? <OutlineIcons.HeartIcon className='btn w-6 lg:w-5' />
                                        : <SolidIcons.HeartIcon className='btn w-6 lg:w-5' />}
                                </strong>

                                <span className="flex-1 ml-3 whitespace-nowrap hidden xl:block">Notifications</span>
                                {notificationsCount > 0 && <span className="hidden xl:inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-white bg-red-600 rounded-full dark:bg-blue-900 dark:text-blue-300">{notificationsCount}</span>}
                            </div>


                        </li>

                        <li>
                            {pathName == '/upload' ?
                                <a href={"/upload"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <SolidIcons.PlusCircleIcon className='btn w-6 lg:w-5' />
                                    <span className="flex-1 ml-3 whitespace-nowrap hidden xl:block">Upload</span>
                                </a>
                                :
                                <a href={"/upload"} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <OutlineIcons.PlusCircleIcon className='btn w-6 lg:w-5' />
                                    <span className="flex-1 ml-3 whitespace-nowrap hidden xl:block">Upload</span>
                                </a>
                            }
                        </li>
                        <li>
                            <div onClick={() => toggleProfileMenuSidebar()} className={`flex items-center p-2 text-gray-900 rounded-lg ${isProfileMenuOpen && 'bg-gray-100 dark:bg-gray-700'} dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`}>
                                <Image
                                    src={user?.profile?.profile_picture || "/default-profile-picture.svg"}
                                    alt={user?.username}
                                    className="w-6 h-6 lg:w-5 lg:h-5 rounded-full object-cover"
                                    width={500}
                                    height={500}

                                />
                                <span className="flex-1 ml-3 whitespace-nowrap hidden xl:block">Profile</span>
                            </div>
                        </li>
                        <li  onClick={() => theme == "dark"? setTheme('light'): setTheme("dark")} className="flex items-center mt-2">
                            <button   className="mr-2 lg:flex items-center p-1 ml-1 border-2 border-gray-700 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:bg-gray-700  dark:hover:bg-gray-700">
                                {theme == "dark" ? <OutlineIcons.MoonIcon className='btn w-5 lg:w-5'/> : <OutlineIcons.SunIcon className='btn w-5 lg:w-5' />}
                            </button>
                            <span className="text-md">  {theme == "dark" ? "Dark" : "Light" }</span>
                        </li>
                    </div>
                </ul>
            </div>
        </aside>

    </>

    )
}

export default Sidebar