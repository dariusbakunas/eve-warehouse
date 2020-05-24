import { GetCharacters_characters as Character, GetCharacters as CharactersResponse } from "../../__generated__/GetCharacters";
import { CharacterTile } from "../../components/CharacterTile/CharacterTile";
import { loader } from "graphql.macro";
import { Maybe } from "../../utilityTypes";
import { useNotification } from "../../components/Notifications/useNotifications";
import { useQuery } from "@apollo/react-hooks";
import _ from "lodash";
import React, { useMemo } from "react";

const getCharactersQuery = loader("../../queries/getCharacters.graphql");

export const Characters: React.FC = () => {
  const [currentCharacter, setCurrentCharacter] = React.useState<Maybe<Character>>(null);
  const { enqueueNotification } = useNotification();

  const { loading: charactersLoading, data, error } = useQuery<CharactersResponse>(getCharactersQuery);

  const rows = useMemo(() => {
    if (data) {
      return _.chunk(data.characters, 4);
    } else {
      return [];
    }
  }, [data]);

  return (
    <div className="characters">
      <div className="bx--grid bx--grid--full-width">
        {rows.map((row, index) => (
          <div key={index} className="bx--row">
            {row.map((character) => (
              <div className="bx--col bx--col-max-4 bx--col-xlg-4 bx--col-lg-8 bx--col-md-4 bx--col-sm-4" key={character.id}>
                <CharacterTile character={character} />
              </div>
            ))}
            {index === rows.length - 1 && rows[index].length < 4
              ? _.range(1, 4 - rows.length).map((n) => <div className="bx--col bx-col-lg-4 bx-col-md-4 bx-col-sm-4" key={n} />)
              : null}
          </div>
        ))}
      </div>
    </div>
  );
};
