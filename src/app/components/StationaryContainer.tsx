import StationaryModal from "@/app/components/StationaryModal";
import Image from "next/image";

const StationaryContainer = ({ product, onUpdate, onDelete }: any) => {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden max-w-[260px]">
      <div className="relative h-48 bg-gray-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-2"
        />

        <div className="absolute top-3 right-3 flex gap-2 z-5">
          {/* Edit */}
          <StationaryModal type="update" data={product} onSubmit={onUpdate} />

          {/* Delete */}
          <StationaryModal type="delete" data={product} onDelete={onDelete} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium">{product.title}</h3>
        <p className="text-red-500 font-bold">${product.price}</p>
      </div>
    </div>
  );
};

export default StationaryContainer;
