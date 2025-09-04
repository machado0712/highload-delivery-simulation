/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from "supertest";

import app from "../src/app";
import "../tests/setup";

interface RestaurantResponse {
  _id: string;
  address: string;
  name: string;
  products: { name: string; price: number; productId: string }[];
}

describe("Restaurant API", () => {
  let restaurantId: string;

  it("should create a restaurant", async () => {
    const res = await request(app)
      .post("/restaurants")
      .send({
        address: "Rua XPTO, 1000",
        name: "Pizza da Esquina",
        products: [{ name: "Pizza Mussarela", price: 50, productId: "pizza-1" }],
      }) as request.Response;

    const body = res.body as RestaurantResponse;

    expect(res.status).toBe(201);
    expect(body._id).toBeDefined();
    restaurantId = body._id;
  });

  it("should get a restaurant by id", async () => {
    const res = await request(app).get(`/restaurants/${restaurantId}`);
    const body = res.body as RestaurantResponse;

    expect(res.status).toBe(200);
    expect(body.name).toBe("Pizza da Esquina");
  });
});
