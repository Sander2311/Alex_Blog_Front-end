import React from "react";
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";


import axios from "../axios";
import { selectIsAuth } from "../redux/slices/auth";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const [comentStatus, setComentStatus] = React.useState(true);
  const { id } = useParams();
  const isAuth = useSelector(selectIsAuth);


  React.useEffect(() => {
    axios.get(`/posts/${id}`).then(res => {
      setData(res.data);
      setLoading(false)
    }).catch(err => {
      console.warn(err);
      alert('Cannot get post')
    });
   }, [comentStatus]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:3333${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.coments.length}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock items={data.coments} isLoading={isLoading}>
      {isAuth ? (
         <>
          <Index postId={id} status={comentStatus} changeStatus={setComentStatus}/>
         </>
         ) : (
          ""
         ) }
      </CommentsBlock>
    </>
  );
};
