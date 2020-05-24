import { Avatar } from "../Avatar/Avatar";
import { GetCharacters_characters as Character } from "../../__generated__/GetCharacters";
import { Tile } from "carbon-components-react";
import moment from "moment";
import React from "react";

interface ICharacterTile {
  character: Character;
}

export const CharacterTile: React.FC<ICharacterTile> = ({ character }) => {
  const { id, name, birthday } = character;

  return (
    <Tile className="character-tile-component bx--aspect-ratio bx--aspect-ratio--2x1">
      <div className="character-tile-header">
        <div className="character-tile-header-avatar">
          <Avatar alt={name} src={`https://image.eveonline.com/Character/${id}_128.jpg`} />
        </div>
        <div className="character-tile-header-content">
          <span>{name}</span>
          <span className="secondary-text dob">{`Born: ${moment(birthday).format("YYYY-MM-DD LT")}`}</span>
        </div>
        <div className="character-tile-header-action"></div>
      </div>
      <div className="character-tile-content"></div>
    </Tile>
  );
};
