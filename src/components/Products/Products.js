import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  IconButton,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../Navbar/NavBar";
import { fetchCategories, fetchProducts } from "../../common/apiProducts";
import "./Products.css";
import { Delete, Edit } from "@material-ui/icons";
import DeleteProduct from "../DeleteProduct/DeleteProduct";

const Products = ({ user, isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const queryParamsCategory = new URLSearchParams(location.search);
  const category = queryParamsCategory.get("category");

  console.log(user, isAdmin);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      navigate("/products");
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await fetchCategories();
        const productsData = await fetchProducts();

        setCategories(["all", ...categoriesData]);
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  const handleCategoryChange = (event, newCategory) => {
    setSelectedCategory(newCategory);
    filterAndSortProducts(newCategory, sortOption, searchQuery);
  };
  useEffect(() => {
    if (category) {
      fetchProductsByCategory(category);
    }
  }, [category]);
  const fetchProductsByCategory = async (category) => {
    if (category === "all") {
      return;
    }
  };
  const handleSortChange = (event) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
    filterAndSortProducts(selectedCategory, newSortOption, searchQuery);
  };

  useEffect(() => {
    filterAndSortProducts(selectedCategory, sortOption, searchQuery);
  }, [searchQuery, selectedCategory, sortOption]);

  const filterAndSortProducts = (category, sort, query) => {
    let updatedProducts = [...products];

    if (category !== "all") {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === category
      );
    }
    if (query.trim() !== "") {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (sort === "priceHighToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sort === "priceLowToHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "newest") {
      updatedProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setFilteredProducts(updatedProducts);
  };
  const handleDeleteSuccess = (deletedProductId) => {
    setProducts(products.filter((product) => product.id !== deletedProductId));
    setFilteredProducts(
      filteredProducts.filter((product) => product.id !== deletedProductId)
    );
  };
  return (
    <Box>
      {/* Header */}
      <AppBar position="static" className="header">
        {/* Header Content */}
      </AppBar>

      {/* Category Tabs */}
      <Box className="category-tabs">
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

      {/* Sort Dropdown */}

      <Box
        className="sort-dropdown"
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <InputLabel
          id="sortby-select-label"
          sx={{ fontSize: "16px", color: "rgba(0, 0, 0, 0.87)" }}
        >
          Sort By:
        </InputLabel>
        <Select
          labelId="sortby-select-label"
          value={sortOption}
          onChange={handleSortChange}
          displayEmpty
          defaultValue=""
          sx={{ width: "220px", height: "50px" }}
        >
          <MenuItem value="" disabled>
            <Typography variant="body2" color="text.secondary">
              Select...
            </Typography>
          </MenuItem>
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
          <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
          <MenuItem value="newest">Newest</MenuItem>
        </Select>
      </Box>

      {/* Product Cards */}
      <Box className="product-grid">
        {isLoading ? (
          <Box className="loader-container">
            <CircularProgress size={24} color="inherit" />
          </Box>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="product-card">
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl}
                alt={product.name}
              />
              <CardContent className="card-content">
                <Box className="product-info">
                  <Typography variant="h6" className="product-name">
                    {product.name}
                  </Typography>
                  <Typography variant="h6" className="product-price">
                    ₹ {product.price}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  style={{ backgroundColor: "#3f51b5" }}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  BUY
                </Button>
                {isAdmin && (
                  <Box className="action-icons">
                    <IconButton
                      color="text.secondary"
                      aria-label="edit"
                      onClick={() =>
                        navigate(`/products/edit/${product.id}`, {
                          state: product,
                        })
                      }
                    >
                      <Edit />
                    </IconButton>

                    <DeleteProduct
                      productId={product.id}
                      productName={product.name}
                      onDeleteSuccess={handleDeleteSuccess}
                    />
                  </Box>
                )}
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography variant="h6" className="no-products">
            No products found
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Products;
