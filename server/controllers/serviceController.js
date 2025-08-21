const Service = require("../models/Service");

// @desc    Create a new service
// @access  Private (staff/officer)
const createService = async (req, res) => {
  try {
    const service = new Service({
      ...req.body,
      createdBy: req.user.id,
    });

    await service.save();

    return res.status(201).json({
      success: true,
      service: service,
    });
  } catch (err) {
    console.error("Error creating service:", err.message);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

//*    Get all services
//* @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find();

    return res.status(200).json({
      success: true,
      count: services.length,
      services: services,
    });
  } catch (err) {
    console.error("Error fetching services:", err.message);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

//*    Update a service by ID
//* @access  Private (staff/officer)
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ success: false, msg: "Service not found" });
    }

    return res.status(200).json({
      success: true,
      service: service,
    });
  } catch (err) {
    console.error("Error updating service:", err.message);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

//*  Delete a service by ID

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, msg: "Service not found" });
    }

    return res.status(200).json({ success: true, msg: "Service deleted" });
  } catch (err) {
    console.error("Error deleting service:", err.message);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports = {
  createService,
  getServices,
  updateService,
  deleteService,
};
