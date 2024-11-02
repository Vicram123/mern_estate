import express from "express";
import { google, signin, signOut } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/signout", signOut);
router.post("/signin", signin);
router.post("/google", google);
export default router;
