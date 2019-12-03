import React, { useCallback } from 'react';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { GetCharacterSkillGroups_character_skillGroups as SkillGroup } from '../__generated__/GetCharacterSkillGroups';

interface ISkillGroupButtonProps {
  selected?: boolean;
  group: SkillGroup;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, group: SkillGroup) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      color: 'white',
      position: 'absolute',
      top: 0,
      left: 5,
    },
    root: {
      position: 'relative',
      height: '25px',
      overflow: 'hidden',
      minWidth: '200px',
      backgroundColor: theme.palette.primary.light,
    },
    progress: {
      transition: 'transform .4s linear',
      backgroundColor: ({ selected }: Partial<ISkillGroupButtonProps>) => {
        return selected ? theme.palette.primary.dark : theme.palette.primary.main;
      },
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '100%',
    },
  })
);

const SkillGroupButton: React.FC<ISkillGroupButtonProps> = ({ group, onClick, selected }) => {
  const classes = useStyles({ selected });

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (onClick) {
        const completed = group.trainedSp && group.totalSp ? (group.trainedSp / group.totalSp) * 100 : 0;
        console.log(completed);
        onClick(event, group);
      }
    },
    [group, onClick]
  );

  const completed = group && group.trainedSp && group.totalSp ? (group.trainedSp / group.totalSp) * 100 : 0;

  return (
    <ButtonBase focusRipple onClick={handleClick}>
      <div>
        <div className={classes.root}>
          <div className={classes.progress} style={{ transform: `translateX(${completed - 100}%)` }}/>
          <Typography component="span" variant="subtitle1" color="inherit" className={classes.label}>
            {group.name}
          </Typography>
        </div>
      </div>
    </ButtonBase>
  );
};

export default SkillGroupButton;
