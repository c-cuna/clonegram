import React, { useEffect, useState } from 'react';
import OutlineIcons from "@heroicons/react/24/outline";
import SolidIcons from "@heroicons/react/24/solid";
import { User, LikeType } from '../../constants/types';
import UserListModal from '../Modals/UserListModal/UserListModal';
import ClipboardModal from '../Modals/ClipboardModal';

interface IProps {
    post_id: string,
    is_liked: boolean,
    likes: LikeType[],
    like_count: number,

}

export default function PostInteractionBar(props: IProps) {
    const { post_id, is_liked, likes, like_count } = props;
    const [isLiked, setIsLiked] = useState<boolean>(is_liked);
    const [likeCount, setLikeCount] = useState<number>(like_count);
    const [userLikes, setUserLikes] = useState<User[]>([]);
    const [displayLikesModal, setDisplayLikesModal] = useState(false);
    const [showLink, setShowLink] = useState(false);

    useEffect(() => {

        setIsLiked(is_liked);
        setLikeCount(like_count);
    }, []);

    useEffect(() => {
        const like_arr: any[] = [];

        if (likes.length > 0) {
            likes.map((like) => {
                const { user, post, ...likeObject }: LikeType = {
                    ...like,
                    ...like.user
                };

                like_arr.push({ ...likeObject });
            })
        }
        setUserLikes(like_arr);
    }, [props])

    const likePost = (post: string) => {
        setLikeCount(likeCount + 1);
        setIsLiked(true);
        fetch("/api/posts/like/", {
            method: "POST",
            body: JSON.stringify({ post }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
    }

    const dislikePost = (post: string) => {
        setLikeCount(likeCount - 1);
        setIsLiked(false);
        fetch("/api/posts/dislike/", {
            method: "DELETE",
            body: JSON.stringify({ post }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
    }

    const handleButtonClick = (inputId: string) => {
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.focus();
        }
    };

    return (
        <>
            {showLink && <ClipboardModal post_id={post_id}  closeModal={() => { setShowLink(false) }}/>}
            {displayLikesModal && <UserListModal title="Likes" users={userLikes} closeModalCallBack={setDisplayLikesModal} />}

            <div className="flex flex-row justify-between items-end w-full py-2">
                <div className="flex flex-row h-8">
                    {isLiked ?
                        <SolidIcons.HeartIcon onClick={() => dislikePost(post_id)} className='btn text-red-500 mr-2' />
                        :
                        <OutlineIcons.HeartIcon onClick={() => likePost(post_id)} className='btn mr-2' />
                    }
                    <OutlineIcons.ChatBubbleOvalLeftIcon onClick={() => handleButtonClick('comment-' + post_id)} className='btn' />
                </div>
                <div className="flex flex-row h-8">
                    <OutlineIcons.PaperAirplaneIcon onClick={() => setShowLink(!showLink)} className='btn' />
                </div>

            </div>
            <button onClick={() => setDisplayLikesModal(true)}><span className="text-black-500 font-bold">{likeCount} likes</span></button>
        </>
    )
}