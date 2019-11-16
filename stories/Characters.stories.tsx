import React, { ReactElement, ReactNode } from 'react';

import { storiesOf } from '@storybook/react';
import { Characters } from '../src/pages/characters';

storiesOf('Pages|Characters', module).add('Default', () => <Characters />);
