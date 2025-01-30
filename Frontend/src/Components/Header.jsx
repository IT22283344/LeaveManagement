import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar } from "flowbite-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiShoppingBag, HiUser, HiMenu } from 'react-icons/hi';
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import './Header.css'; // Import custom CSS for animations

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await fetch("/api/user/signout");
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar className="border-b-2 relative z-50 bg-gradient-to-r from-purple-400 to-purple-700 text-white p-8 rounded-b-lg shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-4">

        {/* Logo */}
        <div className="flex items-center">
          <NavLink to="/" className="self-center whitespace-nowrap text-3xl font-semibold font-tangerine text-white">


          </NavLink>
        </div>

        {/* Right Section: Navigation links and user controls */}
        <div className="flex items-center space-x-8">
          <div className="hidden md:flex space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? "nav-link-active" : "nav-link"
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/category" 
              className={({ isActive }) => 
                isActive ? "nav-link-active" : "nav-link"
              }
            >
              Category
            </NavLink>
            <NavLink 
              to="/product-page" 
              className={({ isActive }) => 
                isActive ? "nav-link-active" : "nav-link"
              }
            >
              Inventory
            </NavLink>
            {/*
            <NavLink 
              to="/room-page" 
              className={({ isActive }) => 
                isActive ? "nav-link-active" : "nav-link"
              }
            >
              Rooms
            </NavLink>*/}

            <NavLink 
              to="/posted-announcements" 
              className={({ isActive }) => 
                isActive ?"nav-link-active" : "nav-link"
              }
            >
              Announcements
            </NavLink>

            <NavLink 
              to="/support" 
              className={({ isActive }) => 
                isActive ? "nav-link-active" : "nav-link"
              }
            >
              Support
            </NavLink>

            {/*<NavLink 
              to="/become-supplier" 
              className={({ isActive }) => 
                isActive ? "nav-link-active" : "nav-link"
              }
            >
              Become Supplier
            </NavLink>*/}  
          </div>

          {/* User controls */}
          <div className="flex items-center space-x-4">
           
            {currentUser ? (
              <Dropdown arrowIcon={false} inline label={
                <Avatar alt="user" img={currentUser.profilePicture} rounded className="h-10 w-10" />
              }>
                <DropdownHeader>
                  <span className="block text-sm">{currentUser.username}</span>
                  <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                </DropdownHeader>
                <Link to={'/dashboard?tab=profile'}>
                  <DropdownItem>Profile</DropdownItem>
                </Link>
                <DropdownDivider />
                <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
              </Dropdown>
            ) : (
              <Link to="/">
                <HiUser className="text-white" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Navbar.Toggle>
              <HiMenu className="text-white text-3xl" />
            </Navbar.Toggle>
          </div>
        </div>
      </div>

      {/* Mobile Menu Collapse */}
      <Navbar.Collapse>
        <div className="flex flex-col space-y-4 md:hidden">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? "nav-link-active" : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/category" 
            className={({ isActive }) => 
              isActive ? "nav-link-active" : "nav-link"
            }
          >
            Category
          </NavLink>
          <NavLink 
            to="/product-page" 
            className={({ isActive }) => 
              isActive ? "nav-link-active" : "nav-link"
            }
          >
            Inventory
          </NavLink>
          <NavLink 
            to="/articles" 
            className={({ isActive }) => 
              isActive ?"nav-link-active" : "nav-link"
            }
          >
            Articles
          </NavLink>
          <NavLink 
            to="/history-page" 
            className={({ isActive }) => 
              isActive ? "nav-link-active" : "nav-link"
            }
          >
            History
          </NavLink>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}
