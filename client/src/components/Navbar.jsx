import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, User, LogOut, Settings, FileText, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false); // close menu after logout
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Settings className="h-8 w-8" />
            <span className="font-bold text-xl">E-Gram Panchayat</span>
          </Link>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded-md"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/services"
              className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded-md"
            >
              <FileText className="h-4 w-4" />
              <span>Services</span>
            </Link>

            {user ? (
              <>
                {user.role === "user" && (
                  <Link
                    to="/my-applications"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md"
                  >
                    My Applications
                  </Link>
                )}
                {(user.role === "staff" || user.role === "officer") && (
                  <Link
                    to="/dashboard"
                    className="hover:bg-blue-700 px-3 py-2 rounded-md"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user.userName}</span>
                  <span className="text-xs bg-blue-800 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute px-4 pb-4 space-y-2 right-0 w-[11rem] flex flex-col bg-blue-600 border-1 border-blue-900 shadow-lg rounded-md" >
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded-md"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          <Link
            to="/services"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded-md"
          >
            <FileText className="h-4 w-4" />
            <span>Services</span>
          </Link>

          {user ? (
            <>
              {user.role === "user" && (
                <Link
                  to="/my-applications"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-blue-700 px-3 py-2 rounded-md"
                >
                  My Applications
                </Link>
              )}
              {(user.role === "staff" || user.role === "officer") && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-blue-700 px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>
              )}
              <div className="flex items-center space-x-2 px-3 py-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.userName}</span>
                <span className="text-xs bg-blue-800 px-2 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded-md w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
