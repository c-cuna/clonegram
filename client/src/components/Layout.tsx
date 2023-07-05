import { useState, useEffect, createContext, Dispatch, SetStateAction } from "react";
import AuthContainer from "./AuthContainer";
import Sidebar from "./Sidebar";
import WebsocketContainer from "./WebSocketContainer";
import PostModal from "./Modals/PostModal";
import { PostType } from "../constants/types";

type LayoutProps = {
  children: React.ReactNode,
};

type PostModalValues = {
  isOpen: boolean,
  postId: string | null,
}

type PostModalContextType = {
  values: PostModalValues,
  setValues: Dispatch<SetStateAction<PostModalValues>>
}
// type AuthProps = {
//   children: ReactNode,
// };

export const PMStateContext = createContext<PostModalContextType | null>(null);

export default function Layout({ children }: LayoutProps) {
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);;
  const [pmInstance, setPMInstance] = useState<PostModalValues>({
    isOpen: false,
    postId: null
  })

  useEffect(() => {
    const { isOpen, postId } = pmInstance;
    showModal();
  }, [pmInstance]);

  const values: PostModalContextType = {
    values: pmInstance,
    setValues: setPMInstance
  }

  const showModal = async () => {
    const { isOpen, postId } = pmInstance;
    if (isOpen && postId) {
      const response = await fetch(`/api/posts/` + postId,
        {
          method: "GET",
          credentials: "include",
        });
      const data = await response.json();
      setSelectedPost(data.data);
    } else {
      setSelectedPost(null);
    }
    setShowPostModal(true);
  }

  const closeModal = () => {
    setPMInstance({
      isOpen: false,
      postId: null
    });
    setShowPostModal(false);
    setSelectedPost(null);
  }

  return (
    <PMStateContext.Provider value={values}>
      <AuthContainer>
        {(selectedPost && showPostModal) && <PostModal post={selectedPost} closeModal={() => closeModal()} />}
        <div className="min-h-screen mt-12 lg:mt-0 bg-gray-100 dark:bg-zinc-800">
          <WebsocketContainer>
            <Sidebar />
          </WebsocketContainer>
          <div className="max-w-3xl lg:max-w-3xl 2xl:max-w-5xl mx-auto">
            <WebsocketContainer>
              {children}
            </WebsocketContainer>
          </div>
        </div>
      </AuthContainer>
    </PMStateContext.Provider>
  )
}
