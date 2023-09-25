import PostLayout from '../../components/postLayout';
import BlogLayout from '../../components/blogLayout';
import TrendKeyword from '@/utils/TrendKeyword';
import dynamic from 'next/dynamic';
import Error from 'next/error';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useBeforeunload } from 'react-beforeunload';
const ToastEditor = dynamic(() => import('@/utils/ToastEditor'), { ssr: false });

interface user {
  id: string;
  email: string;
  image: string;
  nickname: string;
  blogName: string;
}

interface recentPost {
  POST_ID: string;
  POST_TITLE: string;
  POST_THMB_IMG_URL: string;
  RGSN_DTTM: string;
}

interface popularPost {
  POST_ID: string;
  POST_TITLE: string;
  POST_THMB_IMG_URL: string;
  RGSN_DTTM: string;
  LIKE_CNT: number;
}

interface recentComment {
  POST_ID: string;
  COMMENT_ID: string;
  COMMENT_CNTN: string;
  USER_NICKNAME: string;
  RGSR_ID: string;
  RGSN_DTTM: string;
}

const CreatePost = ({ userInfo, recentPosts, popularPosts, recentComments }: { userInfo: user; recentPosts: recentPost[]; popularPosts: popularPost[]; recentComments: recentComment[] }) => {
  const { data: session, status } = useSession();
  useBeforeunload((event) => event.preventDefault());
  const router = useRouter();

  const currentUserId = session?.user?.id;
  const { userId } = router.query;

  const [isValidate, setIsValisdate] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated' || currentUserId !== userId) {
      setIsValisdate(false);
    }
  }, [status]);

  return (
    <>
      {isValidate ? (
        <BlogLayout userInfo={userInfo} recentPosts={recentPosts} popularPosts={popularPosts} recentComments={recentComments}>
          <PostLayout>
            <TrendKeyword />
            <ToastEditor mode={'insert'} postId={''} />
          </PostLayout>
        </BlogLayout>
      ) : (
        <Error statusCode={401}></Error>
      )}
    </>
  );
};

export default CreatePost;
