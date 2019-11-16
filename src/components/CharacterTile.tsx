import React from 'react';
import { CardContent, makeStyles, Theme } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { GetCharacters_characters as Character } from '../__generated__/GetCharacters';

const useStyles = makeStyles<Theme>(theme => ({
  card: {
    height: 'calc(100% - 5px)',
    width: 'calc(100% - 5px)',
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface CharacterTileProps {
  character: Character;
  onRemove: (id: string, name: string) => void;
  onUpdate: (character: Character) => void;
}

const CharacterTile: React.FC<CharacterTileProps> = ({ character, onRemove, onUpdate }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const classes = useStyles();
  const { id, name, birthday, corporation, securityStatus, totalSp } = character;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemove = () => {
    setAnchorEl(null);
    onRemove(id, name);
  };

  const handleUpdate = () => {
    setAnchorEl(null);
    onUpdate(character);
  };

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar} src={`https://image.eveonline.com/Character/${id}_128.jpg`}>
              {name[0]}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          }
          title={name}
          subheader={`Born: ${moment(birthday).format('YYYY-MM-DD LT')}`}
        />
        <CardContent>
          {corporation.alliance && (
            <div>
              <strong>Alliance:</strong> {corporation.alliance.name} [{corporation.alliance.ticker}]
            </div>
          )}
          <div>
            <strong>Corporation:</strong> {corporation.name} [{corporation.ticker}]
          </div>
          <div>
            <strong>Security status:</strong> {securityStatus.toFixed(2)}
          </div>
          {totalSp && (
            <div>
              <strong>Total SP:</strong> {totalSp.toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>
      <Menu
        id={`character-menu-${id}`}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        getContentAnchorEl={null}
        open={menuOpen}
        onClose={handleClose}
      >
        <MenuItem onClick={handleUpdate}>
          <Typography>Update Scopes</Typography>
        </MenuItem>
        <MenuItem onClick={handleRemove}>
          <Typography color="error">Remove</Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default CharacterTile;
