import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
import { selectIsAuth } from "../../redux/slices/auth";
import { Post } from '../../components/Post';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import { fetchPostsByUser } from '../../redux/slices/posts';
import { useParams } from 'react-router-dom';

import axios from '../../axios';
import styles from './User.module.scss';


export const User = () => {
    const isAuth = useSelector(selectIsAuth);
    const { id } = useParams();
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.auth.data);
    const { posts } = useSelector(state => state.posts);
    const [avatarUrl, setAvatarUrl] = React.useState();
    const [fullName, setFullName] = React.useState();
    const [email, setEmail] = React.useState();
    const [isEditing, setIsEditing] = React.useState(false);

    const isPostsLoading = posts.status === 'loading';


    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onChange',
    });

    const onClickEdit = () => {
        setIsEditing(true);
        setAvatarUrl(userInfo?.avatarUrl);
        setFullName(userInfo?.fullName);
        setEmail(userInfo?.email);
    };

    const onSubmit = async (values) => {
        const data = await axios.patch(`/user/${id}`, values);
        if (!data) {
            alert('Cannot update');
        };
        if ('token' in data) {
            window.localStorage.setItem('token', data.payload.token);
        };
        setIsEditing(false);
        alert('Data updated. Refresh the page')
    };

    React.useEffect(() => {
        dispatch(fetchPostsByUser(id));
    }, []);


    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to="/" />;
    };

    return (
        <>
            <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
                <Tab label="Your posts" />
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
                                isEditable={userInfo?._id === obj.user._id}
                            />
                        ))}
                </Grid>
                <Grid xs={4} item>
                    {isEditing ? (
                        <></>
                    ) : (
                        <div className={styles.user}>
                            <Avatar
                                sx={{ width: 200, height: 200 }}
                                src={userInfo?.avatarUrl}
                                className={styles.avatar}
                            />
                            <div className={styles.userInfo}>
                                <h1 className={styles.fullName}>{userInfo?.fullName}</h1>
                                <div>{`Email: ${userInfo?.email}`}</div>
                                <div>{`Date of create: ${userInfo?.createdAt}`}</div>
                                <div>{`Date of update: ${userInfo?.updatedAt}`}</div>
                                <Button onClick={onClickEdit} size="large" variant="contained" fullWidth>Edit</Button>
                            </div>
                        </div>
                    )}

                    {isEditing ? (
                        <div className={styles.editForm}>
                            <div className={styles.avatar}>
                                <Avatar
                                    className={styles.avatar_item}
                                    sx={{ width: 200, height: 200 }}
                                    src={avatarUrl ? avatarUrl : ''}
                                />
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <TextField
                                    type="url"
                                    {...register('avatarUrl')}
                                    className={styles.field}
                                    label="Avatar url"
                                    value={avatarUrl}
                                    onChange={e => setAvatarUrl(e.target.value)}
                                    placeholder="https://..."
                                    fullWidth />
                                <TextField
                                    error={Boolean(errors.fullName?.message)}
                                    helperText={errors.fullName?.message}
                                    {...register('fullName', { required: 'Enter full name' })}
                                    className={styles.field}
                                    label="Full name"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    fullWidth />
                                <TextField
                                    error={Boolean(errors.email?.message)}
                                    helperText={errors.email?.message}
                                    type="email"
                                    {...register('email', { required: 'Enter email' })}
                                    className={styles.field}
                                    label="E-Mail"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    fullWidth />
                                <Button type="submit" size="large" variant="contained" fullWidth>
                                    Save
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <></>
                    )}

                </Grid>
            </Grid>
        </>

    );
};