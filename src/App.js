import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import NavBar from "./components/Navbar/NavBar";
import { useState } from "react";
import Products from "./components/Products/Products";
import Signup from "./components/Signup/Signup";
import AddProducts from "./components/AddProducts/AddProducts";
import Login from "./components/Login/Login";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import AddressDetails from "./components/AddressDetails/AddressDetails";
import OrderConfirmed from "./components/OrderConfirmed/OrderConfirmed";
import { ToastContainer } from "react-toastify";
import EditProduct from "./components/EditProduct/EditProduct";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setIsAdmin(loggedInUser?.roles?.includes("ADMIN")); // Check for admin role
    console.log("loggedInUser", loggedInUser);
  };

  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <NavBar user={user} isAdmin={isAdmin} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/products"
            element={<Products user={user} isAdmin={isAdmin} />}
          />
          <Route
            path="/products/:id"
            element={<ProductDetails user={user} />}
          />
          <Route
            path="/address"
            element={
              user ? <AddressDetails user={user} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/order-confirmation"
            element={
              user ? <OrderConfirmed user={user} /> : <Navigate to="/login" />
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/add-products"
            element={
              isAdmin ? (
                <AddProducts user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/products/edit/:id"
            //element={<EditProductWrapper user={user}/>}
            element={
              isAdmin ? (
                <EditProductWrapper user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

// Wrapper to handle location
function EditProductWrapper({ user }) {
  const location = useLocation();
  const product = location.state;

  return (
    <EditProduct
      product={product}
      user={user}
      onEditSuccess={() => console.log("Product Updated")}
    />
  );
}

export default App;
