import React from "react";
import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

const CharactersIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 273 249">
      <defs>
        <linearGradient id="b603d4e4-7772-4740-8c94-5890341ed7c7" x1="162" y1="249" x2="162" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6f7071" />
          <stop offset="1" stopColor="#d1dbe2" />
        </linearGradient>
        <linearGradient id="a3dc32bc-2b62-4376-888e-601bb007b06d" x1="74.9" y1="221" x2="74.9" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b8b9b9" />
          <stop offset="1" stopColor="#e6ebed" />
        </linearGradient>
      </defs>
      <title>characters</title>
      <g id="bf7073c8-30bc-4861-bf39-376f526fb5db" data-name="Icon">
        <path
          d="M162.5,249H273V221s-75-21-75-58c0-35,6-33,6-33s2,3,7,0,10-43,3-41,5-61-52-61-45,63-52,61-2,38,3,41,7,0,7,0,6-2,6,33c0,37-75,58-75,58v28Z"
          fill="url(#b603d4e4-7772-4740-8c94-5890341ed7c7)"
        />
        <path
          d="M40.5,213l7.67-2.15a207.16,207.16,0,0,0,35.71-14.45c11.81-6.25,31.62-18.9,31.62-33.44,0-11-.63-17.61-1.24-21.4a19.83,19.83,0,0,1-6.66-2.6c-2.45-1.47-7.55-4.52-10.47-25.46-1.2-8.66-2-20.4.89-27.14a13.74,13.74,0,0,1,4.37-5.61c.13-.9.26-1.86.38-2.75,1.24-9.44,3.13-23.7,11-36.33,8.06-12.93,20.15-20.72,36-23.27C143.05,8.12,131.48,0,111,0,54,0,66,63,59,61s-2,38,3,41,7,0,7,0,6-2,6,33c0,37-75,58-75,58v28H40.5Z"
          fill="url(#a3dc32bc-2b62-4376-888e-601bb007b06d)"
        />
      </g>
    </SvgIcon>
  );
};

export default CharactersIcon;
