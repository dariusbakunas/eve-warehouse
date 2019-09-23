import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    padding: 16,
    transition: "0.3s"
  },
  avatar: {
    width: 60,
    height: 60,
    transition: "0.3s"
  }
}));

interface ISideMenuHeaderProps {
  user?: {
    name: string;
    email: string;
    picture?: string;
  };
}

const SideMenuHeader: React.FC<ISideMenuHeaderProps> = ({ user }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Avatar className={classes.avatar} src={user && user.picture} />
        <div style={{ paddingBottom: 16 }} />
        <Typography variant={"h6"} noWrap>
          {user && user.name}
        </Typography>
        <Typography color={"textSecondary"} noWrap gutterBottom>
          {user && user.email}
        </Typography>
      </div>
      <Divider />
    </React.Fragment>
  );
};

export default SideMenuHeader;
