import { GetCharacterNames } from "../../__generated__/GetCharacterNames";
import { loader } from "graphql.macro";
import { Loading } from "carbon-components-react";
import { useQuery } from "@apollo/react-hooks";
import React from "react";

const getCharacterNamesQuery = loader("../../queries/getCharacterNames.graphql");

export const ApiLogs: React.FC = () => {
  const { loading: characterNamesLoading, data: characterNamesData } = useQuery<GetCharacterNames>(getCharacterNamesQuery);

  const loading = characterNamesLoading;

  return (
    <div className="api-logs">
      {loading && <Loading description="Active loading indicator" withOverlay={true} />}
      logs
    </div>
  );
};
