import { GetCharacters_characters as Character, GetCharacters as CharactersResponse } from "../../__generated__/GetCharacters";
import { CharacterScopesDialog } from "../../dialogs/CharacterScopesDialog/CharacterScopesDialog";
import { CharacterTile } from "../../components/CharacterTile/CharacterTile";
import { loader } from "graphql.macro";
import { Loading } from "carbon-components-react";
import { Maybe } from "../../utilityTypes";
import { RootState } from "../../redux/reducers";
import { UpdateCharacter, UpdateCharacterVariables } from "../../__generated__/UpdateCharacter";
import { useHistory, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useNotification } from "../../components/Notifications/useNotifications";
import { useSelector } from "react-redux";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const getCharactersQuery = loader("../../queries/getCharacters.graphql");
const updateCharacterMutation = loader("../../queries/updateCharacter.graphql");

export const Characters: React.FC = () => {
  const appConfig = useSelector<RootState, RootState["appConfig"]>((state) => state.appConfig);
  const [updateScopesModalVisible, setUpdateScopesModalVisible] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<Maybe<Character>>(null);
  const { enqueueNotification } = useNotification();
  const history = useHistory();
  const location = useLocation();

  const { loading: charactersLoading, data, error } = useQuery<CharactersResponse>(getCharactersQuery);

  const [updateCharacter, { loading: characterUpdateLoading }] = useMutation<UpdateCharacter, UpdateCharacterVariables>(updateCharacterMutation, {
    onError: (error) => {
      enqueueNotification(`Character update failed: ${error.message}`, null, { kind: "error" });
    },
    onCompleted: (data) => {
      enqueueNotification(`Character '${data.updateCharacter.name}' updated successfully`);
      history.push("/characters");
    },
  });

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
        window.location.href = `${appConfig.eveLoginUrl}/oauth/authorize?response_type=code&redirect_uri=${
          appConfig.eveCharacterRedirectUrl
        }&client_id=${appConfig.eveClientId}&scope=${scopes.join(" ")}&state=${state}`;
      } else {
        console.warn(`skipping ${character.name} update, no scopes were selected`);
      }
    },
    [currentCharacter]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code) {
      if (state) {
        // character update
        try {
          const stateJson = atob(state);
          const { id } = JSON.parse(stateJson);
          updateCharacter({
            variables: {
              id: id,
              code,
            },
          });
        } catch (e) {
          enqueueNotification(`Character update failed: ${e.message}`, null, { kind: "error" });
          console.error(e);
        }
      } else {
        // new character
      }
    }
  }, [location]);

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
