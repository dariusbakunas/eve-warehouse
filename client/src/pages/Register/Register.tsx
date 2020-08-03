import { Button, Form, FormGroup, Loading, TextInput } from 'carbon-components-react';
import { GraphQLError } from 'graphql';
import { loader } from 'graphql.macro';
import { Maybe } from '../../utilityTypes';
import { Register as RegisterResult, RegisterVariables } from '../../__generated__/Register';
import { RootState } from '../../redux/reducers';
import { useMutation } from '@apollo/react-hooks';
import { useNotification } from '../../components/Notifications/useNotifications';
import { useSelector } from 'react-redux';
import React, { useCallback, useEffect } from 'react';
import useValidator from '../../hooks/useValidator';

const DEV = process.env.NODE_ENV === 'development';

interface IFormData {
  code: Maybe<string>;
  username: Maybe<string>;
}

const registerMutation = loader('../../queries/register.graphql');

export const Register: React.FC = () => {
  const { user } = useSelector<RootState, RootState['auth']>((state) => state.auth);
  const { enqueueNotification } = useNotification();
  const { register, handleSubmit, errors, setError, setValue } = useValidator<IFormData>({
    code: '',
    username: '',
  });

  const [registerSubmit, { loading: submitting, error }] = useMutation<RegisterResult, RegisterVariables>(registerMutation, {
    onError: () => null, // workaround to populate error
    onCompleted: () => {
      //setIsComplete(true);
      enqueueNotification('Registered successfully', null, { kind: 'success' });
      window.location.href = DEV ? 'http://localhost:3001/auth/login' : '/auth/login';
    },
  });

  useEffect(() => {
    register('username', { required: true });
    register('code', { required: true });
  }, [register]);

  useEffect(() => {
    if (error) {
      const { graphQLErrors } = error;
      graphQLErrors.forEach((graphQLError: GraphQLError) => {
        const { extensions } = graphQLError;

        if (extensions && extensions.code === 'BAD_USER_INPUT') {
          const { validationErrors } = extensions.exception;
          Object.keys(validationErrors).forEach((key) => {
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
  }, [error, setError]);

  const handleChange = useCallback(
    (name: keyof IFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(name, event.target.value || null);
    },
    [setValue]
  );

  const handleFormSubmit = useCallback(
    (data: IFormData) => {
      if (user && user.email && data.username && data.code) {
        registerSubmit({
          variables: {
            input: {
              username: data.username,
              code: data.code,
              email: user.email,
            },
          },
        });
      }
    },
    [user, registerSubmit]
  );

  return (
    <div className="register-page">
      <div>
        <h2>Register New Account</h2>
        <Loading active={submitting} />
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormGroup legendText="">
            <TextInput
              id="username"
              invalid={!!errors.username}
              invalidText={errors.username ? errors.username.message : undefined}
              labelText="Username"
              placeholder="Username"
              onChange={handleChange('username')}
              required
            />
            <TextInput
              id="email"
              invalidText={errors.username ? errors.username.message : undefined}
              labelText="Email"
              value={user ? user.email : ''}
              readOnly
            />
            <TextInput
              id="code"
              invalidText={errors.code ? errors.code.message : undefined}
              invalid={!!errors.code}
              labelText="Code"
              placeholder="Invitation code"
              onChange={handleChange('code')}
              required
            />
          </FormGroup>
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    </div>
  );
};
