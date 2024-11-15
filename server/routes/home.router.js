// routes/exampleRouter.js
import express from "express";
import {
  enquiry_dataSchema,
  feedback_dataSchema,
} from "../validators/validators.js";
import db from "../database/db.js";
import { validate } from "../middlewares/validate-middleware.js";
import { enquiry_add, feedback_add } from "../controllers/home.controller.js";

const router = express.Router();

router.route("/feedback").post(validate(feedback_dataSchema), feedback_add);
router.route("/enquiry").post(validate(enquiry_dataSchema), enquiry_add);
export default router;
