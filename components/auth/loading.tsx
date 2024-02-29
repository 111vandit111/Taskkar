import Image from "next/image";

export const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Image
        src="/taskkarLogo.png"
        alt="loading"
        width={200}
        height={200}
        className="animate-pulse duration-1000"
      />
    </div>
  );
};
