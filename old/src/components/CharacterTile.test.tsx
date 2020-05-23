import { GetCharacters_characters as Character } from '../__generated__/GetCharacters';
import { shallow } from 'enzyme';
import CharacterTile from './CharacterTile';
import React from 'react';

describe('CharacterTile', () => {
  it('match snapshot', () => {
    const character: Character = {
      __typename: 'Character',
      id: '1704528d-6ef0-4590-9108-02a900cfd075_128',
      birthday: '2008-09-14T17:19:00.000Z',
      corporation: {
        __typename: 'Corporation',
        id: '1704528d-6ef0-4590-9108-02a900cfd075_127',
        name: 'Krajcik - Conroy ',
        ticker: 'KC',
        alliance: {
          __typename: 'Alliance',
          id: '1704528d-6ef0-4590-9108-02a900cfd075_126',
          name: 'Bauch, Rippin and Lehner [Group]',
          ticker: 'BRL',
        },
      },
      name: 'Bartholome',
      scopes: ['esi-assets.read_assets.v1', 'esi-characterstats.read.v1'],
      securityStatus: -1.2,
      totalSp: 12231323,
    };
    const wrapper = shallow(<CharacterTile character={character} />);
    expect(wrapper).toMatchSnapshot();
  });
});
