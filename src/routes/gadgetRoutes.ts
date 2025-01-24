import { Router } from "express";
import {
  getGadgets,
  addGadget,
  updateGadget,
  deleteGadget,
  selfDestructGadget,
} from "../controllers/gadgetController";

const router = Router();

router.get("/gadgets", getGadgets);
router.post("/gadgets", addGadget);
router.patch("/gadgets/:id", updateGadget);
router.delete("/gadgets/:id", deleteGadget);
router.post("/gadgets/:id/self-destruct", selfDestructGadget);

export default router;
