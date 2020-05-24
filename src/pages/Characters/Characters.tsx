import { Button } from "carbon-components-react";
import { useNotification } from "../../components/Notifications/useNotifications";
import React from "react";

export const Characters: React.FC = () => {
  const { enqueueNotification } = useNotification();

  return (
    <div className="characters">
      characters
      <Button onClick={() => enqueueNotification("test message", null, { kind: "warning" })}>Test</Button>
    </div>
  );
};
