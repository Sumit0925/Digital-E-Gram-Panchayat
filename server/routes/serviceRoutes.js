const express = require("express");
const {
  createService,
  getServices,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware(["officer"]), createService);
router.get("/", getServices);
router.put("/:id", authMiddleware, roleMiddleware(["officer"]), updateService);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["officer"]),
  deleteService
);

module.exports = router;
