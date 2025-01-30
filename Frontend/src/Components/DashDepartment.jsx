import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiGift,
  HiOutlineExclamationCircle,
  HiOutlineHome,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";

export default function DashDepartment() {
  const { currentUser } = useSelector((state) => state.user);
  const [departments, setDepartments] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [departmentIdToDelete, setDepartmentIdToDelete] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`/api/department/getDepartments`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setDepartments(data.departments);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
  
    fetchDepartments();
  }, []); // Empty dependency array
  

  const handleDeleteDepartment = async () => {
    try {
      setShowModel(false); // Close the modal immediately

      console.log(`Attempting to delete leave ID: ${departmentIdToDelete}`);
      const res = await fetch(
        `/api/department/deletedepartment/${departmentIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error deleting departments:", errorData.message);
        alert(`Failed to delete departments: ${errorData.message}`); // Display an error message to the user
        return;
      }

      // If successful, update the local state
      setDepartments((prev) =>
        prev.filter((departments) => departments._id !== departmentIdToDelete)
      );
      console.log("Deleted Removed successfully!");

      // Reset `leaveIdToDelete` to prevent accidental reuse
      setDepartmentIdToDelete("");
    } catch (error) {
      console.error("Error during deletion:", error.message);
      alert(`An error occurred: ${error.message}`);
    }
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className=" flex gap-3 justify-start">
        {/* <div className="flex justify-between pb-4">
          <Link to="/dashboard?tab=bookings" key="bookings">
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              className="w-full , text-black bg-slate-400 "
              outline
            >
              Booking Requests
            </Button>
          </Link>
        </div>*/}
      </div>

      {/*<div className="flex-wrap flex gap-4 justify-start p-3">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Single Rooms
              </h3>
              <p className="text-2xl">{totalSingleRooms}</p>
            </div>
            <HiOutlineHome className="bg-lime-400 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Double Rooms
              </h3>
              <p className="text-2xl">{totalDoubleRooms}</p>
            </div>
            <HiOutlineHome className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Triple Rooms
              </h3>
              <p className="text-2xl">{totalTripleRooms}</p>
            </div>
            <HiOutlineHome className="bg-lime-800 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>
      </div>*/}
      {currentUser.isAdmin && departments.length > 0 ? (
        <>
          {departments.map((department) => (
            <div className="border border-gray-500 p-10">
              <div>{department.departmentname}</div>
              <div>{department.about}</div>
            </div>
          ))}
        </>
      ) : (
        <p>You have no leave requests to show!</p>
      )}
      {/* <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
              Are you sure you want to Delete this room
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteLeave}>
              Yes, I am sure
            </Button>
            <Button color="gray" onClick={() => setShowModel(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>*/}
    </div>
  );
}
