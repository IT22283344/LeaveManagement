import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import React from "react";
import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
} from "mdb-react-ui-kit";

export default function LeaveForm() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/leave/addleaveform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      console.log(formData);

      if (res.ok) {
        setPublishError(null);
        navigate(`/dashboard?tab=profile`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        {" "}
        Leave Request Form
      </h1>

      <form className="flex flex-col  gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="EmplyeeID"
          required
          id="employeeId"
          className="flex-1"
          onChange={(e) =>
            setFormData({ ...formData, employeeId: e.target.value })
          }
        />

        <select
          id="leaveType"
          required
          className="flex-1 border border-gray-300 rounded-md p-2"
          value={formData.leaveType || ""}
          onChange={(e) =>
            setFormData({ ...formData, leaveType: e.target.value })
          }
        >
          <option value="" disabled>
            Select Leave Type
          </option>
          <option value="Sick">Sick Leave</option>
          <option value="Vacation">Vacation Leave</option>
          <option value="Emergency">Emergency Leave</option>
          <option value="Other">Other</option>
        </select>

        <div className=" border border-gray-300 rounded-md p-2">
          <h5>Start Date</h5>
          <TextInput
            type="date"
            placeholder="Start Date"
            required
            min={new Date().toISOString().split("T")[0]} // Sets minimum date to today
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
        </div>
        <div className=" border border-gray-300 rounded-md p-2">
          <h5>End Date</h5>
          <TextInput
            type="date"
            placeholder="End Date"
            required
            min={new Date().toISOString().split("T")[0]} // Sets minimum date to today
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
        </div>

        <TextInput
          type="text"
          placeholder="Reason"
          required
          id="reason"
          className="flex-1"
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        />

        <TextInput
          type="text"
          placeholder="contact Number"
          required
          id="contactno"
          className="flex-1"
          onChange={(e) =>
            setFormData({ ...formData, contactno: e.target.value })
          }
        />

        <TextInput
          type="text"
          placeholder="address"
          required
          id="address"
          className="flex-1"
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />

        <Button type="submit" className="bg-black text-white">
          Request
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
