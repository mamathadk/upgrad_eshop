import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Grid, Box, Typography, Button, Paper, Divider } from "@mui/material";
import { toast } from "react-toastify";
import Container from "@mui/material/Container";
import ProgressBar from "../../common/Progressbar";
import { placeOrderApi } from "../../common/apiAddress";
import "./OrderConfirmed.css";
const OrderConfirmed = ({ user }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const orderData =
    location.state?.orderData || JSON.parse(localStorage.getItem("orderData"));

  const placeOrder = async () => {
    try {
      const orderResponse = await placeOrderApi(orderData);
      setOrderDetails(orderResponse);
      toast.success("Order placed successfully", { position: "top-right" });

      setTimeout(() => {
        navigate("/products", {
          state: { success: "Order placed successfully" },
        });
      }, 1000);
    } catch (error) {
      toast.error(error.message, { position: "top-right" });
    }
  };
  return (
    <>
      {/* Progress Bar */}
      <Box className="box-container">
        <ProgressBar currentStep={2} />
      </Box>

      {/* Order Details Section */}
      <Box className="order-details-section">
        {orderData ? (
          <Container>
            <Box className="order-card">
              <Grid container spacing={2}>
                <Grid item xs={8} className="grid-item-product">
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ marginBottom: 2 }}
                  >
                    {orderData.productName}
                  </Typography>
                  <Typography sx={{ marginBottom: 2 }} variant="body2">
                    Quantity: <strong>{orderData.quantity}</strong>
                  </Typography>
                  <Typography sx={{ marginBottom: 2 }} variant="body2">
                    Category:{" "}
                    <strong>{orderData.category || "Not Available"}</strong>
                  </Typography>
                  <Typography
                    className="order-descr"
                    sx={{ marginBottom: 2 }}
                    variant="body2"
                    color="text.secondary"
                  >
                    {orderData.description}
                  </Typography>
                  <Typography variant="subtitle1" className="price-highlight">
                    Total Price: ₹{orderData.price * orderData.quantity}
                  </Typography>
                </Grid>

                {/* Address Details - 25% */}
                <Grid item xs={4} className="grid-item-address">
                  <Typography variant="h5" gutterBottom>
                    Address Details:
                  </Typography>
                  <Typography variant="body2">
                    {orderData.newAddress
                      ? orderData.newDataAddress.newAddressName
                      : orderData.selectedDataAddress?.addresssName}
                  </Typography>
                  <Typography variant="body2">
                    Contact Number:{" "}
                    {orderData.newAddress
                      ? orderData.newDataAddress.newAddressContactNo
                      : orderData.selectedDataAddress?.addressContactNo}
                  </Typography>
                  <Typography variant="body2">
                    {orderData.newAddress
                      ? `${orderData.newDataAddress.newAddressStreet}, ${orderData.newDataAddress.newAddressCity}`
                      : `${orderData.selectedDataAddress?.addressStreet}, ${orderData.selectedDataAddress?.addressCity}`}
                  </Typography>
                  <Typography variant="body2">
                    {orderData.newAddress
                      ? orderData.newDataAddress.newAddressState
                      : orderData.selectedDataAddress?.addressState}
                  </Typography>
                  <Typography variant="body2">
                    {orderData.newAddress
                      ? orderData.newDataAddress.newAddressZipcode
                      : orderData.selectedDataAddress?.addressZipcode}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Action Buttons Outside Shadow */}
            <Box className="button-container">
              <Button
                onClick={() => navigate("/address")}
                style={{ color: "black" }}
              >
                Back
              </Button>
              <Button
                onClick={placeOrder}
                variant="contained"
                color="primary"
                style={{ backgroundColor: "#3f51b5" }}
              >
                Place Order
              </Button>
            </Box>
          </Container>
        ) : (
          <Typography variant="h6">
            Loading your order details, please wait...
          </Typography>
        )}
      </Box>
    </>
  );
};

export default OrderConfirmed;
