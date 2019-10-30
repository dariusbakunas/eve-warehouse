import React, { FormEventHandler, useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { createStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import registerMutation from '../queries/register.graphql';
import { useMutation } from '@apollo/react-hooks';
import { Register as RegisterResult, RegisterVariables } from '../__generated__/Register';
import withApollo from '../lib/withApollo';
import { GraphQLError } from 'graphql';
import { useRouter } from 'next/router';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IUser } from '../auth/auth0Verify';

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

interface RegisterState {
  code: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface IRegisterProps {
  user?: IUser;
}

const Register: React.FC<IRegisterProps> = ({ user }) => {
  const classes = useStyles({});
  const router = useRouter();

  const [register, { loading, error }] = useMutation<RegisterResult, RegisterVariables>(registerMutation, {
    onCompleted: () => {
      router.push('/auth/login');
    },
  });

  const [validationErrors, setValidationErrors] = useState<Partial<RegisterState>>({});

  const [values, setValues] = useState<RegisterState>({
    code: '',
    email: user ? user.email : '',
    firstName: '',
    lastName: '',
    username: '',
  });

  useEffect(() => {
    if (error) {
      const { graphQLErrors } = error;
      graphQLErrors.forEach((graphQLError: GraphQLError) => {
        const { extensions } = graphQLError;

        if (extensions && extensions.code === 'BAD_USER_INPUT') {
          const { validationErrors } = extensions.exception;
          setValidationErrors(validationErrors);
        }
      });
    }
  }, [error]);

  const handleChange = (name: keyof RegisterState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});
    register({ variables: { input: values } });
  };

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
          <form autoComplete="off" className={classes.form} onSubmit={handleSubmit}>
            <TextField
              id="username"
              required
              disabled={loading}
              error={!!validationErrors['username']}
              helperText={validationErrors['username']}
              label="Username"
              className={classes.textField}
              value={values.username}
              onChange={handleChange('username')}
              margin="normal"
            />
            <TextField
              id="email"
              label="Email"
              className={classes.textField}
              value={values.email}
              InputProps={{
                readOnly: true,
              }}
              margin="normal"
            />
            <TextField
              id="fname"
              label="First Name"
              disabled={loading}
              className={classes.textField}
              value={values.firstName}
              onChange={handleChange('firstName')}
              margin="normal"
            />
            <TextField
              id="lname"
              label="Last Name"
              disabled={loading}
              className={classes.textField}
              value={values.lastName}
              onChange={handleChange('lastName')}
              margin="normal"
            />
            <TextField
              id="code"
              required
              disabled={loading}
              error={!!validationErrors['code']}
              helperText={validationErrors['code']}
              label="Invitation Code"
              className={classes.textField}
              value={values.code}
              onChange={handleChange('code')}
              margin="normal"
            />
            <Button className={classes.button} variant="contained" color="primary" type="submit" disabled={loading}>
              Submit
            </Button>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default withApollo(Register);
