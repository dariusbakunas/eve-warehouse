import { createStyles, Dialog, Theme, GridListTile } from '@material-ui/core';
import DialogTitle from '../components/DialogTitle';
import React, { useState } from 'react';
import DialogContent from '../components/DialogContent';
import { GetCharacters_characters as Character } from '../__generated__/GetCharacters';
import { useQuery } from '@apollo/react-hooks';
import { GetCharacterSkills, GetCharacterSkillsVariables } from '../__generated__/GetCharacterSkills';
import getCharacterSkillsQuery from '../queries/getCharacterSkills.graphql';
import LinearProgress from '@material-ui/core/LinearProgress';
import GridList from '@material-ui/core/GridList';
import makeStyles from '@material-ui/core/styles/makeStyles';
import SkillGroupButton from '../components/SkillGroupButton';
import { GetCharacterSkills_character_skillGroups as SkillGroup } from '../__generated__/GetCharacterSkills';
import Maybe from 'graphql/tsutils/Maybe';
import { GetSkillGroupSkills, GetSkillGroupSkillsVariables } from '../__generated__/GetSkillGroupSkills';
import getSkillGroupSkillsQuery from '../queries/getSkillGroupSkills.graphql';
import { useSnackbar } from 'notistack';
import SkillProgress from '../components/SkillProgress';

export interface ICharacterSkillsDialogProps {
  character: Character;
  open: boolean;
  onClose: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    skillsWrapper: {
      display: 'flex',
      flexWrap: 'wrap',
      overflowY: 'scroll',
      justifyContent: 'space-around',
      //backgroundColor: theme.palette.grey.A100,
      maxHeight: '300px',
      padding: theme.spacing(2),
    },
    gridList: {
      width: '100%',
    },
  })
);

const CharacterSkillsDialog: React.FC<ICharacterSkillsDialogProps> = ({ character, open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [currentSkillGroup, setCurrentSkillGroup] = useState<Maybe<SkillGroup>>(null);

  const { loading, data } = useQuery<GetCharacterSkills, GetCharacterSkillsVariables>(getCharacterSkillsQuery, {
    variables: {
      id: character.id,
    },
    onCompleted: data => {
      if (data.character) {
        setCurrentSkillGroup(data.character.skillGroups[0]);
      }
    },
  });

  const { loading: skillGroupLoading, data: skillGroupData } = useQuery<GetSkillGroupSkills, GetSkillGroupSkillsVariables>(getSkillGroupSkillsQuery, {
    skip: !currentSkillGroup,
    variables: {
      characterId: character.id,
      skillGroupId: currentSkillGroup ? currentSkillGroup.id : '-1',
    },
    fetchPolicy: 'no-cache',
    onError: error => {
      enqueueSnackbar(`Getting group skills failed: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleSkillGroupClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, group: SkillGroup) => {
    setCurrentSkillGroup(group);
  };

  return (
    <Dialog open={open} maxWidth="lg" fullWidth={true}>
      <DialogTitle onClose={handleClose}>{character.name} Skills</DialogTitle>
      <DialogContent dividers>
        {(loading || skillGroupLoading) && <LinearProgress />}
        {data && data.character && (
          <div className={classes.root}>
            <GridList cellHeight={'auto'} className={classes.gridList} cols={4}>
              {data.character.skillGroups.map(group => (
                <li className="MuiGridListTile-root" key={group.id}>
                  <SkillGroupButton group={group} onClick={handleSkillGroupClick} />
                </li>
              ))}
            </GridList>
          </div>
        )}
        {skillGroupData && skillGroupData.character && skillGroupData.character.skillGroup && (
          <div className={classes.skillsWrapper}>
            <GridList cellHeight={'auto'} className={classes.gridList} cols={2}>
              {skillGroupData.character.skillGroup.skills.map(skill => (
                <li className="MuiGridListTile-root" key={skill.id}>
                  <SkillProgress trainedLevel={skill.trainedSkillLevel} injected={true} /> {skill.name}
                </li>
              ))}
            </GridList>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CharacterSkillsDialog;
