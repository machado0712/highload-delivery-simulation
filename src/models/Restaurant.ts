import mongoose, { Document, Schema } from "mongoose";

export interface IRestaurant extends Document {
  address: string;
  name: string;
  products: Product[];
}

interface Product {
  name: string;
  price: number;
  productId: string;
}

const productSchema = new Schema<Product>({
  name: { required: true, type: String },
  price: { required: true, type: Number },
  productId: { required: true, type: String }
});

const restaurantSchema = new Schema<IRestaurant>({
  address: { required: true, type: String },
  name: { required: true, type: String },
  products: [productSchema]
});

export default mongoose.model<IRestaurant>("Restaurant", restaurantSchema);
