import { useContext } from "react";
import { PMStateContext } from "./Layout";
import Image from 'next/image';

interface IPost {
    id: string,
    image_url: string,
    description: string,
    like_count: string,
    comments_count: string,
    username: string
}

interface IProps {
    post: IPost,
}

export default function UserPostItem(props: IProps){
    const context = useContext(PMStateContext);
    const { post} = props;
    const {  id, image_url, description } = post;
    
    const showModal = (id: string) => {
        if (context) {
            context.setValues({
                isOpen: true,
                postId: id
            });
        }
    }

    return(
        <div onClick={() => showModal(id)}>
            <Image
                src={image_url}
                alt={description}
                className='object-cover h-96 sm:h-44 md:h-56 lg:h-62 2xl:h-80 w-full  p-0.5'
                width={500}
                height={500}
            />
        </div>
    )
}