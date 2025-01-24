import { Request, Response } from "express";
import Gadget from "../models/gadgetModel";
import { v4 as uuidv4 } from "uuid";

const allowedStatuses = [
  "Available",
  "Deployed",
  "Destroyed",
  "Decommissioned",
] as const;
type Status = (typeof allowedStatuses)[number];

export const getGadgets = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { status } = req.query;

  if (
    status &&
    (typeof status !== "string" || !allowedStatuses.includes(status as Status))
  ) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  try {
    const gadgets = await Gadget.findAll({
      where: status ? { status: status as Status } : {},
    });

    const gadgetsWithProbability = gadgets.map((gadget) => ({
      ...gadget.toJSON(),
      missionSuccessProbability: `${
        Math.floor(Math.random() * 100) + 1
      }% success probability`,
    }));

    res.json(gadgetsWithProbability);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gadgets" });
  }
};

export const addGadget = async (req: Request, res: Response): Promise<void> => {
  const { description } = req.body;
  const codename = `Gadget-${uuidv4()}`;
  const newGadget = await Gadget.create({ codename, description });
  res.status(201).json(newGadget);
};

export const updateGadget = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { description } = req.body;
  const gadget = await Gadget.findByPk(id);
  if (gadget) {
    gadget.description = description;
    await gadget.save();
    res.json(gadget);
  } else {
    res.status(404).json({ error: "Gadget not found" });
  }
};

export const deleteGadget = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const gadget = await Gadget.findByPk(id);
  if (gadget) {
    gadget.status = "Decommissioned";
    gadget.decommissionedAt = new Date();
    await gadget.save();
    res.json(gadget);
  } else {
    res.status(404).json({ error: "Gadget not found" });
  }
};

export const selfDestructGadget = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { confirmationCode } = req.body;
  const gadget = await Gadget.findByPk(id);
  if (gadget) {
    const expectedConfirmationCode = "1234";
    if (confirmationCode === expectedConfirmationCode) {
      res.json({
        message: `Self-destruct sequence activated for gadget ${id}`,
      });
    } else {
      res.status(400).json({ error: "Invalid confirmation code" });
    }
  } else {
    res.status(404).json({ error: "Gadget not found" });
  }
};
