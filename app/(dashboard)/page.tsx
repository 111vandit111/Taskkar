"use client";

import { BoardList } from "./_components/board-list";
import { Empty } from "./_components/empty";
import { useOrganization } from "@clerk/nextjs";

interface DashboardHomePageProps {
    searchParams :{
        Search?: string;
        favourites?: string;
    }
}
const DashboardHomePage = ({searchParams}: DashboardHomePageProps) => {

    const { organization } = useOrganization();

    return (


        <div className=" h-[calc(100vh-95px)] p-6">
            {!organization ? (
                <Empty />
            ): (
                <BoardList orgId={organization.id} query={searchParams} />
            )}
        </div>
    );
};
export default DashboardHomePage;