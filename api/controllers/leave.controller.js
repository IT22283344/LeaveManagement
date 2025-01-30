import Leaveform from "../models/Leaveform.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Staff from "../models/staff.model.js";

export const addleaveform = async (req, res, next) => {
  const {
    employeeId,
    leaveType,
    startDate,
    endDate,
    reason,
    status,
    address,
    contactno,
  } = req.body;

  try {
    // Find the staff member using the employeeId
    const staff = await Staff.findOne({ employeeId });
    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Create the leave form using the staff's ID
    const newLeaveForm = new Leaveform({
      leaveId: staff._id, // Associate the leave form with the staff member's ID
      employeeId,
      staffmembername: staff.Staffmembername, // Use staff's name from the database
      email: staff.email, // Use staff's email from the database
      leaveType,
      departmentname: staff.departmentname,
      startDate,
      endDate,
      reason,
      status,
      address,
      contactno,
    });

    const savedLeaveForm = await newLeaveForm.save();
    res.status(201).json(savedLeaveForm);
  } catch (error) {
    next(error);
  }
};

//Get leave forms to user dashboard
export const GetLeaveform = async (req, res, next) => {
  try {
    const { searchTerm, employeeId, leaveType } = req.query;
    const queryOptions = {};

    if (searchTerm) {
      queryOptions.leaveType = { $regex: searchTerm, $options: "i" };
    }
    if (employeeId) {
      queryOptions.employeeId = employeeId;
    }
    if (leaveType) {
      queryOptions.leaveType = leaveType;
    }

    const leaveForms = await Leaveform.find(queryOptions);
    res.json({ leave: leaveForms || [] }); // Always send an empty array if no leave forms found
  } catch (error) {
    next(error);
  }
};



export const updateLeaveform = async (req, res, next) => {
  const {
    employeeId,
    leaveType,
    startDate,
    endDate,
    reason,
    status,
    address,
    contactno,
  } = req.body;

  try {
    // Find the staff member using the employeeId
    const staff = await Staff.findOne({ employeeId });
    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Update the leave form using the staff's ID
    const updatedLeaveForm = await Leaveform.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          leaveId: staff._id, // Update the association to the correct staff ID
          employeeId,
          staffmembername: staff.Staffmembername,
          email: staff.email,
          departmentname: staff.departmentname,
          leaveType,
          startDate,
          endDate,
          reason,
          status,
          address,
          contactno,
        },
      },
      { new: true }
    );

    if (!updatedLeaveForm) {
      return res.status(404).json({ error: "Leave form not found" });
    }

    res.status(200).json(updatedLeaveForm);
  } catch (error) {
    next(error);
  }
};

export const deleteLeaverequest = async (req, res, next) => {
  try {
  

    // Find and delete the leave request by ID
    const leaveRequest = await Leaveform.findByIdAndDelete(req.params.id);

    // Check if the leave request exists
    if (!leaveRequest) {
      return res.status(404).json("Leave request not found");
    }

    res.status(200).json("The leave request has been deleted successfully.");
  } catch (error) {
    next(error);
  }
};


export const updateleaveform = async (req, res, next) => {
  const { _id } = req.params; // Extract the ID from request parameters
  const { status } = req.body; // Extract the new status from the request body

  try {
    // Validate input
    if (!_id || !status) {
      return res.status(400).json({ message: "Invalid request: _id and status are required" });
    }

    // Find and update the leave request by ID
    const leaveRequest = await Leaveform.findByIdAndUpdate(
      _id,
      { status },
      { new: true } // Ensures the updated document is returned
    );

    // Check if the leave request exists
    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Respond with the updated leave request
    res.status(200).json({
      message: "Leave status updated successfully",
      leaveRequest,
    });
  } catch (error) {
    // Handle and log errors
    console.error("Error updating leave status:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
