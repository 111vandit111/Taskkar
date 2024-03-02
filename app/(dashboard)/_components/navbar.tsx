"use client";
import { OrganizationSwitcher, UserButton, useOrganization } from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { InviteUsers } from "./inviteMmbers";

const Navbar = () => {
  const { organization } = useOrganization();
  return (
    <div className="flex items-center gap-x-5 p-5">
      <div className="hidden md:flex flex-1">
        <SearchInput />
      </div>
      <div className="block flex-1 md:hidden">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                margin: "auto",
                maxWidth:"376px",
              },
              organizationSwitcherTrigger: {
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #e6e6e6",
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#f7f7f7",
              },
            },
          }}
        />
      </div>
      {organization ? <InviteUsers /> : null}
      <UserButton />
    </div>
  );
};

export default Navbar;
