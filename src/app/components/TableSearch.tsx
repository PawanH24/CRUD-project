import Image from "next/image";
const TableSearch = () => {
  return (
    <div className="">
      <div className="w-full md:w-auto flex md:flex items-center gap-2 text-xs rounded-full border border-gray-300 px-3 py-2 bg-white">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default TableSearch;
