import { Router } from "express";

import { createRestaurant, getRestaurantById } from "../controllers/restaurantController";

const router = Router();

router.post("/", createRestaurant);
router.get("/:id", getRestaurantById);

export default router;
