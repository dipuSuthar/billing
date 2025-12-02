import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { AddCarpenterItem } from "./ItemLIst";

export default function AddItemDialog({ isOpen, setIsOpen }) {
  const [form, setForm] = useState({ name: "", rate: "", measure: "" });

  const handleChange = (e) => {
    console.log(e);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.rate || !form.measure) return;
    AddCarpenterItem(form);
    setForm({ name: "", rate: "", measure: "" });
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Item</DialogTitle>

      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          label="Item Name"
          size="small"
          name="name"
          fullWidth
          value={form.name}
          onChange={handleChange}
        />

        <TextField
          margin="dense"
          label="Rate"
          size="small"
          name="rate"
          type="number"
          fullWidth
          value={form.rate}
          onChange={handleChange}
        />

        <TextField
          select
          fullWidth
          size="small"
          label="Measure (nos, sqft, rft, sheet)"
          value={form.measure}
          onChange={(e) => {
            setForm({ ...form, measure: e.target.value });
          }}
        >
          <MenuItem value="nos">Nos</MenuItem>
          <MenuItem value="sqft">Sqft</MenuItem>
          <MenuItem value="rft">Rft</MenuItem>
          <MenuItem value="cft">Cft</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
