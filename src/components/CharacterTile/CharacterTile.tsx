import { Avatar } from '../Avatar/Avatar';
import { GetCharacters_characters as Character } from '../../__generated__/GetCharacters';
import { OverflowMenu, Tile } from 'carbon-components-react';
import moment from 'moment';
import OverflowMenuItem from 'carbon-components-react/lib/components/OverflowMenuItem';
import React, { memo, useCallback } from 'react';

interface ICharacterTile {
  character: Character;
  onUpdate?: (character: Character) => void;
  onRemove?: (character: Character) => void;
}

export const CharacterTile: React.FC<ICharacterTile> = ({ character, onUpdate, onRemove }) => {
  const { id, name, birthday, corporation, totalSp, securityStatus } = character;

  const handleUpdate = useCallback(() => {
    if (onUpdate) {
      onUpdate(character);
    }
  }, [character, onUpdate]);

  const handleRemove = useCallback(() => {
    if (onRemove) {
      onRemove(character);
    }
  }, [character, onRemove]);

  return (
    <Tile className="character-tile-component">
      <div className="character-tile-header">
        <div className="character-tile-header-avatar">
          <Avatar alt={name} src={`https://image.eveonline.com/Character/${id}_128.jpg`} />
        </div>
        <div className="character-tile-header-content">
          <h5>{name}</h5>
          <span className="dob">{`Born: ${moment(birthday).format('YYYY-MM-DD LT')}`}</span>
        </div>
        <div className="character-tile-header-action">
          <OverflowMenu ariaLabel="Character Menu" direction="bottom" iconDescription="" flipped={true}>
            <OverflowMenuItem itemText="Update Scopes" onClick={handleUpdate} />
            <OverflowMenuItem itemText="Remove" isDelete={true} onClick={handleRemove} />
          </OverflowMenu>
        </div>
      </div>
      <div className="character-tile-content">
        {corporation.alliance && (
          <div>
            <strong>Alliance:</strong> {corporation.alliance.name} [{corporation.alliance.ticker}]
          </div>
        )}
        <div>
          <strong>Corporation:</strong> {corporation.name} [{corporation.ticker}]
        </div>
        <div>
          <strong>Security status:</strong> {securityStatus.toFixed(2)}
        </div>
        {totalSp && (
          <div>
            <strong>Total SP:</strong> {totalSp.toLocaleString()}
          </div>
        )}
      </div>
    </Tile>
  );
};

export default memo(CharacterTile);
