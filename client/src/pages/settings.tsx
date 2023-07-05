import { useState,} from "react";
import { useRouter } from "next/router";
import Layout from '../components/Layout';

import { useAuth } from "../auth";

import ChangePasswordForm from '../components/Settings/ChangePasswordForm';
import UpdateProfileForm from '../components/Settings/UpdateProfileForm';
import UploadProfilePictureForm from '../components/Settings/UploadProfilePictureForm';


export default function Settings() {
    const { logout } = useAuth();
    const router = useRouter();
    const [openTab, setOpenTab] = useState(0);
    const logoutUser = () => {
        logout();
        router.push('/');
    }
    return (
        <Layout>
            <div className='flex items-center justify-center min-h-screen'>
                <div className="flex flex-col min-h-[50%] rounded-lg md:flex-row md:w-full  bg-white dark:bg-zinc-900 p-8">
                    <ul
                        className="flex mb-0 w-full text-center list-none justify-center flex-wrap pt-3 pr-3 pb-4 md:w-2/5 md:flex-col md:border-r md:justify-start md:text-left"
                        role="tablist"
                     >
                        <li className="-mb-px mr-3 w-full last:mr-0">
                            <a
                                className={
                                    "text-xs font-bold uppercase px-3 py-3 rounded block leading-normal " +
                                    (openTab === 0
                                        ? "text-white bg-blue-600 dark:bg-gray-700"
                                        : "text-blueGray-600 bg-white dark:bg-zinc-900 dark:hover:bg-gray-700")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(0);
                                }}
                                data-toggle="tab"
                                href="#link0"
                                role="tablist"
                            >
                                Profile
                            </a>
                        </li>
                        <li className="-mb-px mr-2 mt-2 w-full last:mr-0">
                            <a
                                className={
                                    "text-xs font-bold uppercase px-3 py-3 rounded block leading-normal " +
                                    (openTab === 1
                                        ? "text-white bg-blue-600 dark:bg-gray-700"
                                        : "text-blueGray-600 bg-white dark:bg-zinc-900 dark:hover:bg-gray-700")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(1);
                                }}
                                data-toggle="tab"
                                href="#link1"
                                role="tablist"
                            >
                                Upload Picture
                            </a>
                        </li>
                        <li className="-mb-px mr-2 w-full last:mr-0">
                            <a
                                className={
                                    "text-xs font-bold uppercase px-3 py-3 rounded block leading-normal " +
                                    (openTab === 2
                                        ? "text-white bg-blue-600 dark:bg-gray-700"
                                        : "text-blueGray-600 bg-white dark:bg-zinc-900 dark:hover:bg-gray-700")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(2);
                                }}
                                data-toggle="tab"
                                href="#link2"
                                role="tablist"
                            >
                               Change Password
                            </a>
                        </li>
                        <li className="-mb-px mr-2 w-full last:mr-0">
                            <a
                                className={
                                    "text-xs font-bold uppercase px-3 py-3 rounded block leading-normal " +
                                    (openTab === 3
                                        ? "text-white bg-blue-600 dark:bg-gray-700"
                                        : "text-blueGray-600 bg-white dark:bg-zinc-900 dark:hover:bg-gray-700")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(3);
                                }}
                                data-toggle="tab"
                                href="#link2"
                                role="tablist"
                            >
                                Options
                            </a>
                        </li>
                    </ul>
                    <div className="relative flex flex-col h-[800px] min-w-0 break-words w-full mb-6 overflow-y-auto">
                        <div className="px-r pl-6 py-5 flex-auto">
                            <div className="tab-content tab-space">
                                <div className={openTab === 0 ? "block" : "hidden"} id="link0">
                                    <UpdateProfileForm />
                                </div>
                                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                    <UploadProfilePictureForm />
                                </div>
                                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                    <ChangePasswordForm />
                                </div>
                                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                                    <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-50">Account Options</h2>
                                    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-200">This information will be displayed publicly so be careful what you share.</p>
                                    <button onClick={() => logoutUser()} className="px-3 py-2 mt-4 mr-4 text-white text-sm bg-blue-600 rounded-lg hover:bg-blue-900 dark:bg-gray-700 ">Logout</button>
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}