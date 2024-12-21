import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import ProgressBar from "../../common/Progressbar";
import { addAddress, fetchAddresses } from "../../common/apiAddress";
import "./AddressDetails.css";
import { nameRegex,mobileNoRegex } from "../../common/regex";

const AddressDetails = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    contactNumber: "",
    street: "",
    city: "",
    state: "",
    landmark: "",
    zipcode: "",
  });
  const [errors, setErrors] = useState({});
  const orderDetails =
    location.state?.orderDetails ||
    JSON.parse(localStorage.getItem("orderDetails"));

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      navigate("/address");
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const addressesData = await fetchAddresses();
        setAddresses(addressesData);
      } catch (error) {
        toast.error(error.message);
      }
    };

    loadAddresses();
  }, []);
  const handleAddressSelect = (value) => {
    const address = JSON.parse(value);
    setSelectedAddress(address);
  };

  const validateField = (field, value) => {
    let error = "";
    if (!value.trim() && field === "name") {
      error = "Please enter a name.";
    } else if (field === "name" && !nameRegex.test(value)) {
      error = "Name can only contain alphabets.";
    }

    if (!value.trim() && field === "contactNumber") {
      error = "Please enter a phone number";
    }else if (field === "contactNumber" && !mobileNoRegex.test(value)) {
      error = "Please enter a valid 10-digit phone number.";
    }
    if (!value.trim() && field === "street") {
      error = "Please enter a street name";
    }
    if (!value.trim() && field === "city") {
      error = "Please enter a city name";
    }else if (field === "city" && !nameRegex.test(value)) {
      error = "City can only contain alphabets.";
    }
    if (!value.trim() && field === "state") {
      error = "Please enter state";
    }else if (field === "state" && !nameRegex.test(value)) {
      error = "State can only contain alphabets.";
    }
    if (!value.trim() && field === "zipcode") {
      error = "Please enter a zipcode or postal code";
    }  else if (field === "zipcode" && !/^\d{5,6}$/.test(value)) {
      error = "Zipcode must be a valid 5 or 6-digit number.";
    }
    return error;
  };

  const validateAddAddressForm = () => {
    const requiredFields = [
      "name",
      "contactNumber",
      "street",
      "city",
      "state",
      "zipcode",
    ];
    const newErrors = {};

    requiredFields.forEach((field) => {
      const error = validateField(field, newAddress[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (field, value) => {
    const updatedAddress = { ...newAddress, [field]: value };
    const error = validateField(field, value);

    setNewAddress(updatedAddress);
    setErrors((prevErrors) => {
      if (error) {
        return { ...prevErrors, [field]: error };
      } else {
        const { [field]: removedError, ...rest } = prevErrors;
        return rest;
      }
    });
  };
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!validateAddAddressForm()) {
      toast.error("Please fix the validation errors.");
      return;
    }

    try {
      const addedAddress = await addAddress(newAddress);
      setAddresses([...addresses, addedAddress]);
      setSelectedAddress(addedAddress);
      setNewAddress({
        name: "",
        contactNumber: "",
        street: "",
        city: "",
        state: "",
        landmark: "",
        zipcode: "",
      });
      toast.success("Address added successfully!");
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error(error.message);
    }
  };

  const handleBack = () => {
    navigate("/products");
    //navigate(`/products/${id}`);
  };

  const handleNext = () => {
    const isFormFilled =
      newAddress.name.trim() &&
      newAddress.contactNumber.trim() &&
      newAddress.street.trim() &&
      newAddress.city.trim() &&
      newAddress.state.trim() &&
      newAddress.zipcode.trim();

    if (!selectedAddress && !isFormFilled) {
      toast.error("Please select address!");
      return;
    }

    if (selectedAddress && isFormFilled) {
      toast.error(
        "You can either select an existing address or add a new one, not both."
      );
      return;
    }

    const orderData = {
      ...(orderDetails || {}),
      addressId: selectedAddress ? selectedAddress.id : null,
      newAddress: isFormFilled ? newAddress : null,
      selectedDataAddress: selectedAddress
        ? {
            addresssName: selectedAddress.name,
            addressContactNo: selectedAddress.contactNumber,
            addressStreet: selectedAddress.street,
            addressCity: selectedAddress.city,
            addressState: selectedAddress.state,
            addressZipcode: selectedAddress.zipcode,
          }
        : null,
      newDataAddress: isFormFilled
        ? {
            newAddressName: newAddress.name,
            newAddressContactNo: newAddress.contactNumber,
            newAddressStreet: newAddress.street,
            newAddressCity: newAddress.city,
            newAddressState: newAddress.state,
            newAddressZipcode: newAddress.zipcode,
          }
        : null,
    };

    localStorage.setItem("orderData", JSON.stringify(orderData));
    navigate("/order-confirmation", { state: { orderData } });
  };

  return (
    <Box className="container">
      <ProgressBar currentStep={1} />

      {/* Select Address Dropdown */}
      {addresses.length > 0 && (
        <Box className="select-address">
          <InputLabel id="address-select-label">Select Address</InputLabel>
          <FormControl fullWidth>
            <Select
              labelId="address-select-label"
              value={selectedAddress ? JSON.stringify(selectedAddress) : ""}
              onChange={(e) => handleAddressSelect(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select...
              </MenuItem>
              {addresses.map((address) => (
                <MenuItem key={address.id} value={JSON.stringify(address)}>
                  {`${address.name}-->${address.street}, ${address.landmark}, ${address.city}, ${address.state}, ${address.zipcode}, ${address.contactNumber}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      <Typography style={{ paddingBottom: "25px" }}>-OR-</Typography>
      <Typography style={{ paddingBottom: "16px" }}>Add Address </Typography>
      {/* New Address Form */}
      <form onSubmit={handleAddAddress} className="form">
        {[
          { field: "name", label: "Name" },
          { field: "contactNumber", label: "Contact Number" },
          { field: "street", label: "Street" },
          { field: "city", label: "City" },
          { field: "state", label: "State" },
          { field: "landmark", label: "Landmark" },
          { field: "zipcode", label: "Zipcode" },
        ].map(({ field, label }) => (
          <TextField
            key={field}
            label={`${label}${field !== "landmark" ? " *" : ""}`}
            value={newAddress[field]}
            onChange={(e) => handleFormChange(field, e.target.value)}
            //required={field !== "landmark"}
            error={Boolean(errors[field])} // Show error styling if error exists
            helperText={errors[field] || ""} // Display error message
            fullWidth={false} // Set to not take full width
            //  className="form-field"
            style={{ marginBottom: "1rem", width: "100%" }}
          />
        ))}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="save-button"
          style={{ backgroundColor: "#3f51b5" }}
        >
          Save Address
        </Button>
      </form>

      {/* Navigation Buttons */}
      <Box className="nav-buttons">
        <Button onClick={handleBack} className="back-button">
          Back
        </Button>
        <Button
          onClick={handleNext}
          variant="contained"
          color="primary"
          className="next-button"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default AddressDetails;
