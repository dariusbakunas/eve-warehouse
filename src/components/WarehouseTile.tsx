import { makeStyles, Theme } from '@material-ui/core';
import { GetWarehouses_warehouses as Warehouse } from '../__generated__/GetWarehouses';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import React from 'react';

const useStyles = makeStyles<Theme>(theme => ({
  card: {
    height: 'calc(100% - 5px)',
    width: 'calc(100% - 5px)',
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface IWarehouseTileProps {
  warehouse: Warehouse;
  onRemove: (id: string, name: string) => void;
}

const WarehouseTile: React.FC<IWarehouseTileProps> = ({ warehouse, onRemove }) => {
  const classes = useStyles();
  const { id, name } = warehouse;

  const handleRemove = () => {
    onRemove(id, name);
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        title={warehouse.name}
        action={
          <IconButton aria-label="settings" onClick={handleRemove}>
            <DeleteIcon />
          </IconButton>
        }
      />
      <CardContent>TODO</CardContent>
    </Card>
  );
};

export default WarehouseTile;
