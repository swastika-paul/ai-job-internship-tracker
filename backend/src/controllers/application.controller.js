
import Application from "../models/application.model.js";

export async function createApplication(req, res) {
  try {
    const {
      type,
      company,
      role,
      location,
      mode,
      salary,
      stipend,
      status,
      appliedDate,
      interviewDate,
      offerDate,
      startDate,
      endDate,
      deadline,
      jobUrl,
      notes,
    } = req.body;

    if (!type || !company?.trim() || !role?.trim()) {
      return res.status(400).json({
        message: "Type, company, and role are required.",
      });
    }

    if (!["Job", "Internship"].includes(type)) {
      return res.status(400).json({
        message: "Type must be Job or Internship.",
      });
    }

    const application = await Application.create({
      userId: req.user.id,
      type,
      company,
      role,
      location,
      mode,
      salary,
      stipend,
      status,
      appliedDate,
      interviewDate,
      offerDate,
      startDate,
      endDate,
      deadline,
      jobUrl,
      notes,
    });

    return res.status(201).json({
      message: `${type} added successfully.`,
      application,
    });
  } catch (error) {
    console.error("Create application error:", error.message);
    return res.status(500).json({
      message: "Failed to create application.",
    });
  }
}
export async function getApplications(req, res) {
  try {
    const applications = await Application.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ applications });
  } catch (error) {
    console.error("Get applications error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch applications.",
    });
  }
}

export async function deleteApplication(req, res) {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      message: "Application deleted successfully.",
    });
  } catch (error) {
    console.error("Delete application error:", error.message);
    return res.status(500).json({
      message: "Failed to delete application.",
    });
  }
}
