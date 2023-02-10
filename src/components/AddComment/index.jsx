import React from "react";
import { useSelector } from 'react-redux';
import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from "../../axios";


export const Index = ({ postId, status, changeStatus }) => {
  const { avatarUrl } = useSelector(state => state.auth.data);
  const [text, setText] = React.useState('');

  const onSubmit = async () => {
    try {
      const fields = {
        text,
      };

      await axios.post(`/coment/${postId}`, fields);

      setText('');
      changeStatus(!status);

    } catch (err) {
      console.warn(err);
      alert('Error create coment');
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={avatarUrl}
        />
        <div className={styles.form}>
          <TextField
            label="Write comment"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className={styles.bottomBlock}>
            <Button variant="contained" onClick={onSubmit}>Send</Button>
            <p>{`Length ${text.length} / 50`}</p>
          </div>
        </div>
      </div>
    </>
  );
};
