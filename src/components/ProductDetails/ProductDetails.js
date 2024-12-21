import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Box,
  CardMedia,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
} from "@mui/material";
import {
  fetchCategories,
  fetchProductDetails,
  fetchProducts,
} from "../../common/apiProducts";
import "./ProductDetails.css";
const ProductDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getProductDetails = async () => {
      setIsLoading(true);
      try {
        const productData = await fetchProductDetails(id);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getProductDetails();
  }, [id]);
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      navigate(`/products/${id}`);
    }
  }, [user, navigate]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await fetchCategories();
        const productsData = await fetchProducts();

        setCategories(["all", ...categoriesData]);
        setProducts(productsData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleCategoryChange = (event, newCategory) => {
    setSelectedCategory(newCategory);

    if (newCategory && newCategory !== "all") {
      navigate(`/products?category=${newCategory}`);
    } else {
      navigate(`/products`);
    }
  };

  const handlePlaceOrder = () => {
    if (quantity < 1 || quantity > product.availableQuantity) {
      alert("Invalid quantity selected.");
      return;
    }

    // Prepare the order data
    const orderDetails = {
      productId: product.id,
      quantity,
      productName: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
    };
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    navigate("/address", { state: { orderDetails } });
  };

  return (
    <>
      {/* Toggle Button Group */}
      <Box className="toggle-button-container">
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={handleCategoryChange}
          aria-label="Product categories"
        >
          {categories.map((category) => (
            <ToggleButton key={category} value={category}>
              {category.toUpperCase()}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      {isLoading ? (
        <Box className="loader-container">
          <CircularProgress size={24} color="inherit" />
        </Box>
      ) : product ? (
        <Box className="product-details-container">
          <Box className="product-details-wrapper">
            {/* Product Image */}
            <Box>
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl || ""}
                alt={product.name || "Image Not Available"}
                className="product-image"
              />
            </Box>

            {/* Product Details */}
            <Box className="product-details">
              <Box className="product-header">
                <Typography variant="h4" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" className="product-badge">
                  Available Quantity: {product.availableItems}
                </Typography>
              </Box>

              <Typography
                gutterBottom
                className="category-label"
                color="text.secondary"
                sx={{ marginBottom: "1.25rem " }}
              >
                Category:{" "}
                <strong
                  variant="h6"
                  className="category-value"
                  sx={{ fontWeight: "bold" }}
                >
                  {product.category}
                </strong>
              </Typography>
              <Typography
                variant="body2"
                className="product-descr"
                sx={{ marginBottom: "1.25rem", fontSize: "16px" }}
                gutterBottom
                color="text.secondary"
              >
                {product.description}
              </Typography>
              <Typography
                variant="h5"
                className="product-price"
                sx={{ marginBottom: "2.25rem " }}
                color="red"
                gutterBottom
              >
                ₹ {product.price}
              </Typography>

              {/* Quantity Input and Place Order */}
              <Box className="product-actions">
                <TextField
                  label="Enter Quantity"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="product-quantity-input"
                  inputProps={{
                    min: 1,
                    max: product.availableQuantity,
                  }}
                  required
                />
                <Button
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: "#3f51b5" }}
                  onClick={handlePlaceOrder}
                  disabled={
                    quantity < 1 || quantity > product.availableQuantity
                  }
                >
                  Place Order
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Typography variant="h6" className="no-products">
          No products found
        </Typography>
      )}
      {/* Product Details Section */}
    </>
  );
};

export default ProductDetails;
