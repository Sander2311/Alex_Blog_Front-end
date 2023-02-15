import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/Comments/CommentsBlock';
import { fetchPosts, fetchTags, fetchPopularPosts, fetchPostsByTag, fetchComents } from '../redux/slices/posts';
import { useParams } from 'react-router-dom';


export const Home = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data);
  const { posts, tags, coments } = useSelector(state => state.posts);
  const [labelState, setLabelState] = React.useState(0);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isComentsLoading = coments.status === 'loading';

  const inTagPage = Boolean(name);


  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComents());
  }, []);

  React.useEffect(() => {
    if (name) {
      dispatch(fetchPostsByTag(name));
    }
  }, [name]);

  const sortPostsByPopular = () => {
    dispatch(fetchPopularPosts());
    setLabelState(1);
    navigate('/');
  };

  const sortPostsByNewness = () => {
    dispatch(fetchPosts());
    setLabelState(0);
    navigate('/');
  };

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={inTagPage ? 2 : labelState} aria-label="basic tabs example">
        <Tab label="New" onClick={sortPostsByNewness} />
        <Tab label="Popular" onClick={sortPostsByPopular} />
        {inTagPage ? (
          <Tab label={`#${name}`} />
        ) : ''}
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `http://localhost:3333${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.coments.length}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock items={coments.items} isLoading={isComentsLoading} isHomePage={true} />
        </Grid>
      </Grid>
    </>
  );
};
