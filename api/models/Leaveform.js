import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  leaveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "staff",
    required: true,
  },
  staffmembername: {
    type: String, // Updated to String to store the staff's name
    required: true,
  },
  email: {
    type: String, // Updated to String to store the staff's email
    required: true,     
  },
  employeeId: {
    type: String,
    ref: "staff",
    required: true,
  },
  departmentname: { 
    type: String,
    ref: "staff",
  },
  leaveType: {
    type: String,
    enum: [
      "Vacation",
      "Sick",
      "Study",
      "Emergency",
      "Other",
    ],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  appliedOn: { type: Date, default: Date.now },
  approvalDate: { type: Date },
  comments: { type: String },
});

const Leaveform = mongoose.model("Leaveform", leaveSchema);
export default Leaveform;

