"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { Item } from "./items";

export const List = () => {
  const { userMemberships }: any = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (userMemberships?.data?.length === 0) {
    return null;
  }
  return (
    <div>
      <ul>
        {userMemberships?.data?.map((membership: any) => (
          <li key={membership.organization.id}>
            <Item
              key={membership.organization.id}
              id={membership.organization.id}
              name={membership.organization.name}
              imageUrl={membership.organization.imageUrl}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
