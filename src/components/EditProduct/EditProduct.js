import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import CreatableSelect from "react-select/creatable";
import { useNavigate } from "react-router-dom";
import { fetchCategories, updateProduct } from "../../common/apiProducts";
import { toast } from "react-toastify";
import { nameRegex } from "../../common/regex";

const EditProduct = ({ product, onEditSuccess, user }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    name: product.name || "",
    category: product.category || "",
    price: product.price || "",
    description: product.description || "",
    manufacturer: product.manufacturer || "",
    availableItems: product.availableItems || "",
    imageUrl: product.imageUrl || "",
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      // navigate("/products");
    }
  }, [user, navigate]);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        const formattedCategories = fetchedCategories.map((cat) => ({
          value: cat,
          label: cat,
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleCategoryChange = (newValue) => {
    if (newValue) {
      setProductData({ ...productData, category: newValue.value });
    } else {
      setProductData({ ...productData, category: "" });
    }
  };

  const handleCreateCategory = (newCategory) => {
    const newOption = { value: newCategory, label: newCategory };
    setCategories((prev) => [...prev, newOption]);
    setProductData({ ...productData, category: newCategory });
  };

  const validate = () => {
    const newErrors = {};
    if (!productData.name.trim()) {
      newErrors.name = "Please enter a name.";
    }
    if (!productData.category.trim())
      newErrors.category = "Please select category or create a new category";
    if (!productData.price || productData.price <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!productData.manufacturer.trim())
      newErrors.manufacturer = "Please enter manufacturer";
    if (!productData.availableItems || productData.availableItems < 0)
      newErrors.availableItems = "Available items must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await updateProduct(product.id, productData);
      toast.success(`Product ${productData.name} modified successfully`);
      onEditSuccess();
      navigate("/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", padding: 2 }}>
      <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center" }}>
        Modify Product
      </Typography>
      <form>
        <TextField
          fullWidth
          label="Name *"
          name="name"
          value={productData.name}
          onChange={handleChange}
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />

        <CreatableSelect
          isClearable
          placeholder="Category *"
          options={categories}
          onChange={handleCategoryChange}
          onCreateOption={handleCreateCategory}
          value={
            productData.category
              ? { value: productData.category, label: productData.category }
              : null
          }
          styles={{
            control: (base, state) => ({
              ...base,
              marginBottom: "9px",
              minHeight: "52px",
              fontSize: "16px",
              borderColor: errors.category
                ? "red"
                : state.isFocused
                ? "black"
                : "rgba(0, 0, 0, 0.23)",
              "&:hover": {
                borderColor: errors.category ? "red" : "black",
              },
              boxShadow: errors.category
                ? "0 0 0 0.25px red"
                : state.isFocused
                ? "0 0 0 0.25px black"
                : "none", // Highlight border on error
            }),
            placeholder: (base) => ({
              ...base,
              color: "rgba(0, 0, 0, 0.54)",
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
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
          value={productData.manufacturer}
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
          value={productData.availableItems}
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
          value={productData.price}
          onChange={handleChange}
          margin="normal"
          error={!!errors.price}
          helperText={errors.price}
        />
        <TextField
          fullWidth
          label="Image URL"
          name="imageUrl"
          value={productData.imageUrl}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Product Description"
          name="description"
          multiline
          rows={3}
          value={productData.description}
          onChange={handleChange}
          margin="normal"
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ backgroundColor: "#3f51b5", color: "#fff", marginTop: 2 }}
          onClick={handleSubmit}
        >
          MODIFY PRODUCT
        </Button>
      </form>
    </Box>
  );
};

export default EditProduct;
