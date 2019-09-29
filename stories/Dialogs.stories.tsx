import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import CharacterScopeDialog from "../src/dialogs/CharacterScopeDialog";

const CharacterScopesDemo: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClose = (values: number[]) => {
    setOpen(false);
    console.log(values.join(","))
    action(values.join(","));
  };

  return (
    <React.Fragment>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <CharacterScopeDialog open={open} onClose={handleClose} />
    </React.Fragment>
  );
};

storiesOf("Dialogs|CharacterScopes", module).add("Default", () => <CharacterScopesDemo />);
