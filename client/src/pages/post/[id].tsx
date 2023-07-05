import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Layout from "../../components/Layout";
import SinglePost from "../../components/Post/SinglePost";
import { PostType } from "../../constants/types";

export default function Post() {
    const router = useRouter();
    const { isReady, query } = router;
    const { id } = router.query;
    const [post, setPost] = useState<PostType>();

    const getPost = async () => {
        const response = await fetch(`/api/posts/` + id,
            {
                method: "GET",
                credentials: "include",
            });
        const data = await response.json();
        setPost(data.data);
    }

    useEffect(() => {
        if (!isReady) return
        getPost();
    }, [isReady, query]);

    return (
        <Layout>
            {post && <SinglePost post={post} />}
        </Layout>
    );

}