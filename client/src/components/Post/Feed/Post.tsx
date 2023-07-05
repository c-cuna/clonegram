import Image from 'next/image';
import { PostType } from '../../../constants/types';
import PostInteractionBar from '../PostInteractionBar';
import PartialComments from '../Comment/PartialComments';

interface IProps {
    post: PostType,

}

function Post(props: IProps) {
    const { post} = props;
    const { id, user, profile_picture, is_liked, likes, like_count, comments, comments_count, image_url, description } = post;
    const { username } = user;

    return (
        <>
       
        <div className='my-8 rounded overflow-hidden shadow-md bg-white dark:bg-zinc-900 dark:border-white ' >
            <div>
 
                <a href={"/" + username} className="py-3 px-4 flex flex-row">
                    <Image
                        src={profile_picture || "/default-profile-picture.svg"}
                        alt={username}
                        className="w-8 h-8 object-cover rounded-full dark:bg-gray-400"
                        width={500}
                        height={500}

                    />
                    <span className="font-semibold ml-3 self-center">{username}</span>
                </a>
            </div>
            
            <Image
            
                src={image_url}
                alt="Picture of the author"
                className='object-cover w-full'
                width={500}
                height={500}

            />
            <div className='px-4'>
                <PostInteractionBar post_id={id} is_liked={is_liked} likes={likes} like_count={like_count} /> 
                <p><a href={"/" + username} className='font-bold'>{username}</a> {description}</p>
            </div>
            <PartialComments post_id={id} comments={comments} comments_count={comments_count} />
        </div>
        </>
    );
}

export default Post