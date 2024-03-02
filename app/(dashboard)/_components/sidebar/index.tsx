import CreateNewOrganization from "./createOrganization";

const Sidebar = () => {
  return (
    <main className="fixed z-[1] left-0 bg-cyan-950 h-full flex p-3 flex-col gap-y-4 text-[#efefef]">
      <CreateNewOrganization />
    </main>
  );
};

export default Sidebar;
