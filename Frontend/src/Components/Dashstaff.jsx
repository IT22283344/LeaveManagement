import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Dashstaff() {
    const { currentUser } = useSelector((state) => state.user);
    const [Staffmembers, setmembers] = useState([]);
    
    const [showModel , setShowModel] = useState(false);
    const [memberIDToDelete, setmemberIdToDelete] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStaffType, setSelectedStaffType] = useState('');  // New state for radio buttons
  
    useEffect(() => {
        const fetchs = async () => {
          try {
            const res = await fetch('/api/staff/get');
            const data = await res.json();
            if (res.ok) {
              setmembers(data);
              console.log(data)
             
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
          const res = await fetch(
            `/api/staff/delete/${memberIDToDelete}`,
            {
              method: 'DELETE',
            }
          );
          const data = await res.json();
          window.location.href="/dashboard?tab=staff"
          if (!res.ok) {
            console.log(data.message); 
          } 
        } catch (error) {
          console.log(error.message);
        }
      };

      const handleStaffTypeChange = (e) => {
        setSelectedStaffType(e.target.value);  // Update the selected staff type when a radio button is clicked
      };
      

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
    
      <input
          type="text"
          placeholder="Search members.."
          value={searchTerm}
          onChange={handleSearch}
          className="px-3 py-2 w-150 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mr-2 h-10 dark:bg-slate-800 placeholder-gray-500"
          style={{marginLeft:"30%",width:"40%",marginBottom:"30px"}}
      />

      {/* Radio buttons for selecting staff type */}
      <div className="flex justify-center mb-4">
      <label className="mr-4">
          <input
            type="radio"
            value=""
            checked={selectedStaffType === ""}
            onChange={handleStaffTypeChange}
            className="mr-2"
          />
          All
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="Administrative staff"
            checked={selectedStaffType === "Administrative staff"}
            onChange={handleStaffTypeChange}
            className="mr-2"
          />
          Administrative
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="cleaning staff"
            checked={selectedStaffType === "cleaning staff"}
            onChange={handleStaffTypeChange}
            className="mr-2"
          />
          cleaning staff
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="Security staff"
            checked={selectedStaffType === "Security staff"}
            onChange={handleStaffTypeChange}
            className="mr-2"
          />
          Security staff
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="Technical staff"
            checked={selectedStaffType === "Technical staff"}
            onChange={handleStaffTypeChange}
            className="mr-2"
          />
          Technical staff
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="Laundary staff"
            checked={selectedStaffType === "Laundary staff"}
            onChange={handleStaffTypeChange}
            className="mr-2"
          />
          Laundary staff
        </label>
        
        {/* Add more staff types here if needed */}
      </div>

      {currentUser.isAdmin && Staffmembers.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Age</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Phone number</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              <Table.HeadCell>Staff type</Table.HeadCell>
              <Table.HeadCell>Salary</Table.HeadCell>
              <Table.HeadCell>Task</Table.HeadCell>
          
              <Table.HeadCell>Assign task</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {Staffmembers
              .filter((members) => {
                // Filter based on search term and selected staff type
                return (
                  (searchTerm === '' || members.Staffmembername.toLowerCase().includes(searchTerm.toLowerCase())) &&
                  (selectedStaffType === '' || members.stafftype === selectedStaffType)
                );
              })
              .map((members) => (
                <Table.Body className="divide-y" key={members._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{members.Staffmembername}</Table.Cell>
                    <Table.Cell>
                      <img
                        src={members.Picture}
                        alt={members.Staffmembername}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{members.Age}</Table.Cell>
                    <Table.Cell>{members.email}</Table.Cell>
                    <Table.Cell>{members.phonenumber}</Table.Cell>
                    <Table.Cell>{members.address}</Table.Cell>
                    <Table.Cell>{members.stafftype}</Table.Cell>
                    <Table.Cell>{members.salary}</Table.Cell>
                    <Table.Cell>{members.task}</Table.Cell>
                    <Table.Cell>
                      <Link className="text-teal-500 hover:underline" to={`/updatestaff/${members._id}`}>
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                        onClick={() => {
                          setShowModel(true);
                          setmemberIdToDelete(members._id);
                        }}
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className="text-teal-500 hover:underline" to={`/taskassign/${members._id}`}>
                        <span>Assign </span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </>
      ) : (
        <p>You have no staff members to show</p>
      )}

      {/* Confirmation modal for deleting a member */}
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">Are you sure you want to delete this member?</h3>
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
    </div>
  );
}
