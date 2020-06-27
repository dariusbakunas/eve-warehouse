import { AddCharacterVariables, AddCharacter as NewCharacterResponse } from "../../__generated__/AddCharacter";
import { Button, Loading, Modal } from "carbon-components-react";
import { GetCharacters_characters as Character, GetCharacters as CharactersResponse } from "../../__generated__/GetCharacters";
import { CharacterScopesDialog } from "../../dialogs/CharacterScopesDialog/CharacterScopesDialog";
import { loader } from "graphql.macro";
import { Maybe } from "../../utilityTypes";
import { RemoveCharacter, RemoveCharacterVariables } from "../../__generated__/RemoveCharacter";
import { RootState } from "../../redux/reducers";
import { UpdateCharacter, UpdateCharacterVariables } from "../../__generated__/UpdateCharacter";
import { useConfirm } from "../../hooks/useConfirm";
import { useHistory, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useNotification } from "../../components/Notifications/useNotifications";
import { useSelector } from "react-redux";
import _ from "lodash";
import CharacterTile from "../../components/CharacterTile/CharacterTile";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const getCharactersQuery = loader("../../queries/getCharacters.graphql");
const updateCharacterMutation = loader("../../queries/updateCharacter.graphql");
const addCharacterMutation = loader("../../queries/addCharacter.graphql");
const removeCharacterMutation = loader("../../queries/removeCharacter.graphql");

export const Characters: React.FC = () => {
  const appConfig = useSelector<RootState, RootState["appConfig"]>((state) => state.appConfig);
  const [updateScopesModalVisible, setUpdateScopesModalVisible] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<Maybe<Character>>(null);
  const { enqueueNotification } = useNotification();
  const history = useHistory();
  const location = useLocation();
  const { showConfirmDialog, confirmDialogProps } = useConfirm();

  const { loading: charactersLoading, data } = useQuery<CharactersResponse>(getCharactersQuery, {
    onError: (error) => {
      enqueueNotification(`Character load failed: ${error.message}`, null, { kind: "error" });
    },
  });

  const [updateCharacter, { loading: characterUpdateLoading }] = useMutation<UpdateCharacter, UpdateCharacterVariables>(updateCharacterMutation, {
    onError: (error) => {
      enqueueNotification(`Character update failed: ${error.message}`, null, { kind: "error" });
    },
    onCompleted: (data) => {
      enqueueNotification(`Character '${data.updateCharacter.name}' updated successfully`);
      history.push("/characters");
    },
  });

  const [addCharacter, { loading: characterAddLoading }] = useMutation<NewCharacterResponse, AddCharacterVariables>(addCharacterMutation, {
    onError: (error) => {
      enqueueNotification(`Character update failed: ${error.message}`, null, { kind: "error" });
    },
    onCompleted: (data) => {
      enqueueNotification(`Character '${data.addCharacter.name}' added successfully`, null, { kind: "success" });
      history.push("/characters");
    },
    update(cache, { data }) {
      if (data) {
        const queryResponse = cache.readQuery<CharactersResponse>({
          query: getCharactersQuery,
        });

        if (queryResponse) {
          cache.writeQuery({
            query: getCharactersQuery,
            data: {
              characters: queryResponse.characters.concat([data.addCharacter]),
            },
          });
        }
      }
    },
  });

  const [removeCharacter, { loading: characterRemovalLoading }] = useMutation<
    RemoveCharacter,
    RemoveCharacterVariables
  >(removeCharacterMutation, {
    onError: (error) => {
      enqueueNotification(`Character removal failed: ${error.message}`, null, { kind: "error" });
    },
    onCompleted: (data) => {
      enqueueNotification(`Character removed successfully`, null, { kind: "success" });
      history.push("/characters");
    },
    update(cache, { data }) {
      if (data) {
        const queryResponse = cache.readQuery<CharactersResponse>({
          query: getCharactersQuery,
        });

        if (queryResponse) {
          cache.writeQuery({
            query: getCharactersQuery,
            data: {
              characters: queryResponse.characters.filter((character) => character.id !== data.removeCharacter),
            },
          });
        }
      }
    },
  });

  const rows = useMemo(() => {
    if (data) {
      return _.chunk(data.characters, 4);
    } else {
      return [];
    }
  }, [data]);

  const handleUpdateCharacter = useCallback(
    (character: Character) => {
      setCurrentCharacter(character);
      setUpdateScopesModalVisible(true);
    },
    [setUpdateScopesModalVisible]
  );

  const handleRemoveCharacter = useCallback(
    (character: Character) => {
      showConfirmDialog(
        `Remove '${character.name}?'`,
        `Character '${character.name}' will be removed and future updates disabled. Are you sure?`,
        (confirm) => {
          if (confirm) {
            removeCharacter({
              variables: {
                id: character.id,
              },
            });
          }
        },
        { danger: true }
      );
    },
    [showConfirmDialog]
  );

  const handleAddCharacter = useCallback(() => {
    setCurrentCharacter(null);
    setUpdateScopesModalVisible(true);
  }, [setUpdateScopesModalVisible]);

  const handleScopesDialogClose = useCallback(() => {
    setUpdateScopesModalVisible(false);
  }, [setCurrentCharacter, setUpdateScopesModalVisible]);

  const handleScopesDialogSubmit = useCallback(
    (scopes: string[]) => {
      setUpdateScopesModalVisible(false);

      if (scopes && scopes.length) {
        let url = `${appConfig.eveLoginUrl}/oauth/authorize?response_type=code&redirect_uri=${appConfig.eveCharacterRedirectUrl}&client_id=${
          appConfig.eveClientId
        }&scope=${scopes.join(" ")}`;

        if (currentCharacter) {
          const state = btoa(JSON.stringify({ id: currentCharacter.id }));
          url = `${url}&state=${state}`;
          setCurrentCharacter(null);
        }

        window.location.href = url;
      } else {
        console.warn("no scopes were selected");
      }
    },
    [currentCharacter, appConfig]
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
          // this is only for json parsing errors, request errors handled by the hook
          enqueueNotification(`Character update failed: ${e.message}`, null, { kind: "error" });
          console.error(e);
        }
      } else {
        addCharacter({
          variables: {
            code: code,
          },
        });
      }
    }
  }, [location]);

  const loading = charactersLoading || characterAddLoading || characterUpdateLoading || characterRemovalLoading;

  return (
    <div className="characters">
      {loading && <Loading description="Active loading indicator" withOverlay={true} />}
      <div className="bx--grid bx--grid--full-width">
        {rows.map((row, index) => (
          <div key={index} className="bx--row">
            {row.map((character) => (
              <div className="bx--col bx--col-max-4 bx--col-xlg-4 bx--col-lg-8 bx--col-md-4 bx--col-sm-4" key={character.id}>
                <CharacterTile character={character} onUpdate={handleUpdateCharacter} onRemove={handleRemoveCharacter} />
              </div>
            ))}
          </div>
        ))}
        <div className="bx--row">
          <div className="bx--col bx--col-max">
            <Button className="new-character-btn" disabled={loading} onClick={handleAddCharacter}>
              Add New Character
            </Button>
          </div>
        </div>
      </div>
      <CharacterScopesDialog
        character={currentCharacter}
        open={updateScopesModalVisible}
        onClose={handleScopesDialogClose}
        onSubmit={handleScopesDialogSubmit}
      />
      <Modal {...confirmDialogProps} />
    </div>
  );
};
