
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
