import { FC, ReactNode, useEffect, useState } from "react";

const ClientOnly: FC<{ children: ReactNode }> = ({ children}) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}

export default ClientOnly;