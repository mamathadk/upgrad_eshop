import { Box, Typography } from "@mui/material";
import React from "react";
const ProgressBar = ({ currentStep }) => {
    const steps = ["Items", "Select Address", "Confirm Order"];
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        {steps.map((step, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Circle */}
            <Box
              sx={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: index <= currentStep ? "#3f51b5" : "gray",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                //fontWeight: "bold",
              }}
            >
              {index < currentStep ? "✔" : index + 1}
            </Box>
            {/* Step Label */}
            <Typography
              sx={{
                margin: "0 1rem",
                fontWeight: index === currentStep ? "normal" : "normal",
                color: index <= currentStep ? "black" : "gray",
              }}
            >
              {step}
            </Typography>
            {/* Line */}
            {index < steps.length - 1 && (
              <Box
                sx={{
                  width: "180px",
                  height: "2px",
                  backgroundColor: index < currentStep ? "gray" : "gray",
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    );
  };
  export default ProgressBar;