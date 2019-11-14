import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Skeleton from '@material-ui/lab/Skeleton';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from '@apollo/react-hooks';
import withApollo from '../lib/withApollo';
import { useRouter } from 'next/router';
import CharacterScopeDialog from '../dialogs/CharacterScopeDialog';
import ConfirmDialog from '../dialogs/ConfirmDialog';
import addCharacterMutation from '../queries/addCharacter.graphql';
import removeCharacterMutation from '../queries/removeCharacter.graphql';
import getCharactersQuery from '../queries/getCharacters.graphql';
import useConfirmDialog from '../hooks/useConfirmDialog';
import CharacterTile from '../components/CharacterTile';
import { AddCharacterVariables, AddCharacter as NewCharacterResponse } from '../__generated__/AddCharacter';
import { RemoveCharacter, RemoveCharacterVariables } from '../__generated__/RemoveCharacter';
import { GetCharacters as CharactersResponse } from '../__generated__/GetCharacters';
import { makeStyles, Theme } from '@material-ui/core';
import withWidth, { isWidthUp, WithWidthProps } from '@material-ui/core/withWidth';

const useStyles = makeStyles<Theme>(theme => ({
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  scopes: {
    height: '200px',
    overflow: 'auto',
  },
}));

export const Characters: React.FC<WithWidthProps> = ({ width }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { confirmDialogProps, showAlert } = useConfirmDialog();
  const [scopeDialogOpen, setScopeDialogOpen] = React.useState(false);
  const router = useRouter();

  const [addCharacter, { loading: characterAddLoading, error: characterAddError }] = useMutation<NewCharacterResponse, AddCharacterVariables>(
    addCharacterMutation,
    {
      onCompleted: data => {
        enqueueSnackbar(`Character '${data.addCharacter.name}' added successfully`, { variant: 'success', autoHideDuration: 5000 });
        router.push('/characters');
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
    }
  );

  const [removeCharacter, { loading: characterRemovalLoading, error: characterRemovalError }] = useMutation<
    RemoveCharacter,
    RemoveCharacterVariables
  >(removeCharacterMutation);

  const { loading: charactersLoading, data, error } = useQuery<CharactersResponse>(getCharactersQuery);

  const { query } = router;

  useEffect(() => {
    if (query.code) {
      addCharacter({
        variables: {
          input: {
            code: query.code as string,
          },
        },
      });
    }
  }, [query.code]);

  const handleAddCharacter = (scopes?: string[]) => {
    setScopeDialogOpen(false);

    if (scopes && scopes.length) {
      const url = `${process.env.EVE_LOGIN_URL}/oauth/authorize?response_type=code&redirect_uri=${process.env.EVE_CHARACTER_REDIRECT_URL}&client_id=${
        process.env.EVE_CLIENT_ID
      }&scope=${scopes.join(' ')}`;
      window.location.href = url;
    }
  };

  const handleRemoveCharacter = (characterId: string, characterName: string) => {
    showAlert(`Remove '${characterName}'?`, `Character '${characterName}' will be removed and future updates disabled`, confirm => {
      if (confirm) {
        removeCharacter({
          variables: {
            id: characterId,
          },
        });
      }
    });
  };

  const cellHeight = charactersLoading ? 120 : 'auto';

  const getGridListCols = () => {
    if (isWidthUp('xl', width!)) {
      return 4;
    }

    if (isWidthUp('lg', width!)) {
      return 3;
    }

    if (isWidthUp('md', width!)) {
      return 2;
    }

    return 1;
  };

  return (
    <React.Fragment>
      <GridList cellHeight={cellHeight} cols={getGridListCols()} spacing={10}>
        {charactersLoading &&
          [0, 1, 2].map(i => (
            <GridListTile key={i}>
              <Skeleton variant="rect" height={cellHeight} />
            </GridListTile>
          ))}
        {data &&
          data.characters &&
          data.characters.map(character => (
            <GridListTile key={character.id}>
              <CharacterTile character={character} onRemove={handleRemoveCharacter} />
            </GridListTile>
          ))}
        {characterAddLoading && (
          <GridListTile>
            <Skeleton variant="rect" height={cellHeight} />
          </GridListTile>
        )}
      </GridList>
      <Button color="primary" onClick={() => setScopeDialogOpen(true)}>
        Add Character
      </Button>
      <ConfirmDialog {...confirmDialogProps} />
      <CharacterScopeDialog open={scopeDialogOpen} onClose={handleAddCharacter} />
    </React.Fragment>
  );
};

export default withWidth()(withApollo(Characters));
