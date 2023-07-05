import { useEffect, useState } from "react";
import { useAuth } from "../auth";

import AuthFormContainer from '../components/Auth/AuthFormContainer';
import Feed from '../components/Post/Feed/Feed';
import { useTheme } from "next-themes";

export default function Home() {
  const [displayedPage, setDisplayedPage] = useState(0);
  const { loading, isAuthenticated } = useAuth();
  const { setTheme } = useTheme();
  useEffect(() => {
    if((!loading && isAuthenticated)){
      setDisplayedPage(2);
    } 
    else if(!loading && !isAuthenticated) {
      setDisplayedPage(1);
    }
  }, [loading])

  if(displayedPage == 0){
    return;
  }
  if(displayedPage === 1){
    setTheme('light');
    return <AuthFormContainer />
  } else if(displayedPage === 2){
    return <Feed />
  }
  return;
}
