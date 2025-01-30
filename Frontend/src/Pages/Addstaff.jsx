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

export default function Addstaff() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  const handleUploadImage = () => {
    try {
      if (!file) {
        setImageUploadError("please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },

        (error) => {
          setImageUploadError("Image upload failed");
          console.error("Upload error:", error);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Failed to upload image");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/staff/add", {
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
        navigate(`/dashboard?tab=users`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create User</h1>

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

        <TextInput
          type="text"
          placeholder="Member Name"
          required
          id="Member Name"
          className="flex-1"
          onChange={(e) =>
            setFormData({ ...formData, Staffmembername: e.target.value })
          }
        />

        <TextInput
          type="text"
          placeholder="email"
          required
          id="User Name"
          className="flex-1"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <select
          id="departmentname"
          required
          className="flex-1 border border-gray-300 rounded-md p-2"
          value={formData.departmentname || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              departmentname: e.target.value,
            })
          }
        >
          <option value="" disabled>
            Select Department
          </option>
          <option value="IT">IT Department</option>
          <option value="HRM">HR Department</option>
          <option value="SALES">Sales Department</option>
          <option value="OPERATION">Operation Department</option>
          <option value="RESEARCH">Research Department</option>
        </select>

        <TextInput
          type="text"
          placeholder="contact Number"
          required
          id="contact"
          className="flex-1"
          onChange={(e) =>
            setFormData({ ...formData, contactNumber: e.target.value })
          }
        />

        <TextInput
          type="text"
          placeholder="position"
          required
          id="position"
          className="flex-1"
          onChange={(e) =>
            setFormData({ ...formData, position: e.target.value })
          }
        />
        <TextInput
          type="password"
          placeholder="password"
          required
          id="Password"
          className="flex-1"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <Button type="submit" className="bg-black text-white">
          Add
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
