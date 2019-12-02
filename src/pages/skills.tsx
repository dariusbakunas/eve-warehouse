import React, { ChangeEvent, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/core/SvgIcon/SvgIcon';
import Toolbar from '@material-ui/core/Toolbar';
import { useQuery } from '@apollo/react-hooks';
import getCharacterNames from '../queries/getCharacterNames.graphql';
import { GetCharacterNames, GetCharacterNames_characters as Character } from '../__generated__/GetCharacterNames';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Maybe from 'graphql/tsutils/Maybe';
import withApollo from '../lib/withApollo';
import getCharacterSkillsQuery from '../queries/getCharacterSkills.graphql';
import getSkillGroupSkillsQuery from '../queries/getSkillGroupSkills.graphql';
import {
  GetCharacterSkills,
  GetCharacterSkills_character_skillGroups as SkillGroup,
  GetCharacterSkillsVariables,
} from '../__generated__/GetCharacterSkills';
import { GetSkillGroupSkills, GetSkillGroupSkillsVariables } from '../__generated__/GetSkillGroupSkills';
import { useSnackbar } from 'notistack';
import LinearProgress from '@material-ui/core/LinearProgress';
import GridList from '@material-ui/core/GridList';
import SkillGroupButton from '../components/SkillGroupButton';
import SkillProgress from '../components/SkillProgress';

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
    skillGroupsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      overflowY: 'scroll',
      justifyContent: 'space-around',
      //backgroundColor: theme.palette.grey.A100,
      maxHeight: '300px',
      padding: theme.spacing(2),
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
      setCurrentCharacter(data.characters[0]);
    },
  });

  const { loading: skillGroupsLoading, data: skillGroupData } = useQuery<GetCharacterSkills, GetCharacterSkillsVariables>(getCharacterSkillsQuery, {
    skip: !currentCharacter,
    variables: {
      id: currentCharacter ? currentCharacter.id : '-1',
    },
    onCompleted: data => {
      if (data.character && !currentSkillGroup) {
        setCurrentSkillGroup(data.character.skillGroups[0]);
      }
    },
  });

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

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Toolbar className={classes.labelToolbar}>
          <Typography className={classes.title} variant="h6">
            Skills
          </Typography>
        </Toolbar>
        {(characterNamesLoading || skillGroupsLoading || skillGroupSkillsLoading) && <LinearProgress />}
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
                  <SkillGroupButton group={group} onClick={handleSkillGroupClick} selected={currentSkillGroup ? currentSkillGroup.id === group.id : false} />
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
      </Paper>
    </div>
  );
};

export default withApollo(Skills);
