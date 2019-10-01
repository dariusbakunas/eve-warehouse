import React, { ReactElement, ReactNode } from 'react';

import { storiesOf } from '@storybook/react';
import { Characters } from '../src/pages/Characters';

storiesOf('Pages|Characters', module).add('Default', () => <Characters />);
