import { Avatar } from "../Avatar/Avatar";
import { GetCharacters_characters as Character } from "../../__generated__/GetCharacters";
import { Tile } from "carbon-components-react";
import moment from "moment";
import React from "react";

interface ICharacterTile {
  character: Character;
}

export const CharacterTile: React.FC<ICharacterTile> = ({ character }) => {
  const { id, name, birthday, corporation, totalSp, securityStatus } = character;

  return (
    <Tile className="character-tile-component">
      <div className="character-tile-header">
        <div className="character-tile-header-avatar">
          <Avatar alt={name} src={`https://image.eveonline.com/Character/${id}_128.jpg`} />
        </div>
        <div className="character-tile-header-content">
          <h5>{name}</h5>
          <span className="dob">{`Born: ${moment(birthday).format("YYYY-MM-DD LT")}`}</span>
        </div>
        <div className="character-tile-header-action"></div>
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
