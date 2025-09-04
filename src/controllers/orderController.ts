import { type Request, type Response } from "express";

import Order from "@/models/Order";

export async function createOrder(req: Request, res: Response) {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Erro desconhecido" });
    }
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Pedido não encontrado" });
    res.json(order);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Erro desconhecido" });
    }
  }
}
