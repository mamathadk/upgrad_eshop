import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { deleteProductById } from "../../common/apiProducts";
import { toast } from "react-toastify";

const DeleteProduct = ({ productId, productName, onDeleteSuccess }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    const result = await deleteProductById(productId);
    if (result.success) {
      toast.success(`Product ${productName} deleted successfully`);
      onDeleteSuccess(productId);
    } else {
      toast.error("Failed to delete the product. Please try again.");
    }
    handleClose();
  };

  return (
    <>
      {/* Delete Button */}
      <IconButton
        color="text.secondary"
        aria-label="delete"
        onClick={handleOpen}
      >
        <Delete />
      </IconButton>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm deletion of product!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDelete}
            color="primary"
            variant="contained"
            style={{ backgroundColor: "#3f51b5" }}
          >
            OK
          </Button>
          <Button
            onClick={handleClose}
            color="primary"
            variant="outlined"
            style={{ color: "#3f51b5" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteProduct;
