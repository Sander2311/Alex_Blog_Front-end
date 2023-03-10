import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";

import styles from './Login.module.scss';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      avatarUrl: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));
    if (!data.payload) {
      alert('Cannot registration');
    };
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    };
  };

  if (isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Create account
      </Typography>
      <div className={styles.avatar}>
        <Avatar
          className={styles.avatar_item}
          sx={{ width: 100, height: 100 }}
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
          fullWidth />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Enter email' })}
          className={styles.field}
          label="E-Mail"
          fullWidth />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          {...register('password', { required: 'Enter password' })}
          className={styles.field}
          label="Password"
          fullWidth />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Register
        </Button>
      </form>
    </Paper>
  );
};
