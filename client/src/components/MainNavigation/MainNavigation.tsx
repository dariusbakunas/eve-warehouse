import {
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenu,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  SideNav,
  SideNavItems,
  SideNavMenu,
  SideNavMenuItem,
} from 'carbon-components-react';
import { Link } from '../Link/Link';
import { Logout20 } from '@carbon/icons-react';
import { useLocation } from 'react-router-dom';
import React, { useCallback, useMemo, useState } from 'react';

const DEV = process.env.NODE_ENV === 'development';

interface INavigationItem {
  name: string;
  url?: string;
  active?: boolean;
  links?: Array<{
    name: string;
    url: string;
    active?: boolean;
  }>;
}

export const MainNavigation: React.FC = () => {
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);
  const location = useLocation();

  const navigationItems: INavigationItem[] = useMemo(() => {
    const items = [
      {
        name: 'Characters',
        url: '/characters',
      },
      {
        name: 'Tools',
        links: [
          { name: 'Wallet', url: '/wallet' },
          { name: 'Warehouse', url: '/warehouse' },
        ],
      },
      {
        name: 'Other',
        links: [{ name: 'API Logs', url: '/api-logs' }],
      },
    ];

    return items.map((item) => {
      if (item.url) {
        return {
          ...item,
          active: item.url === location.pathname,
        };
      } else {
        const links = item.links?.map((link) => {
          return {
            ...link,
            active: link.url === location.pathname,
          };
        });

        return {
          ...item,
          active: !!links?.find((link) => link.active),
          links,
        };
      }
    });
  }, [location]);

  const logout = useCallback(() => {
    window.location.href = DEV ? 'http://localhost:3001/auth/logout' : '/auth/logout';
  }, []);

  const handleMenuButtonClick = () => {
    setIsSideNavExpanded((expanded) => !expanded);
  };

  return (
    <Header aria-label="Eve Warehouse">
      <HeaderMenuButton aria-label="Open menu" onClick={handleMenuButtonClick} isActive={isSideNavExpanded} />
      <HeaderName href="#" prefix="EVE">
        Warehouse
      </HeaderName>
      <HeaderNavigation aria-label="Navigation">
        {navigationItems.map((menu) => {
          if (menu.links) {
            return (
              <HeaderMenu aria-label={menu.name} menuLinkName={menu.name} key={menu.name}>
                {menu.links.map((link) => (
                  <HeaderMenuItem href={link.url} key={link.name} element={Link} isCurrentPage={link.active}>
                    {link.name}
                  </HeaderMenuItem>
                ))}
              </HeaderMenu>
            );
          } else {
            return (
              <HeaderMenuItem href={menu.url} key={menu.name} element={Link} isCurrentPage={menu.active}>
                {menu.name}
              </HeaderMenuItem>
            );
          }
        })}
      </HeaderNavigation>
      <HeaderGlobalBar>
        <HeaderGlobalAction aria-label="Logout" onClick={logout}>
          <Logout20 />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
      <SideNav isFixedNav={true} aria-label="Side navigation" isRail expanded={isSideNavExpanded}>
        <SideNavItems>
          {navigationItems.map((menu) => {
            if (menu.links) {
              return (
                <SideNavMenu title={menu.name} key={menu.name} isActive={menu.active}>
                  {menu.links.map((link) => (
                    <SideNavMenuItem href={link.url} key={link.name} element={Link} isActive={link.active}>
                      {link.name}
                    </SideNavMenuItem>
                  ))}
                </SideNavMenu>
              );
            } else {
              return (
                <SideNavMenuItem href={menu.url} key={menu.name} element={Link} isActive={menu.active}>
                  {menu.name}
                </SideNavMenuItem>
              );
            }
          })}
        </SideNavItems>
      </SideNav>
    </Header>
  );
};
