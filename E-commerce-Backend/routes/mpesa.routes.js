import express from "express";
import { initiateSTKPush } from "../controllers/mpesaController.js";

const router = express.Router();

// Initiate the stk push
router.post("/stkpush", initiateSTKPush);

export default router;
