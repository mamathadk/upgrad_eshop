import {
  Button,
  TextField,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Footer from "../Footer/Footer";
import "./Signup.css";
import { toast } from "react-toastify";
import { signup } from "../../common/apiService";
import { emailRegex, passwordRegex, nameRegex, mobileNoRegex } from "../../common/regex";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  
  
  const validateInputs = () => {
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "Please enter a first name.";
    } else if (!nameRegex.test(firstName)) {
      newErrors.firstName = "First name must contain only alphabets.";
    }
  
    if (!lastName.trim()) {
      newErrors.lastName = "Please enter a last name.";
    } else if (!nameRegex.test(lastName)) {
      newErrors.lastName = "Last name must contain only alphabets.";
    }
  
    if (!email || !emailRegex.test(email))
      newErrors.email ="Please enter a valid email address.";
    
    if (!password || !passwordRegex.test(password))
      newErrors.password="Password must be at least 7 characters long, include at least one number, and one special character.";
    if (confirmPassword !== password)
      newErrors.confirmPassword="Passwords do not match."
    if (!contactNo || contactNo.length !== 10 || !mobileNoRegex.test(contactNo))
      newErrors.contactNo="Please enter a valid 10-digit contact number."
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // const handleSignup = async () => {
  //   if (!validateInputs()) return;

  //   const requestBody = {
  //     firstName,
  //     lastName,
  //     email,
  //     password,
  //     contactNumber: contactNo,
  //     role: role === "admin" ? ["admin"] : undefined, // Include role if admin
  //   };

  //   setErrorMessage("");
  //   setSuccessMessage("");
  //   setIsLoading(true);

  //   try {
  //     const data = await signup(requestBody); // Call the signup API
  //     setSuccessMessage("Signup successful! Redirecting...");
  //     setTimeout(() => {
  //       navigate("/products");
  //     }, 1500);
  //   } catch (error) {
  //     if (error.response) {
  //       const responseMessage =
  //         error.response.data?.message || "Signup failed. Please try again.";
  //       setErrorMessage(responseMessage);
  //     } else if (error.message) {
  //       setErrorMessage(error.message);
  //     } else {
  //       setErrorMessage("Signup failed. Please try again.");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSignup = async () => {
    if (!validateInputs()) return;
  
    const requestBody = {
      firstName,
      lastName,
      email,
      password,
      contactNumber: contactNo,
      role: role === "admin" ? ["admin"] : undefined, // Include role if admin
    };
  
    setIsLoading(true);
  
    try {
      const data = await signup(requestBody); // Call the signup API
      toast.success("Signup successful! Redirecting...");
      setTimeout(() => {
        navigate("/products");
      }, 1500);
    } catch (error) {
      if (error.response) {
        const responseMessage =
          error.response.data?.message || "Signup failed. Please try again.";
        toast.error(responseMessage);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box className="signup-wrapper">
      <Box className="signup-form">
        <Box className="icon-wrapper">
          <LockOpenIcon style={{ fontSize: "20px", color: "white" }} />
        </Box>
        <h1>Sign up</h1>

        {/* {errorMessage && (
          <div style={{ color: "red", marginBottom: "10px" }}>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div style={{ color: "green", marginBottom: "10px" }}>
            {successMessage}
          </div>
        )} */}

        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          margin="normal"
          required
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          margin="normal"
          required
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <TextField
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Password"
          type={"password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          label="Confirm Password"
          type={"password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
        <TextField
          label="Contact Number"
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value)}
          fullWidth
          margin="normal"
          required
          error={!!errors.contactNo}
          helperText={errors.contactNo}
        />

        {/* Role Selection */}

        <InputLabel id="role-select-label">Role</InputLabel>
        <FormControl fullWidth margin="normal">
          <Select
            labelId="role-select-label"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        <Button
          onClick={handleSignup}
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "1rem", backgroundColor: "#3f51b5" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Sign Up"
          )}
        </Button>

        <Box style={{ marginTop: "1rem", textAlign: "right" }}>
          <Link to="/login">Already have an account? Sign in</Link>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Signup;
