import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/router'
import Image from 'next/image';
import Layout from "../components/Layout";
import UserListModal from "../components/Modals/UserListModal/UserListModal";
import { User } from "../constants/types";
import UserPostItem from "../components/UserPostItem";

import InfiniteScroll from 'react-infinite-scroll-component';

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
    followers: User[],
    following: User[]
}

interface IPost {
    id: string,
    image_url: string,
    description: string,
    like_count: string,
    comments_count: string,
    username: string
}

export default function Profile() {
    const [userProfile, setUserProfile] = useState<IProfile>();
    const [userPosts, setUserPosts] = useState<IPost[]>([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);


    const [openFollowingModal, setOpenFollowingModal] = useState(false);
    const [openFollowersModal, setOpenFollowersModal] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const { isReady, query } = router;
    const { username } = router.query;

    useEffect(() => {
        if (!isReady) return
        getProfileData();
        getUserPosts();
    }, [isReady, query]);

    const getProfileData = async () => {
        const response = await fetch(`/api/accounts/` + username,
            {
                method: "GET",
                credentials: "include",
            });
        const data = await response.json();
        setUserProfile(data.user);
        setIsFollowing(data.user?.is_following || false);
    };


    const getUserPosts = async () => {
        const response = await fetch(`/api/accounts/posts/${username}?page=1`,
            {
                method: "GET",
                credentials: "include",
            });
        const data = await response.json();
        const { results, has_next: hasNext, page_number } = data;
        setUserPosts(results);
        setHasNextPage(hasNext);
        setPage(parseInt(page_number) + 1);
        setIsLoading(false);
    }

    const loadUserPosts = async () => {
        const response = await fetch(`/api/accounts/posts/${username}?page=${page}`,
            {
                method: "GET",
                credentials: "include",
            });
        const data = await response.json();
        const { results, has_next: hasNext, page_number } = data;
        if (hasNextPage) {
            setUserPosts((prevItems) => [...prevItems, ...results]);
            setPage((previous_page) => { return previous_page + 1 });
            setHasNextPage(hasNext);
        }
    }

    const follow = (user_id: number) => {
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

    const unfollow = (user_id: number) => {

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
        <Layout>
            {!isLoading ?
                userProfile && Object.keys(userProfile).length > 0 ?
                    <>
                        <div className="flex items-center text-center flex-col md:flex-row md:text-left py-8">
                            <Image
                                src={userProfile?.profile_picture || "/default-profile-picture.svg"}
                                alt={userProfile?.username || ''}
                                className='object-cover w-36 h-36 mx-10 rounded-full dark:bg-gray-400 dark:border-zinc-200'
                                width={500}
                                height={500}
                            />

                            <div className="md:ml-6">
                                <div className="md:flex md:items-center mb-3">
                                    <p className="mr-4 text-lg">{userProfile?.username}</p>
                                    {userProfile?.is_self && <span className="btn py-1 px-3 text-sm text-white bg-gray-700 rounded-lg hover:bg-gray-200 hover:text-black"><a href="/settings">Edit Profile</a></span>}
                                    {!userProfile?.is_self && (!isFollowing ?
                                        <button onClick={() => follow(userProfile?.id || 0)} className="inline-flex items-center justify-center px-2 py-0.5 md:ml-3 text-xs font-medium text-white bg-blue-500 rounded">Follow</button>
                                        :
                                        <button onClick={() => unfollow(userProfile?.id || 0)} className="inline-flex items-center justify-center px-2 py-0.5 md:ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">Unfollow</button>
                                    )}
                                </div>
                                {openFollowersModal && <UserListModal title="Followers" users={userProfile?.followers} closeModalCallBack={setOpenFollowersModal} />}
                                {openFollowingModal && <UserListModal title="Following" users={userProfile?.following} closeModalCallBack={setOpenFollowingModal} />}
                                <div className="flex items-center md:items-start mb-4">
                                    <p className="text-xs text-black-500 font-bold ">{userProfile?.posts_count}  <span className="mr-8">posts</span></p>
                                    <button className="text-xs text-black-500 font-bold " onClick={() => setOpenFollowersModal(true)}>{userProfile?.followers_count} <span className=" mr-8">followers</span></button>
                                    <button className="text-xs text-black-500 font-bold" onClick={() => setOpenFollowingModal(true)}>{userProfile?.following_count} <span className=" mr-8">following</span></button>
                                </div>

                                <p className="text-black-500 font-bold text-sm">{userProfile?.first_name} {userProfile?.last_name}</p>
                                <p className="text-black-500 text-sm">{userProfile?.bio}</p>
                            </div>
                        </div>
                        <InfiniteScroll
                            dataLength={userPosts.length}
                            next={loadUserPosts}
                            hasMore={hasNextPage}
                            loader={<p>Loading...</p>}
                            endMessage={<></>}
                        >
                            <div className="m-auto border-t border-gray-300 dark:border-zinc-500 py-6 grid gird-cols-1 sm:grid-cols-3 gap-1">

                                {userPosts && userPosts.length > 0 && userPosts.map((post, key) => (
                                    <UserPostItem  
                                        key={post.id}
                                        post={post} 
                                    />
                                ))}

                            </div>
                        </InfiniteScroll>
                    </>
                    :
                    <div className='rounded flex h-screen w-full justify-center items-center'>
                        <div className="text-center rounded-lg md:flex-row md:w-full bg-white dark:bg-zinc-900 p-8">
                            <p>No user exists with this username</p>
                            <p className="text-blue-700 dark:text-blue-300 text-sm mt-2"><a href="/search">Go to Search</a></p>
                        </div>
                    </div>
                : <></>}
        </Layout>
    )
}