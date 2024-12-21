import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import CreatableSelect from "react-select/creatable";
import { fetchCategories, addProduct } from "../../common/apiProducts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { nameRegex } from "../../common/regex";

const AddProducts = ({ user }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    manufacturer: "",
    availableItems: "",
  });
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      //navigate("/products");
    }
  }, [user, navigate]);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        const formatted = fetchedCategories.map((cat) => ({
          value: cat,
          label: cat,
        }));
        setCategories(formatted);
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    loadCategories();
  }, []);
  const validateForm = () => {
    const newErrors = {};

    // if (!formData.name.trim()) newErrors.name = "Please enter a name";
    if (!formData.name.trim()) {
      newErrors.name = "Please enter a name.";
    }
    if (!formData.category.trim())
      newErrors.category = "Please select category or create a new category";
    if (!formData.manufacturer.trim())
      newErrors.manufacturer = "Please enter manufacturer";
    if (!formData.availableItems)
      newErrors.availableItems = "Please enter available items";
    else if (parseInt(formData.availableItems, 10) <= 0)
      newErrors.availableItems = "Available items must be greater than 0";

    if (!formData.price) newErrors.price = "Please enter the price";
    else if (parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    try {
      await addProduct({
        ...formData,
        price: parseFloat(formData.price),
        availableItems: parseInt(formData.availableItems, 10),
      });
      toast.success(`Product ${formData.name} added successfully`);
      setFormData({
        name: "",
        category: "",
        price: "",
        description: "",
        manufacturer: "",
        availableItems: "",
        imageUrl: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Failed to add product", error);
      toast.error("Failed to add product. Please try again.");
    }
  };

  const handleCategoryChange = (newValue) => {
    if (newValue) {
      setFormData({ ...formData, category: newValue.value });
    } else {
      setFormData({ ...formData, category: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", padding: 2 }}>
      <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center" }}>
        Add Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          className="product-name"
          error={!!errors.name}
          helperText={errors.name}
        />
        <CreatableSelect
          isClearable
          placeholder="Category *"
          options={categories}
          onChange={handleCategoryChange}
          onCreateOption={(newCategory) => {
            const newCategoryOption = {
              value: newCategory,
              label: newCategory,
            };
            setCategories((prev) => [...prev, newCategoryOption]);

            setFormData({ ...formData, category: newCategory });
          }}
          value={
            formData.category
              ? { value: formData.category, label: formData.category }
              : null
          }
          styles={{
            control: (base, state) => ({
              ...base,
              marginBottom: "9px",
              minHeight: "52px",
              fontSize: "16px",
              borderColor: errors.category
                ? "red" // Red border if there's an error
                : state.isFocused
                ? "black" // Primary color when focused
                : "rgba(0, 0, 0, 0.23)", // Default border color
              "&:hover": {
                borderColor: errors.category
                  ? "red" // Red border on hover if there's an error
                  : "black", // Hover border color set to primary
              },
              boxShadow: errors.category
                ? "0 0 0 0.25px red"
                : state.isFocused
                ? "0 0 0 0.25px black"
                : "none", // Highlight border on error
            }),
            placeholder: (base) => ({
              ...base,
              color: "rgba(0, 0, 0, 0.54)", // Match placeholder color with MUI TextField
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999, // Prevent overlapping issues
            }),
          }}
        />
        {errors.category && (
          <Typography variant="caption" color="error">
            {errors.category}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Manufacturer *"
          name="manufacturer"
          value={formData.manufacturer}
          onChange={handleChange}
          margin="normal"
          error={!!errors.manufacturer}
          helperText={errors.manufacturer}
        />
        <TextField
          fullWidth
          label="Available Items *"
          name="availableItems"
          type="number"
          value={formData.availableItems}
          onChange={handleChange}
          margin="normal"
          error={!!errors.availableItems}
          helperText={errors.availableItems}
        />
        <TextField
          fullWidth
          label="Price *"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          margin="normal"
          error={!!errors.price}
          helperText={errors.price}
        />
        <TextField
          fullWidth
          label="Image URL"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Product Description"
          name="description"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
          margin="normal"
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ backgroundColor: "#3f51b5", color: "#fff", marginTop: 2 }}
        >
          SAVE PRODUCT
        </Button>
      </form>
    </Box>
  );
};

export default AddProducts;
