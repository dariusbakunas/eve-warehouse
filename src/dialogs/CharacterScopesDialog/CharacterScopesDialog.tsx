import { GetCharacters_characters as Character } from "../../__generated__/GetCharacters";
import { Checkbox, Form, FormGroup, Modal } from "carbon-components-react";
import { createPortal } from "react-dom";
import { EveScopes } from "../../constants";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface ICharacterScopesDialog {
  onClose?: () => void;
  onSubmit?: (scopes: string[]) => void;
  character: Character;
  open: boolean;
}

export const CharacterScopesDialog: React.FC<ICharacterScopesDialog> = ({ character, open, onClose, onSubmit }) => {
  const { scopes, name } = character;
  const [currentSelection, setCurrentSelection] = useState<Set<string>>();

  const formGroups = [
    {
      name: "Industry",
      items: [
        { id: "chk-blueprints", functionality: "View owned blueprints", scopes: [EveScopes.READ_CHARACTER_BLUEPRINTS] },
        { id: "chk-industry-jobs", functionality: "View industry jobs", scopes: [EveScopes.READ_CHARACTER_INDUSTRY_JOBS] },
      ],
    },
    {
      name: "Wallet",
      items: [
        { id: "chk-wallet-transactions", functionality: "View wallet transactions", scopes: [EveScopes.READ_CHARACTER_WALLET] },
        { id: "chk-market-orders", functionality: "View market orders", scopes: [EveScopes.READ_CHARACTER_MARKET_ORDERS] },
      ],
    },
  ];

  const scopeMap = useMemo(() => {
    return formGroups.reduce<{ [key: string]: string[] }>((acc, group) => {
      group.items.forEach((item) => (acc[item.id] = item.scopes));
      return acc;
    }, {});
  }, [formGroups]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (onSubmit && currentSelection) {
        onSubmit(Array.from(currentSelection));
      }
    },
    [character, currentSelection]
  );

  const handleChange = useCallback(
    (checked: boolean, id: string) => {
      setCurrentSelection((prevSelection) => {
        const newSelection = new Set(prevSelection);
        const scopes = scopeMap[id];
        scopes.forEach((scope) => (checked ? newSelection.add(scope) : newSelection.delete(scope)));
        return newSelection;
      });
    },
    [setCurrentSelection, scopeMap]
  );

  /**
   * Run only once to initialize initial selection
   */
  useEffect(() => {
    setCurrentSelection(new Set(scopes));
  }, [scopes, setCurrentSelection]);

  return createPortal(
    <Modal
      modalAriaLabel="Select character scopes"
      iconDescription="Close"
      modalHeading="Select character scopes"
      modalLabel={`Update ${name}`}
      open={open}
      hasForm={true}
      primaryButtonText="Submit"
      secondaryButtonText="Cancel"
      onRequestClose={onClose}
      onRequestSubmit={handleSubmit}
    >
      {currentSelection && (
        <Form onSubmit={handleSubmit}>
          {formGroups.map((group) => (
            <FormGroup legendText={group.name} key={group.name}>
              {group.items.map((item) => (
                <Checkbox
                  id={item.id}
                  checked={_.every(item.scopes, (scope) => currentSelection.has(scope))}
                  key={item.id}
                  indeterminate={false}
                  labelText={item.functionality}
                  onChange={handleChange}
                />
              ))}
            </FormGroup>
          ))}
        </Form>
      )}
    </Modal>,
    document.body
  );
};
