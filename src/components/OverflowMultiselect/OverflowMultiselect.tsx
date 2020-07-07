import { Checkbox, OverflowMenu, OverflowMenuProps } from 'carbon-components-react';
import { Close32 } from '@carbon/icons-react';
import { isEqual } from 'lodash';
import { removeAtIndex } from '../../utils/removeAtIndex';
import clsx from 'clsx';
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift';
import ListBox from 'carbon-components-react/lib/components/ListBox';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
type ListBoxBaseItemType = object | string;

interface IOverflowMultiselectProps<Item extends ListBoxBaseItemType> {
  className?: React.HTMLAttributes<HTMLElement>['className'];
  flipped?: OverflowMenuProps['flipped'];
  id: NonNullable<React.HTMLAttributes<HTMLElement>['id']>;
  initialSelectedItems: Item[];
  items: Item[];
  itemToString: (item: Item | null) => string;
  onChange: ({ selectedItems }: { selectedItems: Item[] }) => void;
  renderIcon?: OverflowMenuProps['renderIcon'];
  showSelectionCount?: boolean;
}

export const OverflowMultiselect = <Item extends ListBoxBaseItemType>({
  className,
  flipped,
  id,
  initialSelectedItems,
  items,
  itemToString,
  onChange,
  renderIcon,
  showSelectionCount,
}: PropsWithChildren<IOverflowMultiselectProps<Item>>): React.ReactElement<PropsWithChildren<Item>> => {
  const [selectedItems, setSelectedItems] = useState<Item[]>(initialSelectedItems);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelectItem = useCallback(
    (item: Item) => {
      setSelectedItems((prevItems) => prevItems.concat(item));
    },
    [setSelectedItems]
  );

  const handleRemoveItem = useCallback(
    (index: number) => {
      setSelectedItems((prevItems) => removeAtIndex(prevItems, index));
    },
    [setSelectedItems]
  );

  const handleItemOnChange = useCallback(
    (item: Item | null) => {
      if (!item) {
        return;
      }

      const selectedItemIndex = selectedItems.findIndex((selectedItem) => isEqual(selectedItem, item));

      if (selectedItemIndex === -1) {
        handleSelectItem(item);
      } else {
        handleRemoveItem(selectedItemIndex);
      }
    },
    [selectedItems, handleSelectItem, handleRemoveItem]
  );

  const handleClearSelection = useCallback(() => {
    setSelectedItems([]);
  }, [setSelectedItems]);

  const handleMenuOpen = useCallback(() => {
    setMenuOpen(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    onChange({ selectedItems });
  }, [selectedItems, onChange]);

  const downshiftStateReducer = (state: DownshiftState<Item>, changes: StateChangeOptions<Item>) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          highlightedIndex: state.highlightedIndex,
          isOpen: true,
          inputValue: '',
        };
      default:
        return changes;
    }
  };

  const wrapperClasses = clsx(className, 'bx--multi-select__wrapper', 'bx--list-box__wrapper', 'overflow-multiselect');

  return (
    <div className={wrapperClasses}>
      {showSelectionCount && selectedItems.length > 0 && (
        <div role="button" className="bx--tag--filter bx--list-box__selection--multi">
          {selectedItems.length}
          <Close32 onClick={handleClearSelection} />
        </div>
      )}
      <OverflowMenu renderIcon={renderIcon} onOpen={handleMenuOpen} onClose={handleMenuClose} flipped={flipped}>
        <Downshift<Item>
          itemToString={itemToString}
          onChange={handleItemOnChange}
          stateReducer={downshiftStateReducer}
          selectedItem={null}
          isOpen={menuOpen}
        >
          {({ getRootProps, isOpen, itemToString, highlightedIndex, getItemProps }) => {
            const className = clsx('bx--multi-select', {
              'bx--multi-select--selected': selectedItems.length > 0,
            });

            return (
              <ListBox isOpen={isOpen} {...getRootProps({ refKey: 'innerRef' })} className={className}>
                <ListBox.Menu id={id}>
                  {items.map((item, index) => {
                    const itemProps = getItemProps({ item });
                    const text = itemToString(item);
                    const isChecked = selectedItems.findIndex((selectedItem) => isEqual(selectedItem, item)) !== -1;

                    return (
                      <ListBox.MenuItem key={itemProps.id} isActive={isChecked} {...itemProps} isHighlighted={highlightedIndex === index}>
                        <Checkbox id={`${itemProps.id}__checkbox`} labelText={text} readOnly={true} tabIndex={-1} name={text} checked={isChecked} />
                      </ListBox.MenuItem>
                    );
                  })}
                </ListBox.Menu>
              </ListBox>
            );
          }}
        </Downshift>
      </OverflowMenu>
    </div>
  );
};
