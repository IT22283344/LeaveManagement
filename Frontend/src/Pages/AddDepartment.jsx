import { Alert, Button, TextInput } from "flowbite-react";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddDepartment() {
  const navigate = useNavigate();
  const [departmentData, setDepartmentData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const handleAddDepartments = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/department/addDepartment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify(departmentData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/dashboard?tab=departments`);
      }
    } catch (error) {
      setPublishError("Something went wrong!");
      console.error(error);
    }
  };
  return (
    <div className=" p-1">
      <form className="flex flex-col gap-4" onSubmit={handleAddDepartments}>
        
      <TextInput
          type="text"
          placeholder="Departmentname"
          id="departmentname"
          className="flex-1"
          onChange={(e) =>
            setDepartmentData({ ...departmentData, departmentname: e.target.value })
          }
        />
       
        <TextInput
          type="text"
          placeholder="About"
          id="about"
          className="flex-1"
          onChange={(e) =>
            setDepartmentData({ ...departmentData, about: e.target.value })
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
