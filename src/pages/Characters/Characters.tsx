import { GetCharacters_characters as Character, GetCharacters as CharactersResponse } from "../../__generated__/GetCharacters";
import { CharacterScopesDialog } from "../../dialogs/CharacterScopesDialog/CharacterScopesDialog";
import { CharacterTile } from "../../components/CharacterTile/CharacterTile";
import { loader } from "graphql.macro";
import { Loading } from "carbon-components-react";
import { Maybe } from "../../utilityTypes";
import { useNotification } from "../../components/Notifications/useNotifications";
import { useQuery } from "@apollo/react-hooks";
import _ from "lodash";
import React, { useCallback, useMemo, useState } from "react";

const getCharactersQuery = loader("../../queries/getCharacters.graphql");

export const Characters: React.FC = () => {
  const [updateScopesModalVisible, setUpdateScopesModalVisible] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<Maybe<Character>>(null);
  const { enqueueNotification } = useNotification();

  const { loading: charactersLoading, data, error } = useQuery<CharactersResponse>(getCharactersQuery);

  const rows = useMemo(() => {
    if (data) {
      return _.chunk(data.characters, 4);
    } else {
      return [];
    }
  }, [data]);

  const loading = charactersLoading;

  const handleCharacterUpdate = useCallback(
    (character: Character) => {
      setCurrentCharacter(character);
      setUpdateScopesModalVisible(true);
    },
    [setUpdateScopesModalVisible]
  );

  const handleScopesDialogClose = useCallback(() => {
    setUpdateScopesModalVisible(false);
    setCurrentCharacter(null);
  }, [setCurrentCharacter, setUpdateScopesModalVisible]);

  const handleScopesDialogSubmit = useCallback(
    (scopes: string[]) => {
      const character = currentCharacter;
      setUpdateScopesModalVisible(false);
      setCurrentCharacter(null);

      if (!character) {
        return;
      }

      if (scopes && scopes.length) {
        const state = btoa(JSON.stringify({ id: character.id }));

      } else {
        console.warn(`skipping ${character.name} update, no scopes were selected`);
      }
    },
    [currentCharacter]
  );

  return (
    <div className="characters">
      {loading && <Loading description="Active loading indicator" withOverlay={true} />}
      <div className="bx--grid bx--grid--full-width">
        {rows.map((row, index) => (
          <div key={index} className="bx--row">
            {row.map((character) => (
              <div className="bx--col bx--col-max-4 bx--col-xlg-4 bx--col-lg-8 bx--col-md-4 bx--col-sm-4" key={character.id}>
                <CharacterTile character={character} onUpdate={handleCharacterUpdate} />
              </div>
            ))}
          </div>
        ))}
      </div>
      {currentCharacter && (
        <CharacterScopesDialog
          character={currentCharacter}
          open={updateScopesModalVisible}
          onClose={handleScopesDialogClose}
          onSubmit={handleScopesDialogSubmit}
        />
      )}
    </div>
  );
};
