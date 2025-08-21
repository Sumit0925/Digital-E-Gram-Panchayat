const Application = require("../models/Application");

//*    Apply for a service
//* @access  Private (user)
const applyService = async (req, res) => {
  try {
    const app = new Application({
      userId: req.user.id,
      serviceId: req.body.serviceId,
    });

    await app.save();

    return res.status(201).json({
      success: true,
      app: app,
    });
  } catch (err) {
    console.error("Error applying for service:", err.message);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

//*    Get logged-in user's applications
//* @access  Private (user)
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id }).populate(
      "serviceId",
      "title description fee"
    );

    return res.status(200).json({
      success: true,
      count: apps.length,
      apps: apps,
    });
  } catch (err) {
    console.error("Error fetching user applications:", err.message);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

//*    Staff/Officer: Get all applications
//* @access  Private (staff/officer)
const getAssignedApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("userId", "name email")
      .populate("serviceId", "title description");

    return res.status(200).json({
      success: true,
      count: apps.length,
      apps: apps,
    });
  } catch (err) {
    console.error("Error fetching all applications:", err.message);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

//*    Update application status
//* @access  Private (staff/officer)
const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const allowedStatuses = ["Pending", "Approved", "Rejected"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, msg: "Invalid status" });
  }

  try {
    let app = await Application.findById(id);
    if (!app) {
      return res
        .status(404)
        .json({ success: false, msg: "Application not found" });
    }

    app.status = status;
    app.updatedAt = new Date();

    await app.save();

    return res.status(200).json({
      success: true,
      app: app,
    });
  } catch (err) {
    console.error("Error updating application status:", err.message);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports = {
  applyService,
  getMyApplications,
  getAssignedApplications,
  updateApplicationStatus,
};
