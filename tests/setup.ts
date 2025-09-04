import mongoose from "mongoose";

import Order from "@/models/Order";
import Restaurant from "@/models/Restaurant";


beforeAll(async () => {
  const uri = process.env.MONGO_TEST_URI ?? "mongodb://localhost:27017/delivery_test";
  await mongoose.connect(uri);
    await Restaurant.deleteMany({});
    await Order.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
