import Image from 'next/image';
import { PostType } from '../../constants/types';
import PostInteractionBar from '../Post/PostInteractionBar';
import AllComments from '../Post/Comment/AllComments';

interface IProps {
    post: PostType
    closeModal: () => void
}

export default function PostModal(props: IProps) {
    const { id, user, profile_picture, is_liked, likes, like_count, comments, comments_count, image_url, description } = props.post;

    return (
        <div className="flex items-center justify-center min-h-screen overflow-y-auto fixed inset-0 outline-none z-50 focus:outline-none">
            <div className="z-20 opacity-50 fixed inset-0 bg-black" onClick={() => props.closeModal()}></div>
            <div className="z-30 flex flex-col md:flex-row w-full md:w-[80%] xl:w-[60%] bg-white rounded overflow-y-hidden md:h-[48rem]">
                <div className="md:w-3/5 flex self-stretch justify-center border-r dark:border-zinc-800 bg-black">
                    <Image
                        src={image_url || ''}
                        alt={id || ''}
                        className='object-contain h-[48rem] w-auto self-center'
                        width={500}
                        height={500}
                    />
                </div>
                <div className="md:w-2/5 py-2 flex flex-col justify-between self-stretch dark:bg-zinc-900 h-full">
                    <div>
                        <div className="py-3 flex flex-row border-b dark:border-zinc-800 px-3">
                            <Image
                                src={profile_picture || "/default-profile-picture.svg"}
                                alt={user.username || ''}
                                className="w-8 h-8 object-cover rounded-full"
                                width={500}
                                height={500}
                            />
                            <p className="font-bold ml-3 self-center"><a href={"/" + user.username} >{user.username}</a></p>
                        </div>
                        <div className="px-4 pt-3">
                            <p><span className="font-bold"><a href={"/" + user.username} >{user.username}</a></span> {description}</p>

                        </div>

                    </div>

                    <AllComments post_id={id} comments={comments} comments_count={comments_count}>
                        <div className="justify-end">
                            <div className="px-4 border-t dark:border-zinc-800">
                                <PostInteractionBar post_id={id} is_liked={is_liked} likes={likes} like_count={like_count} />
                            </div>
                        </div>
                    </AllComments>

                </div>
            </div>
        </div>

    );
}
