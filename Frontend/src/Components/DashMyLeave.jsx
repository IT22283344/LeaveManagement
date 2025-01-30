import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";

export default function DashMyLeave() {
  const { currentUser } = useSelector((state) => state.user);
  const [staffMyLeave, setStaffMyLeave] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [leaveIdToDelete, setLeaveIdToDelete] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  console.log(currentUser.email);

  useEffect(() => {
    if (!currentUser) return; // Ensure currentUser is loaded

    const fetchLeaveRequests = async () => {
      try {
        const res = await fetch(`/api/leave/getleaveform`);
        const data = await res.json();

        console.log("API Response:", data);

        const staffMyLeave = Array.isArray(data.leave)
          ? data.leave.filter((leave) => leave.email === currentUser.email)
          : [];

        console.log("Filtered Leave Requests:", staffMyLeave);

        setStaffMyLeave(staffMyLeave);
      } catch (error) {
        console.log("Error fetching leave requests:", error.message);
      }
    };

    fetchLeaveRequests();
  }, [currentUser]);

  const handleDeleteLeave = async () => {
    try {
      setShowModel(false); // Close the modal immediately
      const res = await fetch(
        `/api/leave/deleteLeaverequest/${leaveIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed to delete leave: ${errorData.message}`);
        return;
      }

      // Update state after deletion
      setStaffMyLeave((prev) =>
        prev.filter((leave) => leave._id !== leaveIdToDelete)
      );
      setLeaveIdToDelete("");
    } catch (error) {
      console.error("Error during deletion:", error.message);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStaffLeave = staffMyLeave.filter((leave) =>
    leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3">
      <div className="flex gap-3 justify-start">
        <div className="flex justify-between pb-4">
          <Link to="/leaveform/:id">
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              className="w-full , text-black bg-slate-400"
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
      </div>

      {staffMyLeave.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Added Date</Table.HeadCell>
              <Table.HeadCell>Employee ID</Table.HeadCell>
              <Table.HeadCell>Leave Type</Table.HeadCell>
              <Table.HeadCell>From</Table.HeadCell>
              <Table.HeadCell>To</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>View</Table.HeadCell>
            </Table.Head>
            {filteredStaffLeave.map((leave) => (
              <Table.Body className="divide-y" key={leave._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(leave.appliedOn).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{leave.employeeId}</Table.Cell>
                  <Table.Cell>{leave.leaveType}</Table.Cell>
                  <Table.Cell>
                    {new Date(leave.startDate).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(leave.endDate).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className={`font-semibold rounded-lg p-2 ${
                        leave.status === "Pending"
                          ? "bg-green-500 text-white" // Pending styling
                          : leave.status === "Approved"
                          ? "bg-blue-500 text-white" // Approved styling
                          : "bg-red-600 text-white" // Rejected styling
                      }`}
                    >
                      {leave.status }
                    </span>
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
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete this leave request?
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
                  className={`font-semibold rounded-lg p-2 ${
                    selectedLeave.status === "Pending"
                          ? " text-green-800" // Pending styling
                          : selectedLeave.status === "Approved"
                          ? " text-blue-600" // Approved styling
                          : " text-red-60000" // Rejected styling
                      }`}
                >
                  {selectedLeave.status }
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
