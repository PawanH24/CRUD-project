import StationaryModal from "@/app/components/StationaryModal";
import Image from "next/image";
import { IStationaryContainerProps } from "@/app/types/stationaryInterface";
import Link from "next/link";

const StationaryContainer = ({
  product,
  onUpdate,
  onDelete,
}: IStationaryContainerProps) => {
  const imageUrl = product.image?.trim() || "/placeholder.jpg";
  return (
    <div className="bg-white rounded-2xl border overflow-hidden max-w-[260px] w-full cursor-pointer hover:shadow-md transition">
      <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={product.title}
          width={208}
          height={192}
          className="object-contain p-2"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
          }}
        />

        <div
          className="absolute top-3 right-3 flex flex-col gap-2 z-5"
          onClick={(e) => e.stopPropagation()}
        >
          <StationaryModal type="update" data={product} onSubmit={onUpdate} />
          <StationaryModal type="delete" data={product} onDelete={onDelete} />
        </div>
      </div>

      <div className="p-4">
        <Link href={`/list/stationary/${product.id}`}>
          <h3 className="text-sm font-medium">{product.title}</h3>
        </Link>
        <p className="font-semibold">${product.price}</p>
      </div>
    </div>
  );
};

export default StationaryContainer;
