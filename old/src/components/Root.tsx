import { ApplicationStateProvider } from '../context/ApplicationContext';
import { IUser } from '../auth/auth0Verify';
import { LayoutProvider } from '../context/LayoutContext';
import { SnackbarProvider } from 'notistack';
import { useRouter } from 'next/router';
import IdleTimer from 'react-idle-timer';
import layoutConfig from '../config/layoutConfig';
import React, { useCallback, useRef, useState } from 'react';

interface IProps {
  user?: IUser;
}

const Root: React.FC<IProps> = ({ children, user }) => {
  const router = useRouter();
  const idleTimer = useRef(null);
  const [opened, setOpened] = useState(false);

  const onIdle = useCallback(() => {
    router.push('/auth/logout');
  }, []);

  return (
    <LayoutProvider
      value={{
        ...layoutConfig,
        opened,
        setOpened,
      }}
    >
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <SnackbarProvider maxSnack={3}>
        <div className="root">
          <ApplicationStateProvider>{children}</ApplicationStateProvider>
        </div>
      </SnackbarProvider>
    </LayoutProvider>
  );
};

export default Root;
