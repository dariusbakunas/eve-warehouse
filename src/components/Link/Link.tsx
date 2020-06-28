import { LinkProps } from "carbon-components-react";
import { Link as RouterLink } from "react-router-dom";
import React, { forwardRef } from "react";

export const Link: React.FC<LinkProps> = forwardRef(({ className, href, children }, ref) => {
  return (
    <RouterLink
      to={href || "#"}
      className={className}
      // @ts-ignore
      innerRef={ref}
    >
      {children}
    </RouterLink>
  );
});

Link.displayName = "Link";
