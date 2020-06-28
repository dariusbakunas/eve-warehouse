import { GetCharacters_characters as Character } from '../../__generated__/GetCharacters';
import { Checkbox, Form, FormGroup, Modal } from 'carbon-components-react';
import { createPortal } from 'react-dom';
import { EveScopes } from '../../constants';
import { Maybe } from '../../utilityTypes';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface ICharacterScopesDialog {
  onClose?: () => void;
  onSubmit?: (scopes: string[]) => void;
  character?: Maybe<Character>;
  open: boolean;
}

export const CharacterScopesDialog: React.FC<ICharacterScopesDialog> = ({ character, open, onClose, onSubmit }) => {
  const [currentSelection, setCurrentSelection] = useState<Set<string>>(new Set());

  const formGroups = [
    {
      name: 'Industry',
      items: [
        { id: 'chk-blueprints', functionality: 'View owned blueprints', scopes: [EveScopes.READ_CHARACTER_BLUEPRINTS] },
        { id: 'chk-industry-jobs', functionality: 'View industry jobs', scopes: [EveScopes.READ_CHARACTER_INDUSTRY_JOBS] },
      ],
    },
    {
      name: 'Wallet',
      items: [
        { id: 'chk-wallet-transactions', functionality: 'View wallet transactions', scopes: [EveScopes.READ_CHARACTER_WALLET] },
        { id: 'chk-market-orders', functionality: 'View market orders', scopes: [EveScopes.READ_CHARACTER_MARKET_ORDERS] },
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
    [currentSelection, onSubmit]
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
    if (character) {
      setCurrentSelection(new Set(character.scopes));
    } else {
      setCurrentSelection(new Set());
    }
  }, [character, setCurrentSelection]);

  return createPortal(
    <Modal
      modalAriaLabel={character ? `Update ${character.name}` : 'Add new character'}
      iconDescription="Close"
      modalHeading={character ? `Update ${character.name}` : 'Add new character'}
      open={open}
      hasForm={true}
      primaryButtonDisabled={currentSelection.size === 0}
      primaryButtonText="Submit"
      secondaryButtonText="Cancel"
      onRequestClose={onClose}
      onRequestSubmit={handleSubmit}
    >
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
    </Modal>,
    document.body
  );
};
