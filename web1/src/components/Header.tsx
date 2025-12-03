'use client';

import Link from 'next/link';
import {
  TdsHeader,
  TdsHeaderHamburger,
  TdsHeaderTitle,
  TdsHeaderDropdown,
  TdsHeaderDropdownList,
  TdsBadge,
  TdsHeaderDropdownListItem,
  TdsHeaderDropdownListUser,
  TdsHeaderBrandSymbol,
  TdsIcon,
} from '@scania/tegel-react';


interface HeaderProps {
  className?: string;
  pathname?: string;
  toggleMobileNav?: () => void;
}

const Header = ({ className, toggleMobileNav, pathname = '/' }: HeaderProps) => {
  
  return (
    <div className={className}>
      <TdsHeader>
        {toggleMobileNav && (
          <TdsHeaderHamburger
            onClick={() => toggleMobileNav()}
            aria-label="Open application drawer"
            aria-haspopup="true"
            aria-expanded="false"
          ></TdsHeaderHamburger>
        )}

        <TdsHeaderTitle>React Demo</TdsHeaderTitle>

        <TdsHeaderDropdown>
          <span slot="label">Edit Structures</span>
          <TdsHeaderDropdownList>
            <TdsHeaderDropdownListItem selected={pathname === '/legal'}>
              <Link href="/legal">Operational Legal Structure</Link>
            </TdsHeaderDropdownListItem>
            <TdsHeaderDropdownListItem selected={pathname === '/operations'}>
              <Link href="/operations">Financial Operational Reporting Structure</Link>
            </TdsHeaderDropdownListItem>        
            <TdsHeaderDropdownListItem selected={pathname === '/business'}>
              <Link href="/business">Operational Business Structure</Link>
            </TdsHeaderDropdownListItem>           
            <TdsHeaderDropdownListItem selected={pathname === '/finance'}>
              <Link href="/finance">Financial Legal Reporting Structure</Link>
            </TdsHeaderDropdownListItem>           
          </TdsHeaderDropdownList>
        </TdsHeaderDropdown>

        <TdsHeaderDropdown onClick={() => {}} slot="end" no-dropdown-icon>
          <div slot="icon">
            <img
              src="https://www.svgrepo.com/show/384676/account-avatar-profile-user-6.svg"
              alt="User menu."
            />
          </div>
          <TdsHeaderDropdownList size="lg">
            <TdsHeaderDropdownListUser
              header="abeiuv"
              subheader="Anders Bergkvist"
            ></TdsHeaderDropdownListUser>
            <TdsHeaderDropdownListItem>
              <Link href="/settings">
                <TdsIcon name="settings"></TdsIcon>
                <div className="tds-u-pl1">Settings</div>
              </Link>
            </TdsHeaderDropdownListItem>
            <TdsHeaderDropdownListItem>
              <Link href="/notifications">
                <TdsBadge value="apa"></TdsBadge>
                <div className="tds-u-pl1">Notifications</div>
              </Link>
            </TdsHeaderDropdownListItem>
          </TdsHeaderDropdownList>
        </TdsHeaderDropdown>

        <TdsHeaderBrandSymbol slot="end">
          <a aria-label="Scania - red gryphon on blue shield" href="/"></a>
        </TdsHeaderBrandSymbol>
      </TdsHeader>
    </div>
  );
};

export default Header;