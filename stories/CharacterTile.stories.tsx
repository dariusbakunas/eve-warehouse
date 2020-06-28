import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { GetCharacters_characters as Character } from '../src/__generated__/GetCharacters';
import { CharacterTile } from '../src/components/CharacterTile/CharacterTile';
import { object, withKnobs } from '@storybook/addon-knobs';

export default {
  title: 'Character Tile',
  component: CharacterTile,
  decorators: [withKnobs],
};

export const Default = () => {
  const CHARACTER_DEFAULT: Character = {
    __typename: 'Character',
    birthday: '2008-07-19T19:59:00.000Z',
    corporation: {
      __typename: 'Corporation',
      alliance: null,
      id: '98265609',
      name: 'Stateless Society',
      ticker: 'STLSS',
    },
    id: '1013965434',
    name: 'Psycer',
    scopes: ['esi-wallet.read_character_wallet.v1', 'esi-markets.read_character_orders.v1', 'esi-characters.read_blueprints.v1'],
    securityStatus: 1.23432424,
    totalSp: 12200012,
  };

  const character = object('character', CHARACTER_DEFAULT);

  return (
    <div style={{ width: '450px', margin: '20px' }}>
      <CharacterTile character={character} onUpdate={action('update')} onRemove={action('remove')} />
    </div>
  );
};
