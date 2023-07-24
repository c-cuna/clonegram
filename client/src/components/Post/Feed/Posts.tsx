import { use, useEffect, useRef, useState } from 'react';
import Post from './Post'
import { PostType } from "../../../constants/types";
import InfiniteScroll from 'react-infinite-scroll-component';
export interface PostProps {
  posts: PostType[];
}

function Posts() {
  const [page, setPage] = useState(1);
  const [feedData, setFeedData] = useState<PostType[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeed = async () => {
    const response = await fetch("/api/posts/feed/?page=" + page, {
      method: "GET",
      credentials: "include",
    });
    
    const data = await response.json();
    const { results, has_next: hasNext } = data;

    if (hasNextPage) {
      setFeedData((prevItems) => [...prevItems, ...results]);
      setPage((previous_page) => {return previous_page + 1});
      setHasNextPage(hasNext);
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      const response = await fetch("/api/posts/feed/?page=" + page, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      const { results, has_next: hasNext, page_number } = data;
      setFeedData(results);
      setHasNextPage(hasNext);
      setPage(parseInt(page_number) + 1);
      setIsLoading(false);
    }

    fetchInitialData();
  }, []);


  return (
    !isLoading ?
      feedData && feedData.length > 0 ?
      <InfiniteScroll
      dataLength={feedData.length}
      next={fetchFeed}
      hasMore={hasNextPage}
      loader={<p>Loading...</p>}
      endMessage={<p className="text-center my-8">You've reached the end</p>}
    >
          {feedData.length > 0 && feedData.map((post, index) => (
            <Post
              key={post.id}
              post={post}
            />
          ))}

        </InfiniteScroll>
        :
        <div className='rounded flex h-screen w-full justify-center items-center '>
          <div className="text-center rounded-lg md:flex-row md:w-full bg-white dark:bg-zinc-900 p-8">
            <p>You currently are not following anyone.</p>
            <p className="text-blue-700 text-sm mt-2"><a href="/search">Go to Search</a></p>
          </div>
        </div>
      :
      <></>

  );
}

export default Posts