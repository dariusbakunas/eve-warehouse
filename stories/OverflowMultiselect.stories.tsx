import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { GetCharacters_characters as Character } from '../src/__generated__/GetCharacters';
import { object, withKnobs } from '@storybook/addon-knobs';
import { SettingsAdjust32 } from '@carbon/icons-react';
import { OverflowMultiselect } from '../src/components/OverflowMultiselect/OverflowMultiselect';

export default {
  title: 'OverflowMultiselect',
  component: OverflowMultiselect,
  decorators: [withKnobs],
};

interface Item {
  id: string;
  label: string;
}

export const Default = () => {
  const items = [
    { id: 'item1', label: 'item1' },
    { id: 'item2', label: 'item2' },
    { id: 'item3', label: 'item3' },
    { id: 'item4', label: 'item4' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', alignItems: 'center' }}>
      <div style={{ width: 200, height: 50, overflow: 'hidden', marginLeft: 'auto', marginRight: 'auto' }}>
        <OverflowMultiselect<Item>
          id="multiselect"
          items={items}
          itemToString={(item) => item?.label || ''}
          initialSelectedItems={[]}
          onChange={action('selection-change')}
          renderIcon={SettingsAdjust32}
        />
      </div>
    </div>
  );
};
