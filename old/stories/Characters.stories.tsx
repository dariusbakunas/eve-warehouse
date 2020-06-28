import { Characters } from '../src/pages/characters';
import { storiesOf } from '@storybook/react';
import React, { ReactElement, ReactNode } from 'react';

storiesOf('Pages|Characters', module).add('Default', () => <Characters />);
