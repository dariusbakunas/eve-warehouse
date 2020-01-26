import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const CharactersIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 90.23 83.13">
      <defs>
        <clipPath id="e7bcccdb-636a-4fdb-8da1-32930af12a10" transform="translate(-18.77 -19.77)">
          <rect width="128" height="128" style={{ fill: 'none' }} />
        </clipPath>
        <clipPath id="bbe6b726-bc3c-4de5-9a3c-dccda25ef384" transform="translate(-18.77 -19.77)">
          <rect x="18.77" y="19.77" width="48.81" height="72.53" style={{ fill: 'none' }} />
        </clipPath>
        <clipPath id="aef2e137-fe65-4894-8b7e-361eb75bd9cf" transform="translate(-18.77 -19.77)">
          <path
            d="M31.75,89l3.11-1.27c.15-.06,15.1-6.14,21-9,.65-.3,1.1-2.45,1-4.52a12.58,12.58,0,0,1-2.08-5.19c-.14-.94-.3-1.93-.43-2.8a7.52,7.52,0,0,1-2.12-3.06,25.94,25.94,0,0,1-1.42-4.92c-1.31-6.25-.18-8.66.95-10.06l.31-.35c0-4.1.89-11.08,5.53-16.31a18.35,18.35,0,0,1,9.92-5.67c-2.25-3.43-6.1-6.15-12.69-6.15C36.89,19.77,39.29,40,39.29,40c0,.5-.16.63-.36.63a2.34,2.34,0,0,1-.53-.15h-.07c-1.59,0-.92,4.3-.53,6.16A22,22,0,0,0,39,50.85a1.93,1.93,0,0,0,1.8,1.44H41s.44,2.9.84,5.44a7.46,7.46,0,0,0,2,4s1.27,8.59-3.74,11c-6.13,2.92-21.3,9.09-21.3,9.09V92.3h13Z"
            style={{ fill: 'none' }}
          />
        </clipPath>
        <linearGradient
          id="af5b27cc-394a-4cd6-be16-391003c6f031"
          x1="-339.58"
          y1="-136.63"
          x2="-338.58"
          y2="-136.63"
          gradientTransform="matrix(0, -72.53, -72.53, 0, -9885.32, -24556.97)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#666" />
          <stop offset="1" stopColor="#d5dfe6" />
        </linearGradient>
        <clipPath id="f084aa28-e9ff-4ef5-8b42-17fe28040505" transform="translate(-18.77 -19.77)">
          <path
            d="M57.26,50.64c0,.5-.16.63-.36.63a2.34,2.34,0,0,1-.53-.15h-.06c-1.6,0-.93,4.3-.53,6.16A20.61,20.61,0,0,0,57,61.45a1.92,1.92,0,0,0,1.79,1.44.76.76,0,0,0,.19,0s.45,2.9.84,5.44a7.41,7.41,0,0,0,2,4s1.28,8.6-3.74,11c-6.12,2.92-21.29,9.08-21.29,9.08v10.5H109V92.4s-15.17-6.16-21.3-9.08c-5-2.39-3.74-11-3.74-11a7.41,7.41,0,0,0,2-4c.4-2.54.84-5.44.84-5.44a.91.91,0,0,0,.2,0,1.92,1.92,0,0,0,1.79-1.44A22,22,0,0,0,90,57.28c.39-1.86,1.06-6.16-.53-6.16h-.07a2.34,2.34,0,0,1-.53.15c-.2,0-.37-.13-.36-.63,0,0,2.41-20.27-15.61-20.27S57.26,50.64,57.26,50.64"
            style={{ fill: 'none' }}
          />
        </clipPath>
        <linearGradient
          id="aa0182f2-0951-402f-b73b-d69384e25d70"
          x1="-339.58"
          y1="-136.63"
          x2="-338.58"
          y2="-136.63"
          gradientTransform="matrix(0, -72.53, -72.53, 0, -9855.63, -24546.37)"
          xlinkHref="#af5b27cc-394a-4cd6-be16-391003c6f031"
        />
      </defs>
      <g style={{ clipPath: 'url(#e7bcccdb-636a-4fdb-8da1-32930af12a10)' }}>
        <g style={{ clipPath: 'url(#e7bcccdb-636a-4fdb-8da1-32930af12a10)' }}>
          <g style={{ clipPath: 'url(#e7bcccdb-636a-4fdb-8da1-32930af12a10)' }}>
            <g style={{ opacity: 0.5 }}>
              <g
                style={{
                  clipPath: 'url(#bbe6b726-bc3c-4de5-9a3c-dccda25ef384)',
                }}
              >
                <g
                  style={{
                    clipPath: 'url(#aef2e137-fe65-4894-8b7e-361eb75bd9cf)',
                  }}
                >
                  <rect
                    width="48.81"
                    height="72.53"
                    style={{
                      fill: 'url(#af5b27cc-394a-4cd6-be16-391003c6f031)',
                    }}
                  />
                </g>
              </g>
            </g>
          </g>
          <g style={{ clipPath: 'url(#f084aa28-e9ff-4ef5-8b42-17fe28040505)' }}>
            <rect x="17.97" y="10.6" width="72.26" height="72.53" style={{ fill: 'url(#aa0182f2-0951-402f-b73b-d69384e25d70)' }} />
          </g>
        </g>
      </g>
    </SvgIcon>
  );
};

export default CharactersIcon;
