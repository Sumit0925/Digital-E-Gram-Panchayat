const express = require("express");
const {
  applyService,
  getMyApplications,
  getAssignedApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware(["user"]), applyService);
router.get("/my", authMiddleware, roleMiddleware(["user"]), getMyApplications);
router.get(
  "/assigned",
  authMiddleware,
  roleMiddleware(["staff", "officer"]),
  getAssignedApplications
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["staff", "officer"]),
  updateApplicationStatus
);
module.exports = router;
