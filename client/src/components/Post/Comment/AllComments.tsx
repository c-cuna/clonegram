import React, { SetStateAction, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { CommentType } from "../../../constants/types"

interface IProps {
    post_id: string,
    comments: CommentType[],
    comments_count: number,
    children: React.ReactNode,
}

type FormValues = {
    comment: string,
    post: string
};

export default function AllComments(props: IProps) {
    const { post_id, comments, comments_count, children } = props;
    const { register, handleSubmit, reset } = useForm<FormValues>();
    const [displayedComments, setDisplayedComments] = useState<CommentType[]>([]);

    useEffect(() => {
        setDisplayedComments(comments);
    }, [props]);

    const onSubmit: SubmitHandler<FormValues> = async data => {
        const { post, comment } = data;
        if(comment == "") return;
        const response = await fetch("/api/posts/comment/", {
            method: "POST",
            body: JSON.stringify({ post, comment }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const newData = await response.json();
        let newComments = comments;
        newComments.push(newData);
        setDisplayedComments([...newComments]);
        reset();
    }

    return (
        <>
            <div className="overflow-y-auto md:h-[30rem]  px-4">
                {comments_count != 0 &&
                    displayedComments.map(comment => {
                        return <p><b><a href={"/" + comment.user.username}>{comment.user.username}</a></b> {comment.comment}</p>
                    })
                }
            </div>
            {children}
            <div className="px-3 border-t dark:border-zinc-800 pt-2">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row justify-between w-full ">
                    <input id={`comment-${post_id}`} placeholder="Add comment..." {...register("comment")} autoComplete="off" className='w-full list-none focus:outline-none bg-white  dark:bg-zinc-900 autofill:!bg-zinc-900' />
                    <input type="hidden" value={post_id} {...register("post")} />
                    <input type="submit" value="Post" className="text-blue-500 font-medium cursor-pointer" />
                </form>
            </div>
        </>
    )
}