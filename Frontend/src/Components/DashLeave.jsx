import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiGift,
  HiOutlineExclamationCircle,
  HiOutlineHome,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

export default function DashLeave() {
  const { currentUser } = useSelector((state) => state.user);
  const [staffLeave, setStaffLeave] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [leaveIdToDelete, setLeaveIdToDelete] = useState("");
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate =useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const res = await fetch(
          `/api/leave/getleaveform?searchTerm=${searchTerm}`
        );
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setStaffLeave(data.leave);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchLeaveRequests();
  }, [searchTerm]); // Added dependency array to prevent infinite loop

  const handleDeleteLeave = async () => {
    try {
      setShowModel(false); // Close the modal immediately

      console.log(`Attempting to delete leave ID: ${leaveIdToDelete}`);
      const res = await fetch(
        `/api/leave/deleteLeaverequest/${leaveIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error deleting leave:", errorData.message);
        alert(`Failed to delete leave: ${errorData.message}`); // Display an error message to the user
        return;
      }

      // If successful, update the local state
      setStaffLeave((prev) =>
        prev.filter((leave) => leave._id !== leaveIdToDelete)
      );
      console.log("Deleted leave successfully!");

      // Reset `leaveIdToDelete` to prevent accidental reuse
      setLeaveIdToDelete("");
    } catch (error) {
      console.error("Error during deletion:", error.message);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const generatePDFReport = () => {
    const content = `
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
          font-size: 14px; /* Adjust font size */
        }
        td {
          font-size: 12px; /* Adjust font size */
        }
      </style>
      <h1><b>Daily Staff Leave Details Report</b></h1>
      
      
      <br>
      <br>
      <table>
        <thead>
          <tr>
            <th>Added Date</th>
            <th>EmployeeID</th>
            <th>Employee Name</th>
            <th>Email
            </th>
            <th>Leave Type</th>
            <th>StartDate</th>
            <th>EndDate</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${staffLeave
            .map(
              (leaves) => `
            <tr>
              <td>${new Date(leaves.appliedOn).toLocaleDateString()}</td>
              <td>${leaves.employeeId}</td>
              <td>${leaves.staffmembername}</td>
              <td>${leaves.email}</td>
              <td>${leaves.leaveType}</td>
              <td>${new Date(leaves.startDate).toLocaleDateString()}</td>
              <td>${new Date(leaves.endDate).toLocaleDateString()}</td>
              <td>${leaves.reason}</td>
              <td>${leaves.status}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    html2pdf()
      .from(content)
      .set({ margin: 1, filename: "Leave_Report.pdf" })
      .save();
  };

  const handleGenerateReport = () => {
    generatePDFReport();
  };

  const handleUpdateLeaveStatus = async (_id, newStatus) => {
    console.log(_id)
    try {
      const response = await fetch(`/api/leave/updateleaveform/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        const errorData = await response.text(); // In case the response is not JSON
        throw new Error(
          `Failed to update leave status. Status: ${response.status}, Message: ${errorData}`
        );
      }
  
      const data = await response.json();
      if (data) {
        alert(`Leave status updated to ${newStatus}`);
        // Optionally update the local state to reflect the changes
        setStaffLeave((prevLeaves) =>
          prevLeaves.map((leave) =>
            leave._id === _id ? { ...leave, status: newStatus } : leave
          )
        );
        setShowDetailsModal(false);
      } else {
        alert("Failed to update leave status");
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert(`Error updating leave status: ${error.message}`);
    }
  };
  

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className=" flex gap-3 justify-start">
        <div className="flex justify-between pb-4">
          <Link to="/leaveform/:id">
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              className="w-full , text-black bg-slate-400 "
              outline
            >
              Add Leave Request
            </Button>
          </Link>
        </div>
        
      </div>

      <div className="flex justify-between mb-7">
        <input
          type="text"
          placeholder="Search Leave Requests..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-3 py-2 w-150 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mr-2 h-10 dark:bg-slate-800 placeholder-gray-500"
        />
        <div></div>
        <Button
          gradientDuoTone="purpleToBlue"
          outline
          onClick={handleGenerateReport}
          className=""
        >
          Generate Report
        </Button>
      </div>


      {currentUser.isAdmin && staffLeave.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Added Date</Table.HeadCell>
              <Table.HeadCell>Employee ID</Table.HeadCell>
              <Table.HeadCell>Employee Name</Table.HeadCell>
              <Table.HeadCell>Department</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Leave Type</Table.HeadCell>
              <Table.HeadCell>From </Table.HeadCell>
              <Table.HeadCell>TO</Table.HeadCell>
              <Table.HeadCell>status</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>View</Table.HeadCell>
            </Table.Head>
            {staffLeave.map((leave) => (
              <Table.Body className="divide-y" key={leave._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(leave.appliedOn).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>{leave.employeeId} </Table.Cell>
                  <Table.Cell>{leave.staffmembername} </Table.Cell>
                  <Table.Cell>{leave.departmentname} </Table.Cell>
                  <Table.Cell>{leave.email} </Table.Cell>
                  <Table.Cell>{leave.leaveType}</Table.Cell>
                  <Table.Cell>
                    {new Date(leave.startDate).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(leave.endDate).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {staffLeave
                      .filter((leaveRequest) => leaveRequest._id === leave._id) // Filter leave request by matching IDs
                      .map((leaveRequest) => (
                        <span
                          key={leaveRequest._id}
                          className={`font-semibold rounded-lg p-2 ${
                            leaveRequest.status === "Pending"
                              ? "bg-green-500 text-white" // Pending styling
                              : leaveRequest.status === "Approved"
                              ? "bg-blue-500 text-white" // Approved styling
                              : "bg-red-600 text-white" // Rejected styling
                          }`}
                        >
                          {leaveRequest.status }
                        </span> //Need to implement status changing process
                      ))}
                  </Table.Cell>

                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModel(true);
                        setLeaveIdToDelete(leave._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-blue-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setSelectedLeave(leave);
                        setShowDetailsModal(true);
                      }}
                    >
                      View
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>You have no leave requests to show!</p>
      )}
      <Modal
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
      </Modal>

      <Modal
        show={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        popup
        size="lg"
      >
        <Modal.Header>
          <h3 className="text-xl font-bold text-purple-600 dark:text-purple-300">
            Leave Details
          </h3>
        </Modal.Header>
        <Modal.Body>
          {selectedLeave ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Employee ID:
                </span>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {selectedLeave.employeeId}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Employee Name:
                </span>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {selectedLeave.staffmembername}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Department:
                </span>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {selectedLeave.departmentname}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email:
                </span>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {selectedLeave.email}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Leave Type:
                </span>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                  {selectedLeave.leaveType}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Start Date:
                  </span>
                  <span className="text-lg font-semibold text-green-600 dark:text-green-300">
                    {new Date(selectedLeave.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    End Date:
                  </span>
                  <span className="text-lg font-semibold text-red-600 dark:text-red-300">
                    {new Date(selectedLeave.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Reason:
                </span>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {selectedLeave.reason}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`text-lg font-bold ${
                    selectedLeave.status
                      ? "text-yellow-600 dark:text-yellow-300"
                      : "text-green-600 dark:text-green-300"
                  }`}
                >
                  {selectedLeave.status}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Applied On:
                </span>
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {new Date(selectedLeave.appliedOn).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-row gap-3">
                <button
                  className="p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                  onClick={() =>
                    handleUpdateLeaveStatus(selectedLeave._id, "Approved")
                  }
                >
                  Approve
                </button>
                <button
                  className="p-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-800"
                  onClick={() =>
                    handleUpdateLeaveStatus(selectedLeave._id, "Rejected")
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-300">
              No details available.
            </p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
