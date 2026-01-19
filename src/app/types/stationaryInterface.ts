import { StationaryFormData } from "./validationSchemas";

export interface IProduct {
  id?: number;
  title: string;
  price: number;
  image: string;
  description?: string;
}

export interface IStationaryContainerProps {
  product: IProduct;
  onUpdate: (updatedProduct: IProduct) => void;
  onDelete: (id: number) => void;
}

export interface IStationaryModalProps {
  type: "create" | "update" | "delete";
  data?: IProduct;
  onSubmit?: (product: IProduct) => void | Promise<void>;
  onDelete?: (id: number) => void | Promise<void>;
}

{
  /*error messages*/
}
export interface IFormErrors {
  title?: string;
  price?: string;
  image?: string;
}
