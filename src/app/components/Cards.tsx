import Image from "next/image";
const Cards = ({ type }: { type: string }) => {
  return (
    <div className=" rounded-2xl odd:bg-[#FFC1C1] even:bg-[#AEE2FF] p-4 flex-1">
      <div className=" flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2026/01/14
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold mt-2 mb-1">1,235</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}</h2>
    </div>
  );
};

export default Cards;
