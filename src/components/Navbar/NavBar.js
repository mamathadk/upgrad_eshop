import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  TextField,
  Box,
  InputAdornment,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./NavBar.css";
const NavBar = ({ user, isAdmin, role, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (event) => {
    const query = event.target.value.trim();

    if (query.length === 0) {
      navigate("/products");
    } else if (query.length > 3) {
      navigate(`/products?search=${query}`);
    }
  };
  const logoutHandler = () => {
    onLogout();
    navigate("/login");
  };
  return (
    <AppBar position="static" style={{ backgroundColor: "#3f51b5" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Side: Logo and Home */}
        <Box style={{ display: "flex", alignItems: "center" }}>
          <ShoppingCartIcon style={{ color: "white" }} />
          <Button
            component={Link}
            color="inherit"
            sx={{ marginLeft: "0.5rem", textTransform: "none" }}
          >
            upGrad E-Shop
          </Button>
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {!user ? (
            <>
              <Link
                to="/login"
                style={{
                  color: "white",
                  marginRight: "1.5rem",
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  color: "white",
                }}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="searchbar" style={{ paddingRight: "350px" }}>
                <TextField
                  placeholder="Search..."
                  variant="outlined"
                  size="small"
                  onKeyDown={handleSearch}
                  sx={{
                    backgroundColor: "#9EA6F3",
                    color: "white",
                    width: "250px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "transparent",
                      },
                      "&:hover fieldset": {
                        borderColor: "transparent",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "transparent",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon style={{ color: "white" }} />
                      </InputAdornment>
                    ),
                    style: { color: "white" },
                  }}
                />
              </div>

              <Link
                component={Link}
                to="/products"
                color="inherit"
                style={{ color: "white", marginRight: "1rem" }}
              >
                Home
              </Link>
              {isAdmin && (
                <>
                  <Link
                    component={Link}
                    to="/add-products"
                    color="inherit"
                    style={{ color: "white", marginRight: "1rem" }}
                  >
                    Add Product
                  </Link>
                </>
              )}
              <Button
                onClick={logoutHandler}
                color="inherit"
                aria-label="Logout"
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "6px 16px",
                }}
              >
                LOGOUT
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
