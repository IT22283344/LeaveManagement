import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [Staffmembers, setmembers] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [memberIDToDelete, setmemberIdToDelete] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([
    "SALES",
    "IT",
    "OPERATION",
    "RESEARCH",
    "HRM",
  ]);
  const [userIdToAssignManager, setUserIdToAssignManager] = useState("");
  const [userIdToResignManager, setUserIdToResignManager] = useState("");
  const [showAccessConfirmation, setShowAccessConfirmation] = useState(false);
  const [showAccessDeclaration, setShowAccessDeclaration] = useState(false);

  useEffect(() => {
    const fetchs = async () => {
      try {
        if (currentUser == null) {
          Navigate("/");
        }

        const res = await fetch("/api/staff/get");
        const data = await res.json();
        if (res.ok) {
          setmembers(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchs();
    }
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteProduct = async () => {
    setShowModel(false);
    try {
      const res = await fetch(`/api/staff/delete/${memberIDToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        window.location.href = "/dashboard?tab=staff";
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value); // Update the selected department
  };

  const handleAssignManager = async () => {
    try {
      const res = await fetch(
        `/api/staff/assignmanager/${userIdToAssignManager}`,
        {
          method: "PUT",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setmembers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userIdToAssignManager
              ? { ...user, isManager: true }
              : user
          )
        );
        setShowAccessConfirmation(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleResignManager = async () => {
    try {
      const res = await fetch(
        `/api/staff/resignmanager/${userIdToResignManager}`,
        {
          method: "PUT",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setmembers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userIdToResignManager
              ? { ...user, isManager: false }
              : user
          )
        );
        setShowAccessDeclaration(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search members.."
          value={searchTerm}
          onChange={handleSearch}
          className="px-3 py-2 w-1/2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:bg-slate-800 placeholder-gray-500"
        />
      </div>

      {/* Radio Buttons */}
      <div className="flex justify-left items-center gap-4 mb-6 border border-gray-200 rounded-lg">
        <label className="flex items-center p-3 ">
          <input
            type="radio"
            value=""
            checked={selectedDepartment === ""}
            onChange={handleDepartmentChange}
            className="mr-2"
          />
          All
        </label>

        {/*Department wise filtering*/}
        {departments.map((department) => (
          <label key={department} className="flex items-center">
            <input
              type="radio"
              value={department}
              checked={selectedDepartment === department}
              onChange={handleDepartmentChange}
              className="mr-2"
            />
            {department}
          </label>
        ))}
      </div>

      {/* Staff Table */}
      {currentUser.isAdmin && Staffmembers.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Employee ID</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Department</Table.HeadCell>
            <Table.HeadCell>Contact Number</Table.HeadCell>
            <Table.HeadCell>Position</Table.HeadCell>
            <Table.HeadCell>Manager Privilege</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Send Mail</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
          </Table.Head>
          {Staffmembers.filter((member) => {
            return (
              (searchTerm === "" ||
                member.Staffmembername.toLowerCase().includes(
                  searchTerm.toLowerCase()
                ) ||
                member.employeeId) &&
              (selectedDepartment === "" ||
                member.departmentname === selectedDepartment)
            );
          }).map((member) => (
            <Table.Body className="divide-y" key={member._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{member.employeeId}</Table.Cell>
                <Table.Cell>{member.Staffmembername}</Table.Cell>
                <Table.Cell>{member.email}</Table.Cell>
                <Table.Cell>{member.departmentname}</Table.Cell>
                <Table.Cell>{member.contactNumber}</Table.Cell>
                <Table.Cell>
                  {member.isManager ? (
                    <span className="font-semibold text-lg text-black">Manager</span>
                  ) : (
                    member.position
                  )}{" "}
                </Table.Cell>
                {currentUser.isAdmin && (
                  <Table.Cell>
                    <span
                      onClick={() => {
                        if (!member.isManager) {
                          setShowAccessConfirmation(true);
                          setUserIdToAssignManager(member._id);
                        }
                      }}
                      className={`font-medium text-blue-600 hover:underline cursor-pointer mr-5 ${
                        member.isManager ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={member.isManager}
                    >
                      Assign
                    </span>

                    <span
                      onClick={() => {
                        if (member.isManager) {
                          setShowAccessDeclaration(true);
                          setUserIdToResignManager(member._id);
                        }
                      }}
                      className={`font-medium text-red-500 hover:underline cursor-pointer mr-5 ${
                        !member.isManager ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!member.isManager}
                    >
                      Resign
                    </span>
                  </Table.Cell>
                )}

                <Table.Cell>
                  <span
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setShowModel(true);
                      setmemberIdToDelete(member._id);
                    }}
                  >
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    className="text-teal-500 hover:underline"
                    to={`/dashboard?tab=sendemail&email=${member.username}`}
                  >
                    Send Mail
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    className="text-teal-500 hover:underline"
                    to={`/updatestaff/${member._id}`}
                  >
                    Edit
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      ) : (
        <p className="text-center text-gray-500">
          You have no staff members to show
        </p>
      )}

      {/* Confirmation Modal */}
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
              Are you sure you want to delete this member?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteProduct}>
              Yes, I am sure
            </Button>
            <Button color="gray" onClick={() => setShowModel(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showAccessConfirmation}
        onClose={() => setShowAccessConfirmation(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to give access?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="success" onClick={handleAssignManager}>
                Yes, give access
              </Button>
              <Button
                color="gray"
                onClick={() => setShowAccessConfirmation(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showAccessDeclaration}
        onClose={() => setShowAccessDeclaration(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to remove access?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleResignManager}>
                Yes, remove access
              </Button>
              <Button
                color="gray"
                onClick={() => setShowAccessDeclaration(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
