import React from "react";
import { useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import { Index } from "../../components/AddComment";

import Skeleton from "@mui/material/Skeleton";
import axios from "../../axios";

export const Comment = ({
    commentId,
    user,
    text,
    isLoading,
    isHomePage,
    postId,
    comentStatus,
    setComentStatus
}) => {
    const userData = useSelector(state => state.auth.data);
    const [isEditing, setIsEditing] = React.useState(false);

    const onClickRemove = () => {
        if (window.confirm('Are you sure you want to delete the comment?')) {
            axios.delete(`/comment/${postId}/${commentId}`)
                .then(() => {
                    setComentStatus(!comentStatus);
                }).catch(err => {
                    console.warn(err);
                    alert('Cannot dell comment');
                });
        };
    };

    const onClickEdit = () => {
        setIsEditing(true);
    };

    return (
        <>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    {isLoading ? (
                        <Skeleton variant="circular" width={40} height={40} />
                    ) : (
                        <Avatar alt={user.fullName} src={user.avatarUrl} />
                    )}
                </ListItemAvatar>
                {isLoading ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <Skeleton variant="text" height={25} width={120} />
                        <Skeleton variant="text" height={18} width={230} />
                    </div>
                ) : (
                    <ListItemText
                        primary={user.fullName}
                        secondary={text}
                    />
                )}
                {!isHomePage && userData?._id === user._id ? (
                    <>
                        <IconButton onClick={onClickEdit} color="primary">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={onClickRemove} color="secondary">
                            <DeleteIcon />
                        </IconButton>
                    </>
                ) : (
                    <>

                    </>
                )}
            </ListItem>
            {isEditing ? (
                <>
                    <Index
                        id={commentId}
                        comentStatus={comentStatus}
                        setComentStatus={setComentStatus}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        commentText={text}
                    />
                </>
            ) : (
                <>

                </>
            )}
        </>
    );
}