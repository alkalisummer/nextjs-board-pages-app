import React, { ReactNode } from 'react';
import RightArea from './RightArea';
import LeftArea from './LeftArea';

interface LayoutProps {
  children: ReactNode;
  userInfo: {
    id: string;
    email: string;
    image: string;
    nickname: string;
    blogName: string;
  };
  recentPosts: {
    POST_ID: string;
    POST_TITLE: string;
    POST_THMB_IMG_URL: string;
    RGSN_DTTM: string;
  }[];
  popularPosts: {
    POST_ID: string;
    POST_TITLE: string;
    POST_THMB_IMG_URL: string;
    RGSN_DTTM: string;
    LIKE_CNT: number;
  }[];
  recentComments: {
    POST_ID: string;
    COMMENT_ID: string;
    COMMENT_CNTN: string;
    USER_NICKNAME: string;
    RGSR_ID: string;
    RGSN_DTTM: string;
  }[];
  hashtags: {
    HASHTAG_ID: string;
    HASHTAG_NAME: string;
    HASHTAG_CNT: string;
  }[];
}

const BlogLayout: React.FC<LayoutProps> = ({ children, userInfo, recentPosts, popularPosts, recentComments, hashtags }) => {
  return (
    <>
      <LeftArea userInfo={userInfo} recentPosts={recentPosts} popularPosts={popularPosts} recentComments={recentComments} hashtags={hashtags}></LeftArea>
      <RightArea>{children}</RightArea>
    </>
  );
};

export default React.memo(BlogLayout);
