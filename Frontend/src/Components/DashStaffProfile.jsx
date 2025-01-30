import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function DashStaffProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((state) => state.user);

  const [image, setImage] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  console.log(formData)

  // Image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);

  const uploadImage = () => {
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}_${image.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(progress.toFixed(0));
      },
      (error) => {
        setImageError("Failed to upload image. Ensure it is under 5MB.");
        setImagePercent(0);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageFileUrl(downloadURL);
          setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
        } catch (error) {
          setImageError("Error getting download URL.");
        }
      }
    );
  };

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/staff/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
console.log(formData)
      if (!data.success) {
        dispatch(updateUserFailure(data.message));
        setUpdateUserError(data.message);
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess("Profile updated successfully.");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateUserError("An error occurred while updating the profile.");
    }
  };

 /*  Account deletion
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/staff/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) {
        dispatch(deleteUserFailure());
        return;
      }

      dispatch(deleteUserSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };*/

  const handleSignOut = async () => {
    try {
      await fetch("/api/staff/signout");
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Staff Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imagePercent > 0 && imagePercent < 100 && (
            <CircularProgressbar
              value={imagePercent}
              text={`${imagePercent}%`}
              strokeWidth={5}
              className="absolute w-full h-full"
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="User Profile"
            className={`rounded-full w-full h-full border-8 border-lightgray ${
              imagePercent > 0 && imagePercent < 100 ? "opacity-60" : ""
            }`}
          />
        </div>

        {imageError && <Alert color="failure">{imageError}</Alert>}

        <TextInput
          type="text"
          id="staffmembername"
          disabled
          defaultValue={currentUser.Staffmembername}
        />
        <TextInput
          type="text"
          id="employeeId"
          disabled
          defaultValue={currentUser.employeeId}
        />
        <TextInput
          type="text"
          id="departmentname"
          disabled
          defaultValue={currentUser.departmentname}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          disabled
          defaultValue={currentUser.email}
        />

        <div className="relative">
          <TextInput
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            id="password"
            onChange={handleChange}

          />
           <button
                type="button"
                className="absolute top-2 right-3 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.5c5.185 0 9.448 4.014 9.95 9.048a.944.944 0 0 1 0 .904C21.448 16.486 17.185 20.5 12 20.5S2.552 16.486 2.05 13.452a.944.944 0 0 1 0-.904C2.552 8.514 6.815 4.5 12 4.5zM12 6a9 9 0 0 0-8.72 6.752.944.944 0 0 1 0 .496A9 9 0 0 0 12 18a9 9 0 0 0 8.72-4.752.944.944 0 0 1 0-.496A9 9 0 0 0 12 6z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 12.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 15a7 7 0 01-7-7M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </button>
        </div>

        <Button type="submit" outline className="bg-slate-400 text-black" disabled={loading}>
          {loading ? "Loading..." : "Update Account"}
        </Button>

        {currentUser.isAdmin && (
          <>
            <Link to="/addstaff">
              <Button className="w-full bg-slate-400 text-black">Create User</Button>
            </Link>
            <Link to="/addDepartment">
              <Button className="w-full bg-slate-400 text-black">Add Department</Button>
            </Link>
          </>
        )}
      </form>

      <div className="text-red-500 flex justify-end mt-5">
        {/*<span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>*/}
        <span onClick={handleSignOut} className="cursor-pointer ">
          Sign Out
        </span>
      </div>

      {updateSuccess && <Alert color="success" className="mt-5">{updateSuccess}</Alert>}
      {updateUserError && <Alert color="failure" className="mt-5">{updateUserError}</Alert>}

     {/* <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete your account?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteUser} className="bg-red-600">
              Yes, I'm sure
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)} className="bg-green-600">
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>*/}
    </div>
  );
}
