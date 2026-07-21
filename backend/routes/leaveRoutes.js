import express from "express";
import {
  createLeaveRequest,
  deleteMyLeaveRequest,
  getAllLeaveRequests,
  getMyLeaveRequests,
  updateLeaveStatus,
  updateMyLeaveRequest,
} from "../controllers/leaveController.js";
import protect from "../middleware/authMiddleware.js";
import managerOnly from "../middleware/managerMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createLeaveRequest);
router.get("/my-requests", getMyLeaveRequests);
router.put("/:id", updateMyLeaveRequest);
router.delete("/:id", deleteMyLeaveRequest);

router.get("/", managerOnly, getAllLeaveRequests);
router.patch("/:id/status", managerOnly, updateLeaveStatus);

export default router;