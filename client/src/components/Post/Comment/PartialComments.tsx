import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import PostModal from "../../../components/Modals/PostModal";
import { CommentType, PostType } from "../../../constants/types"

interface IProps {
    post_id: string,
    comments: CommentType[],
    comments_count: number,
}

type FormValues = {
    comment: string,
    post: string
};


interface IPost {
    id: string,
    image_url: string,
    description: string,
    like_count: string,
    comments_count: string,
    username: string
}


const COMMENT_LIMIT: number = 3;

export default function PartialComments(props: IProps) {
    const { post_id, comments, comments_count } = props;
    const { register, handleSubmit, reset } = useForm<FormValues>();
    const [displayedComments, setDisplayedComments] = useState<CommentType[]>([]);


    const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
    const [showPostModal, setShowPostModal] = useState(false);

    const showModal = async (id: string, isOpen: boolean) => {
        if (isOpen) {
            const response = await fetch(`/api/posts/` + id,
                {
                    method: "GET",
                    credentials: "include",
                });
            const data = await response.json();
            setSelectedPost(data.data);
        } else {
            setSelectedPost(null);
        }

        setShowPostModal(!showPostModal);
    }

    const closeModal = () => {
        setShowPostModal(false);
        setSelectedPost(null);
    }

    useEffect(() => {
        const comment_arr = [];
        for (let i: number = comments_count - COMMENT_LIMIT; i < comments_count; i++) {
            if (i < 0) {
                i = 0;
            }
            if (!comments[i]) {
                break;
            }
            comment_arr.push(comments[i]);
        }
        setDisplayedComments(comment_arr);
    }, [props]);

    const onSubmit: SubmitHandler<FormValues> = async data => {

        const { post, comment } = data;
        if (comment == "") return;
        const response = await fetch("/api/posts/comment/", {
            method: "POST",
            body: JSON.stringify({ post, comment }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const newData = await response.json();
        let newComments = displayedComments.slice();
        console.log(newComments);
        newComments.shift();
        newComments.push(newData);
        console.log(newComments);
        setDisplayedComments([...newComments]);
        reset();
    }

    return (
        <>
            {(selectedPost && showPostModal) && <PostModal post={selectedPost} closeModal={() => closeModal()} />}
            <div className='py-2 px-4'>
                {comments_count != 0 && <p><div className='cursor-pointer' onClick={() => showModal(post_id, true)}>View all comments</div></p>}
                {displayedComments.length > 0 && displayedComments.map((comment: CommentType, key: number) => {
                    return <p ><a href={"/" + comment.user?.username} className='font-bold' key={key}>{comment.user?.username}</a> {comment.comment}</p>
                })}
            </div>
            <div className='py-2 px-4 border-t-2 dark:border-zinc-800'>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row justify-between w-full">
                    <input id={`comment-${post_id}`} placeholder="Add comment..." autoComplete="off" {...register("comment")} className='w-full focus:outline-none dark:bg-zinc-900' />
                    <input type="hidden" value={post_id} {...register("post")} />
                    <input type="submit" value="Post" className="text-blue-500 font-medium cursor-pointer" />
                </form>
            </div>
        </>
    )
}