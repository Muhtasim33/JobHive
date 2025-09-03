import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useUser } from "@/contexts/UserContext";
import { BellIcon } from "lucide-react";
import { Popover } from "@headlessui/react";
import { formatDistanceToNow } from "date-fns";
import logoImage from "@/assets/logo1.png";
import { API_BASE } from '../config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Header Component
 * 
 * Main navigation bar for the application
 * Features responsive design with mobile menu toggle
 * Implements scroll behavior for header shrinking
 * Displays different navigation options based on user role
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const { user, isAuthenticated, logout, isRole } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  type NotificationType = {
  id: number;
  body: string;
  created_at: string;
  read: boolean;
};



const handleMarkAllRead = async () => {
  if (!user?.id) return; // 🔒 Type-safe check to avoid error

  try {
    await fetch(`${API_BASE}/api/notifications/${user.id}/mark-all-read`, {
      method: "PATCH",
    });
    fetchNotifications(); // ✅ Refresh local state
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
  }
};

  
const fetchNotifications = async () => {
  if (!user?.id) return;
  try {
    const res = await fetch(`${API_BASE}/api/notifications/${user.id}`);
    const data = await res.json();
    setNotifications(data.notifications);
  } catch (err) {
    console.error("Failed to load notifications:", err);
  }
};

useEffect(() => {
  fetchNotifications();
}, [user?.id]);
  // Function to navigate and scroll to top
  const handleNavigate = (path: string) => {
    setLocation(path);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle scroll event to shrink header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path ? "text-[#F6C500]" : "text-black";
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  // Get the user's initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    return user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Determine which navigation links to show based on user role
const renderNavigationLinks = () => {
  // Home should be visible ONLY when not logged in
  const homeLink = !isAuthenticated && (
    <button 
      onClick={() => handleNavigate("/")} 
      className={`font-medium ${isActive("/")} hover:text-[#F6C500] transition-colors duration-200`}
    >
      Home
    </button>
  );

  const commonLinks = (
    <>
      {homeLink}
      <button 
        onClick={() => handleNavigate("/jobs")} 
        className={`font-medium ${isActive("/jobs")} hover:text-[#F6C500] transition-colors duration-200`}
      >
        Jobs
      </button>
    </>
  );

  // Now your role-based conditions stay the same...
  if (!isAuthenticated) return commonLinks;

  if (isRole("job_seeker")) {
    return (
      <>
        {commonLinks}
        <button onClick={() => handleNavigate("/resume-builder")} className={`font-medium ${isActive("/resume-builder")} hover:text-[#F6C500] transition-colors duration-200`}>
          Resume Builder
        </button>
        <button onClick={() => handleNavigate("/dashboard")} className={`font-medium ${isActive("/dashboard")} hover:text-[#F6C500] transition-colors duration-200`}>
          Dashboard
        </button>
      </>
    );
  }

    if (isRole('employer')) {
  return (
    <>
      {commonLinks}
      <button 
        onClick={() => handleNavigate("/dashboard")} 
        className={`font-medium ${isActive("/dashboard")} hover:text-[#F6C500] transition-colors duration-200`}
      >
        Dashboard
      </button>
      <button 
        onClick={() => handleNavigate("/post-job")} 
        className={`font-medium ${isActive("/post-job")} hover:text-[#F6C500] transition-colors duration-200`}
      >
        Post Job
      </button>
    <DropdownMenu onOpenChange={(open) => {
  if (open) handleMarkAllRead(); // Mark as read when dropdown opens
}}>
  <DropdownMenuTrigger asChild>
    <button
      className="relative ml-4 hover:text-[#F6C500] transition-colors duration-200"
      title="Notifications"
    >
      <BellIcon className="w-5 h-5" />
      {notifications.some(n => !n.read) && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end" className="w-80">
    {notifications.length === 0 ? (
      <DropdownMenuItem className="text-gray-500">
        No new notifications
      </DropdownMenuItem>
    ) : (
      notifications.map((notif, index) => (
        <DropdownMenuItem key={index} className="whitespace-normal break-words text-sm">
          {notif.body}
          <span className="block text-xs text-gray-400">
            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
          </span>
        </DropdownMenuItem>
      ))
    )}
  </DropdownMenuContent>
</DropdownMenu>


    </>
  );
}


    if (isRole('admin')) {
      return (
        <>
          {commonLinks}
          <button 
            onClick={() => handleNavigate("/admin")} 
            className={`font-medium ${isActive("/admin")} hover:text-[#F6C500] transition-colors duration-200`}
          >
            Admin Panel
          </button>
        </>
      );
    }

    return commonLinks;
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full bg-white z-50 transition-all duration-300 ${isScrolled ? 'header-shrink h-[70px]' : 'h-20'}`}>
        <div className="container h-full flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => handleNavigate("/")} className="flex items-center focus:outline-none">
            <img src={logoImage} alt="Logo" className="h-10 w-10 mr-2" />
            <span className="text-2xl font-bold">Job<span className="text-[#F6C500]">Hive</span></span>
          </button>
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <button 
              className="text-black p-2"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          )}
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center space-x-8">
              {renderNavigationLinks()}
              
              {/* Auth Buttons or User Menu */}
              {!isAuthenticated ? (
                <div className="flex space-x-3">
                  <Button 
                    style={{ backgroundColor: "#F6C500", color: "#000000" }} 
                    className="rounded-full transition-colors duration-200"
                    onClick={() => handleNavigate("/login")}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2 border-[#F6C500] text-black rounded-full hover:bg-[#FFFBEA] transition-colors duration-200"
                    onClick={() => handleNavigate("/register")}
                  >
                    Sign Up
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 focus:outline-none">
                      <Avatar className="h-9 w-9 border border-[#F6C500]">
                        <AvatarImage src={user?.profilePicture} />
                        <AvatarFallback className="bg-[#FFFBEA] text-[#F6C500]">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user?.name}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {!isRole("admin") && (
                      <>
                        <DropdownMenuItem 
                          className="cursor-pointer" 
                          onClick={() => handleNavigate("/dashboard")}
                        >
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer" 
                          onClick={() => handleNavigate("/profile")}
                        >
                          My Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>
          )}
        </div>
        
        {/* Mobile Navigation */}
        {isMobile && (
          <nav className={`bg-white w-full border-t border-gray-200 transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className="container px-4 py-3 flex flex-col space-y-3">
              {/* Home and Jobs links always visible */}
              {!isAuthenticated && (
                  <button 
                    onClick={() => handleNavigate("/")} 
                    className={`font-medium ${isActive("/")} hover:text-[#F6C500] py-2 transition-colors duration-200 text-left w-full`}
                  >
                    Home
                  </button>
                )}

              <button 
                onClick={() => handleNavigate("/jobs")} 
                className={`font-medium ${isActive("/jobs")} hover:text-[#F6C500] py-2 transition-colors duration-200 text-left w-full`}
              >
                Jobs
              </button>
              
              {/* Conditional links based on authentication and role */}
              {isAuthenticated && (
                <>
                  {isRole('job_seeker') && (
                    <>
                      <button 
                        onClick={() => handleNavigate("/resume-builder")} 
                        className={`font-medium ${isActive("/resume-builder")} hover:text-[#F6C500] py-2 transition-colors duration-200 text-left w-full`}
                      >
                        Resume Builder
                      </button>
                      <button 
                        onClick={() => handleNavigate("/dashboard")} 
                        className={`font-medium ${isActive("/dashboard")} hover:text-[#F6C500] py-2 transition-colors duration-200 text-left w-full`}
                      >
                        Dashboard
                      </button>
                    </>
                  )}
                  
                  {isRole('employer') && (
                    <>
                      <button 
                        onClick={() => handleNavigate("/dashboard")} 
                        className={`font-medium ${isActive("/dashboard")} hover:text-[#F6C500] py-2 transition-colors duration-200 text-left w-full`}
                      >
                        Dashboard
                      </button>
                      <button 
                        onClick={() => handleNavigate("/post-job")} 
                        className={`font-medium ${isActive("/post-job")} hover:text-[#F6C500] py-2 transition-colors duration-200 text-left w-full`}
                      >
                        Post Job
                      </button>
                    </>
                  )}
                  
                  {isRole('admin') && (
                    <button 
                      onClick={() => handleNavigate("/admin")} 
                      className={`font-medium ${isActive("/admin")} hover:text-[#F6C500] py-2 transition-colors duration-200 text-left w-full`}
                    >
                      Admin Panel
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleNavigate("/profile")} 
                    className={`font-medium ${isActive("/profile")} hover:text-[#F6C500] py-2 transition-colors duration-200 text-left w-full`}
                  >
                    My Profile
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="font-medium text-red-600 hover:text-red-700 py-2 text-left transition-colors duration-200 w-full"
                  >
                    Logout
                  </button>
                </>
              )}
              
              {/* Auth buttons for logged out users */}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-2">
                  <Button 
                    style={{ backgroundColor: "#F6C500", color: "#000000" }} 
                    className="rounded-full w-full transition-colors duration-200"
                    onClick={() => handleNavigate("/login")}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2 border-[#F6C500] text-black rounded-full w-full hover:bg-[#FFFBEA] transition-colors duration-200"
                    onClick={() => handleNavigate("/register")}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
