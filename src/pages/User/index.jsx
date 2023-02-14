import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
import { selectIsAuth } from "../../redux/slices/auth";
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';

import Avatar from '@mui/material/Avatar';

import styles from './User.module.scss';


export const User = () => {
    const isAuth = useSelector(selectIsAuth);
    const userInfo = useSelector(state => state.auth.data);

    if (!isAuth) {
        return <Navigate to="/" />
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.user}>
                <Avatar
                    sx={{ width: 300, height: 300 }}
                    src={userInfo?.avatarUrl}
                />
                <div className={styles.userInfo}>
                    <h1 className={styles.fullName}>{userInfo?.fullName}</h1>
                    <div>{`Email: ${userInfo?.email}`}</div>
                    <div>{`Date of create: ${userInfo?.createdAt}`}</div>
                    <div>{`Date of update: ${userInfo?.updatedAt}`}</div>
                    <Link to="/user-info/edit">
                        <Button size="large" variant="contained" fullWidth>Edit</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};