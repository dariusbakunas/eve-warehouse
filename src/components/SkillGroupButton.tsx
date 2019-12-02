import React, { useCallback } from 'react';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import { GetCharacterSkills_character_skillGroups as SkillGroup } from '../__generated__/GetCharacterSkills';

interface ISkillGroupButtonProps {
  group: SkillGroup;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, group: SkillGroup) => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({}));

const SkillGroupButton: React.FC<ISkillGroupButtonProps> = ({ group, onClick }) => {
  const classes = useStyles();

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
        <Typography component="span" variant="subtitle1" color="inherit">
          {group.name}
        </Typography>
      </span>
    </ButtonBase>
  );
};

export default SkillGroupButton;
