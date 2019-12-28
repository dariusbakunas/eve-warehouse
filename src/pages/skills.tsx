import { GetCharacterNames_characters as Character, GetCharacterNames } from '../__generated__/GetCharacterNames';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import {
  GetCharacterSkillGroups,
  GetCharacterSkillGroupsVariables,
  GetCharacterSkillGroups_character_skillGroups as SkillGroup,
} from '../__generated__/GetCharacterSkillGroups';
import { GetCharacterSkillQueue, GetCharacterSkillQueueVariables } from '../__generated__/GetCharacterSkillQueue';
import { GetSkillGroupSkills, GetSkillGroupSkillsVariables } from '../__generated__/GetSkillGroupSkills';
import { useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';
import FormControl from '@material-ui/core/FormControl';
import getCharacterNames from '../queries/getCharacterNames.graphql';
import getCharacterSkillGroupsQuery from '../queries/getCharacterSkillGroups.graphql';
import getCharacterSkillQueueQuery from '../queries/getCharacterSkillQueue.graphql';
import getSkillGroupSkillsQuery from '../queries/getSkillGroupSkills.graphql';
import GridList from '@material-ui/core/GridList';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Maybe from 'graphql/tsutils/Maybe';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import React, { ChangeEvent, useState } from 'react';
import Select from '@material-ui/core/Select';
import SkillGroupButton from '../components/SkillGroupButton';
import SkillProgress from '../components/SkillProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import withApollo from '../lib/withApollo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    gridList: {
      width: '100%',
    },
    labelToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    lvl: {
      color: 'rgb(0, 160, 193)',
      marginLeft: theme.spacing(1),
    },
    skillGroupsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      padding: theme.spacing(2),
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      overflowY: 'scroll',
      justifyContent: 'space-around',
      maxHeight: '400px',
      padding: theme.spacing(2),
      backgroundColor: '#dedede',
    },
    skillQueueContainer: {
      maxHeight: '400px',
      overflowY: 'scroll',
    },
    title: {
      flex: 1,
    },
    paper: {
      width: 'calc(100vw - 120px)',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  })
);

const Skills = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [currentCharacter, setCurrentCharacter] = useState<Maybe<Character>>(null);
  const [currentSkillGroup, setCurrentSkillGroup] = useState<Maybe<SkillGroup>>(null);

  const { loading: characterNamesLoading, data: characterNamesData } = useQuery<GetCharacterNames>(getCharacterNames, {
    onCompleted: data => {
      if (!currentCharacter) {
        setCurrentCharacter(data.characters[0]);
      }
    },
  });

  const { loading: skillQueueLoading, data: skillQueue } = useQuery<GetCharacterSkillQueue, GetCharacterSkillQueueVariables>(
    getCharacterSkillQueueQuery,
    {
      skip: !currentCharacter,
      variables: {
        id: currentCharacter ? currentCharacter.id : '-1',
      },
    }
  );

  const { loading: skillGroupsLoading, data: skillGroupData } = useQuery<GetCharacterSkillGroups, GetCharacterSkillGroupsVariables>(
    getCharacterSkillGroupsQuery,
    {
      skip: !currentCharacter,
      fetchPolicy: 'no-cache',
      variables: {
        id: currentCharacter ? currentCharacter.id : '-1',
      },
      onCompleted: data => {
        if (data.character && !currentSkillGroup) {
          setCurrentSkillGroup(data.character.skillGroups[0]);
        }
      },
    }
  );

  const { loading: skillGroupSkillsLoading, data: skillGroupSkillsData } = useQuery<GetSkillGroupSkills, GetSkillGroupSkillsVariables>(
    getSkillGroupSkillsQuery,
    {
      skip: !currentSkillGroup || !currentCharacter,
      variables: {
        characterId: currentCharacter ? currentCharacter.id : '-1',
        skillGroupId: currentSkillGroup ? currentSkillGroup.id : '-1',
      },
      fetchPolicy: 'no-cache',
      onError: error => {
        enqueueSnackbar(`Getting group skills failed: ${error.message}`, { variant: 'error', autoHideDuration: 5000 });
      },
    }
  );

  const handleCharacterChange = (event: ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;

    if (characterNamesData) {
      const character = characterNamesData.characters.find(character => character.id === value);
      setCurrentCharacter(character);
    }
  };

  const handleSkillGroupClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, group: SkillGroup) => {
    setCurrentSkillGroup(group);
  };

  const loading = characterNamesLoading || skillGroupsLoading || skillGroupSkillsLoading || skillQueueLoading;

  const lvl: { [key: number]: string } = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar className={classes.labelToolbar}>
          <Typography className={classes.title} variant="h6">
            Skills
          </Typography>
        </Toolbar>
        {loading && <LinearProgress />}
        {characterNamesData && currentCharacter && (
          <Toolbar className={classes.labelToolbar}>
            <FormControl>
              <InputLabel id="character-label">Character</InputLabel>
              <Select labelId="character-label" id="character-select" onChange={handleCharacterChange} value={currentCharacter.id}>
                {characterNamesData &&
                  characterNamesData.characters.map(character => (
                    <MenuItem key={character.id} value={character.id}>
                      {character.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Toolbar>
        )}
        {skillGroupData && skillGroupData.character && (
          <div className={classes.skillGroupsContainer}>
            <GridList cellHeight={'auto'} className={classes.gridList} cols={4}>
              {skillGroupData.character.skillGroups.map(group => (
                <li className="MuiGridListTile-root" key={group.id}>
                  <SkillGroupButton
                    group={group}
                    onClick={handleSkillGroupClick}
                    selected={currentSkillGroup ? currentSkillGroup.id === group.id : false}
                  />
                </li>
              ))}
            </GridList>
          </div>
        )}
        {skillGroupSkillsData && skillGroupSkillsData.character && skillGroupSkillsData.character.skillGroup && (
          <div className={classes.skillsContainer}>
            <GridList cellHeight={'auto'} className={classes.gridList} cols={2}>
              {skillGroupSkillsData.character.skillGroup.skills.map(skill => (
                <li className="MuiGridListTile-root" key={skill.id}>
                  <SkillProgress trainedLevel={skill.trainedSkillLevel} injected={skill.trainedSkillLevel != null} /> {skill.name}
                </li>
              ))}
            </GridList>
          </div>
        )}
        {skillQueue && skillQueue.character && skillQueue.character.skillQueue && (
          <div className={classes.skillQueueContainer}>
            <List dense>
              {skillQueue.character.skillQueue.map(item => (
                <ListItem key={item.position} button>
                  <div className="MuiListItemText-root MuiListItemText-dense">
                    <span className="MuiTypography-root MuiListItemText-primary MuiTypography-body2">
                      {item.position + 1}. {item.skill.name}
                    </span>
                    <span className={classes.lvl}>{lvl[item.finishedLevel]}</span>
                  </div>
                  <SkillProgress
                    startDate={item.startDate}
                    finishDate={item.finishDate}
                    trainedLevel={item.skill.trainedSkillLevel}
                    injected={item.skill.trainedSkillLevel != null}
                    queuedLevel={item.finishedLevel}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default withApollo(Skills);
