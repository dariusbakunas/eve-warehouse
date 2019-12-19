import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { GetCharacterSkillGroups_character_skillGroups as SkillGroup } from '../__generated__/GetCharacterSkillGroups';
import ButtonBase from '@material-ui/core/ButtonBase';
import NeuralEnchancementIcon from '../icons/NeuralEnhancementIcon';
import React, { useCallback } from 'react';
import ShipsIcon from '../icons/ShipsIcon';
import SkillsIcon from '../icons/SkillsIcon';
import Typography from '@material-ui/core/Typography';

interface ISkillGroupButtonProps {
  selected?: boolean;
  group: SkillGroup;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, group: SkillGroup) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      position: 'absolute',
      top: 0,
      left: 5,
    },
    root: {
      position: 'absolute',
      left: 30,
      top: 0,
      height: '25px',
      overflow: 'hidden',
      minWidth: '220px',
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

  const getSkillGroupIcon = (groupName: string) => {
    switch (groupName) {
      case 'Spaceship Command':
        return <ShipsIcon />;
      case 'Neural Enhancement':
        return <NeuralEnchancementIcon />;
      default:
        return <SkillsIcon />;
    }
  };

  return (
    <ButtonBase onClick={handleClick} disableRipple={false}>
      <div style={{ position: 'relative', height: '25px', width: '250px' }}>
        <span style={{ position: 'absolute', left: 0 }}>{getSkillGroupIcon(group.name)}</span>
        <div className={classes.root}>
          <Typography component="span" variant="subtitle1" color="inherit" className={classes.label}>
            {group.name}
          </Typography>
        </div>
      </div>
    </ButtonBase>
  );
};

export default SkillGroupButton;
