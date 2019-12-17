import { GetInvItems, GetInvItemsVariables } from '../__generated__/GetInvItems';
import { useQuery } from '@apollo/react-hooks';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import debounce from 'lodash.debounce';
import getInvItemsQuery from '../queries/getInvItems.graphql';
import match from 'autosuggest-highlight/match';
import Maybe from 'graphql/tsutils/Maybe';
import parse from 'autosuggest-highlight/parse';
import React, { useCallback, useMemo } from 'react';
import TextField from '@material-ui/core/TextField';

export interface InvItem {
  id: string;
  name: string;
  group: string;
}

interface IAutocompleteProps {
  error?: boolean;
  className?: string;
  onSelect: (item: Maybe<InvItem>) => void;
}

const InvItemAutocomplete: React.FC<IAutocompleteProps> = ({ className, error, onSelect }) => {
  const [open, setOpen] = React.useState(false);
  const [nameFilter, setNameFilter] = React.useState<Maybe<string>>(null);

  const { loading, data } = useQuery<GetInvItems, GetInvItemsVariables>(getInvItemsQuery, {
    skip: !nameFilter || nameFilter.length < 3,
    variables: {
      filter: {
        name: nameFilter,
      },
    },
  });

  const handleInputChange = useCallback(
    debounce((event: React.ChangeEvent<{}>, value: string) => {
      setNameFilter(value);
    }, 500),
    []
  );

  const options = useMemo(() => {
    if (data) {
      return data.invItems.map(item => ({
        id: item.id,
        name: item.name,
        group: item.invGroup.name,
      }));
    } else {
      return [];
    }
  }, [data]);

  const handleItemSelect = (event: React.ChangeEvent<{}>, value: Maybe<InvItem>) => {
    onSelect(value);
  };

  const classes = error ? { inputRoot: 'Mui-error' } : undefined;

  return (
    <Autocomplete
      id="item-autocomplete"
      className={className}
      classes={classes}
      getOptionLabel={option => option.name}
      groupBy={(option: InvItem) => option.group}
      loading={loading}
      options={options}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={handleItemSelect}
      onInputChange={handleInputChange}
      renderInput={params => (
        <TextField
          {...params}
          fullWidth
          label="Select Item"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(option, { inputValue }) => {
        const matches = match(option.name, inputValue);
        const parts = parse(option.name, matches);

        return (
          <div>
            {parts.map((part, index) => (
              <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                {part.text}
              </span>
            ))}
          </div>
        );
      }}
    />
  );
};

export default InvItemAutocomplete;
