import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from "wouter";
import { API_BASE } from '../config';

import axios from 'axios';

/**
 * User role types supported by the application
 */
export type UserRole = 'student' | 'job_seeker' | 'employer' | 'admin' | null;

/**
 * User interface defining the structure of a user
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
  title?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  skills?: string[];
  company_name?: string;
  logo_url?: string;
  cv_url?: string;
  education?: any[]; 
}

/**
 * Context interface defining the shape of the user context
 */
interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  // register: (userData: Partial<User>, password: string) => Promise<boolean>;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
  isRole: (role: UserRole) => boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  sendVerificationCode: (
  name: string,
  email: string,
  password: string,
  role: string
) => Promise<boolean>;
register: (
  userData: Partial<User>,
  verificationCode: string
) => Promise<boolean>;

}

/**
 * Default/initial state for the user context
 */
const defaultUserContext: UserContextType = {
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  updateProfile: async () => false,
  isRole: () => false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  sendVerificationCode: async () => false,

};

/**
 * Create the user context with default values
 */
const UserContext = createContext<UserContextType>(defaultUserContext);


/**
 * Props for the UserProvider component
 */
interface UserProviderProps {
  children: ReactNode;
}



/**
 * UserProvider Component
 * 
 * This provider encapsulates user authentication and role management functionality
 * Provides login, logout, and registration methods
 * Persists user state in localStorage
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [, navigate] = useLocation();

  // Check for existing user session in localStorage on component mount
 useEffect(() => {
  const storedUser = localStorage.getItem("jobhive_user");
  const token = localStorage.getItem("access_token");

  if (storedUser && token) {
    try {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error restoring session", err);
      logout();
    }
  }
}, []);


// const sendVerificationCode = async (
//   name: string,
//   email: string,
//   password: string,
//   role: string
//   ): Promise<boolean> => {
//   try {
//     const mappedRole = role === "student" ? "job_seeker" : role;
//     const payload = { name, email, password, role: mappedRole };


//     const res = await fetch("http://localhost:8000/api/send-verification-code", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       localStorage.setItem("pendingVerificationEmail", email);
//       localStorage.setItem("registrationFullName", name);
//       localStorage.setItem("registrationPassword", password);
//       localStorage.setItem("registrationAccountType", role);
//       return true;
//     } else {
//       console.error("Send code failed:", data.message || data);
//       return false;
//     }
//   } catch (err) {
//     console.error("Send code error:", err);
//     return false;
//   }
// };

const sendVerificationCode = async (
  name: string,
  email: string,
  password: string,
  role: string
): Promise<boolean> => {
  try {
    // ✅ Map "student" to "job_seeker" for backend compatibility
    const mappedRole = role === "student" ? "job_seeker" : role;

    const payload = {
      name,
      email,
      password,
      role: mappedRole,
    };

    const res = await fetch(`${API_BASE}/api/send-verification-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Sending verification code...");

    const data = await res.json();

    if (res.ok) {
      // ✅ Store original frontend role
      localStorage.setItem("pendingVerificationEmail", email);
      localStorage.setItem("registrationFullName", name);
      localStorage.setItem("registrationPassword", password);
      localStorage.setItem("registrationAccountType", role);
      return true;
    } else {
      console.error("Send code failed:", data.message || data);
      return false;
    }
  } catch (err) {
    console.error("Send code error:", err);
    return false;
  }
};


  /**
   * Login function - authenticates a user with email and password
   */

// const login = async (email: string, password: string): Promise<boolean> => {
//   try {
//     const response = await fetch("http://localhost:8000/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();

//     if (response.ok && data.access_token) {
//       localStorage.setItem("access_token", data.access_token);
//       localStorage.setItem("jobhive_user", JSON.stringify(data.user));
//       setUser(data.user);
//       setIsAuthenticated(true);
//       return true;
//     } else {
//       console.error("Login failed:", data.message || data);
//       return false;
//     }
//   } catch (error) {
//     console.error("Login error:", error);
//     return false;
//   }
// };

const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // ✅ Handle unverified users (403)
    if (response.status === 403) {
      console.warn("User not verified:", data.message);

      // Save for verification screen
      localStorage.setItem("pendingVerificationEmail", email);
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      return false;
    }

    // ✅ Handle invalid credentials (401)
    if (response.status === 401) {
      alert(data.message || "Invalid email or password");
      return false;
    }

    // ✅ Login success
    if (response.ok && data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("jobhive_user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    }

    // 🚫 Other unexpected failure
    console.error("Login failed:", data.message || data);
    return false;

  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};





  /**
   * Logout function - removes user session
   */
 const logout = () => {
  setUser(null);
  setIsAuthenticated(false);
  localStorage.removeItem("jobhive_user");
  localStorage.removeItem("access_token");
};


  /**
   * Register function - creates a new user account
   */

const register = async (
  userData: Partial<User>,
  verificationCode: string
): Promise<boolean> => {
  const email = userData.email;
  if (!email) return false;

  try {
    const payload = {
      email,
      code: verificationCode,
    };

    const res = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("jobhive_user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } else {
      console.error("Registration verification failed:", data.message || data);
      return false;
    }
  } catch (err) {
    console.error("Registration error:", err);
    return false;
  }
};




const updateProfile = async (updatedData: Partial<User>): Promise<boolean> => {
  const token = localStorage.getItem("access_token");
  if (!token) return false;

  try {
    const payload = {
      full_name: updatedData.name,
      title: updatedData.title,
      bio: updatedData.bio || "",
      email: updatedData.email,
      phone: updatedData.phone,
      country_code: "+962",
      address: updatedData.location,
      website: updatedData.website || "",
      skills: updatedData.skills || [],
      education: updatedData.education || [],
      profile_pic_url: updatedData.profilePicture || null,
    };

    const res = await fetch(`${API_BASE}/api/job-seeker/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setUser((prevUser) => {
        if (!prevUser) return prevUser;

        return {
          ...prevUser,
          name: payload.full_name ?? prevUser.name,
          title: payload.title ?? prevUser.title,
          bio: payload.bio ?? prevUser.bio,
          phone: payload.phone ?? prevUser.phone,
          email: payload.email ?? prevUser.email,
          location: payload.address ?? prevUser.location,
          website: payload.website ?? prevUser.website,
          skills: payload.skills ?? prevUser.skills,
          education: payload.education ?? prevUser.education,
          profilePicture: data.profile_pic_url || updatedData.profilePicture || prevUser.profilePicture,
        };
      });

      return true;
    } else {
      console.error("Update profile failed:", data.error || data.message);
      return false;
    }
  } catch (err) {
    console.error("Update profile error:", err);
    return false;
  }
};







  /**
   * Helper function to check if user has a specific role
   */
  const isRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  // Create the context value object
  const contextValue: UserContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
    isRole,
    setUser,
    setIsAuthenticated,
    sendVerificationCode,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to use the user context
 * Provides easy access to user data and authentication functions
 */
export const useUser = () => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};