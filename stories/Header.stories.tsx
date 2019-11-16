import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Header from '../src/components/Header';

storiesOf('Components|Header', module)
  .add('Not authenticated', () => <Header isAuthenticated={false} onLoginClick={action('login click')} title="Header" />)
  .add('Authenticated', () => <Header isAuthenticated={true} onLogoutClick={action('logout click')} title="Header" />)
  .add('With Avatar', () => (
    <Header
      isAuthenticated={true}
      onLogoutClick={action('logout click')}
      title="Header"
      user={{ displayName: 'Darius', picture: 'https://avatars0.githubusercontent.com/u/2111392?v=4' }}
    />
  ));
