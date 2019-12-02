import React, { useCallback } from 'react';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { GetCharacterSkills_character_skillGroups as SkillGroup } from '../__generated__/GetCharacterSkills';

interface ISkillGroupButtonProps {
  selected?: boolean;
  group: SkillGroup;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, group: SkillGroup) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      fontWeight: (props: Partial<ISkillGroupButtonProps>) => {
        return props.selected ? 'bold' : 'normal';
      },
    },
  })
);

const SkillGroupButton: React.FC<ISkillGroupButtonProps> = ({ group, onClick, selected }) => {
  const classes = useStyles({ selected });

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (onClick) {
        onClick(event, group);
      }
    },
    [group, onClick]
  );

  return (
    <ButtonBase focusRipple onClick={handleClick}>
      <span>
        <Typography component="span" variant="subtitle1" color="inherit" className={classes.label}>
          {group.name}
        </Typography>
      </span>
    </ButtonBase>
  );
};

export default SkillGroupButton;
