/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { CiLogout, CiHome } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Baseurl } from "../../services api/baseurl";
import { logout } from "../redux/fetaures/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  reomveSelectedUser,
  setSelectedUser,
} from "../redux/fetaures/userSlice";

export const SideBar = ({ socket }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [userdata, setUserdata] = useState([]);
  const [search, setSearch] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const resp = await axios.get(`${Baseurl}/api/Auth/get_user`);
      setUserdata(resp.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const filteredUsers = user
    ? userdata
        .filter((curUser) => curUser._id !== user._id)
        .filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
    : [];

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    if (socket) {
      socket.disconnect();
    }
    dispatch(reomveSelectedUser());
    navigate("/login");
  };

  const handleUserSelect = (selectedUser) => {
    dispatch(setSelectedUser(selectedUser));
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (socket) {
      socket.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
    }

    return () => {
      if (socket) {
        socket.off("getUsers");
      }
    };
  }, [socket]);

  const isUserOnline = (userId) => {
    return onlineUsers.some((onlineUser) => onlineUser.userId === userId);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-0 text-[12px] z-50 p-2 bg-[#F0F2F5] text-black rounded-lg"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar fixed top-0 left-0 max-h-screen bg-green-100 z-10 shadow-lg transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0 md:block w-70 overflow-y-scroll h-screen py-6 px-4`}
      >
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between md:mt-0 mt-11">
          {/* Search Bar */}
          <input
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
            type="text"
            placeholder="Search users..."
            className="bg-white w-full md:w-2/3 px-4 py-2 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />

          {/*Dropdown for Logout*/}
          <div className="relative font-[sans-serif] mt-4 md:mt-0 md:ml-4 ">
            <button
              type="button"
              className="flex border-[1px] hover:transition-all hover:shadow-slate-400 hover:border-green-800 items-center rounded-full text-[#333] text-sm"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={user?.profile || "/default-profile.jpg"}
                className="w-12 h-12 rounded-full"
                alt="Profile"
              />
            </button>

            <ul
              className={`absolute right-0 mt-2 shadow-lg bg-white py-2 z-[1000] min-w-24 w-15 rounded-lg max-h-60 overflow-x-hidden ${
                isDropdownOpen ? "block" : "hidden"
              }`}
            >
              <li className="py-2.5 px-5 gap-[8px] flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer">
                <CiHome />
                Home
              </li>
              <li
                onClick={handleLogout}
                className="py-2.5 px-5 flex gap-[8px] items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer"
              >
                <CiLogout />
                Logout
              </li>
            </ul>
          </div>
        </div>

        {/* User List */}
        <div className="my-8 flex-1">
          <h6 className="text-[1.5rem] text-gray-700 font-semibold mb-6">Users</h6>
          <ul className="space-y-6">
            {filteredUsers.map((curUser) => (
              <li
                key={curUser._id}
                onClick={() => handleUserSelect(curUser)}
                className="flex items-center text-sm text-black hover:text-blue-500 cursor-pointer"
              >
                <span className="relative inline-block mr-4">
                  <img
                    src={curUser.profile}
                    className="ml-[13px] rounded-full w-[50px] h-[50px] object-cover"
                    alt="Profile"
                  />
                  {isUserOnline(curUser._id) && (
                    <span className="h-2.5 w-2.5 rounded-full bg-green-600 block absolute bottom-1 right-0"></span>
                  )}
                </span>
                <span className="font-medium">{curUser.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
