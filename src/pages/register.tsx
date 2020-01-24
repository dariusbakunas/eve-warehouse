import { createStyles } from '@material-ui/styles';
import { GraphQLError } from 'graphql';
import { IUser } from '../auth/auth0Verify';
import { makeStyles, Theme } from '@material-ui/core';
import { Register as RegisterResult, RegisterVariables } from '../__generated__/Register';
import { useMutation } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Maybe from 'graphql/tsutils/Maybe';
import React, { useEffect, useState } from 'react';
import registerMutation from '../queries/register.graphql';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useValidator from '../hooks/useValidator';
import withApollo from '../lib/withApollo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    header: {
      fontWeight: 300,
    },
    root: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      width: '400px',
    },
    progress: {
      width: '384px',
    },
    grid: {
      flexGrow: 1,
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    button: {
      marginTop: theme.spacing(2),
    },
  })
);

interface IFormData {
  code: Maybe<string>;
  username: Maybe<string>;
}

interface IRegisterProps {
  user?: IUser;
}

const Register: React.FC<IRegisterProps> = ({ user }) => {
  const classes = useStyles({});
  const [isComplete, setIsComplete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [registerSubmit, { loading, error }] = useMutation<RegisterResult, RegisterVariables>(registerMutation, {
    onCompleted: () => {
      setIsComplete(true);
      enqueueSnackbar(`Registered successfully`, { variant: 'success', autoHideDuration: 5000 });
      router.push('/auth/login');
    },
  });

  const { register, handleSubmit, errors, setError, setValue, values } = useValidator<IFormData>({
    code: '',
    username: '',
  });

  useEffect(() => {
    register('username', { required: true });
    register('code', { required: true });
  }, []);

  useEffect(() => {
    if (error) {
      const { graphQLErrors } = error;
      graphQLErrors.forEach((graphQLError: GraphQLError) => {
        const { extensions } = graphQLError;

        if (extensions && extensions.code === 'BAD_USER_INPUT') {
          const { validationErrors } = extensions.exception;
          Object.keys(validationErrors).forEach(key => {
            switch (key) {
              case 'code':
              case 'username':
                setError(key, { message: validationErrors[key] });
                break;
            }
          });
        }
      });
    }
  }, [error]);

  const handleChange = (name: keyof IFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, event.target.value || null);
  };

  const handleFormSubmit = (data: IFormData) => {
    if (user && user.email) {
      registerSubmit({
        variables: {
          input: {
            username: data.username!,
            code: data.code!,
            email: user.email,
          },
        },
      });
    }
  };

  const isValid = !!values.code && !!values.username && Object.keys(errors).length === 0;

  return (
    <div className={classes.root}>
      <Grid container spacing={0} direction="column" alignItems="center" justify="center" className={classes.grid}>
        <Grid item>
          <Typography variant="h4" gutterBottom className={classes.header}>
            CREATE NEW ACCOUNT
          </Typography>
        </Grid>
        {loading && (
          <Grid item>
            <LinearProgress className={classes.progress} />
          </Grid>
        )}
        <Grid item>
          <form autoComplete="off" className={classes.form} onSubmit={handleSubmit(handleFormSubmit)}>
            <TextField
              id="username"
              required
              disabled={loading}
              error={!!errors.username}
              helperText={errors.username ? errors.username.message : null}
              label="Username"
              className={classes.textField}
              onChange={handleChange('username')}
              margin="normal"
            />
            <TextField
              id="email"
              label="Email Address"
              disabled={loading || isComplete}
              required
              InputProps={{
                readOnly: true,
              }}
              value={user ? user.email : ''}
              className={classes.textField}
              margin="normal"
            />
            <TextField
              id="code"
              required
              disabled={loading || isComplete}
              error={!!errors.code}
              helperText={errors.code ? errors.code.message : null}
              label="Invitation Code"
              className={classes.textField}
              onChange={handleChange('code')}
              margin="normal"
            />
            <Button className={classes.button} variant="contained" color="primary" type="submit" disabled={loading || !isValid || isComplete}>
              Submit
            </Button>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default withApollo(Register);
