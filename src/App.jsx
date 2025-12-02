// App.jsx
import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  useMediaQuery,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ReceiptLong,
  Add,
  Delete,
  Edit,
  Save,
  PictureAsPdf,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import itemMaster, { AddCarpenterItem } from "../src/component/ItemLIst";
import AddItemDialog from "./component/AddItemModel";

/* ---------------------------
  Color palette — Option A
----------------------------*/
const COLORS = {
  primary: "#008F8A",
  secondary: "#00C4B4",
  bg: "#F4F7F9",
  text: "#22313F",
};

const drawerWidth = 240;

/* ---------------------------
  Item master (predefined)
----------------------------*/

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    date: "",
  });

  const [items, setItems] = useState([]);
  const [customItem, setCustomItem] = useState({
    name: "",
    length: "",
    width: "",
    height: "",
    qty: "",
    rate: "",
    measure: "nos",
  });

  const [editId, setEditId] = useState(null);
  const isMdUp = useMediaQuery("(min-width:900px)");
  const [isOpen, setIsOpen] = useState(false); // Controls dialog open/close
  const theme = createTheme({
    palette: {
      primary: { main: COLORS.primary },
      secondary: { main: COLORS.secondary },
    },
    typography: {
      fontFamily: "'Inter', Roboto, sans-serif",
    },
  });

  const handleDrawerToggle = () => setMobileOpen((s) => !s);

  const handleMasterSelect = (val) => {
    const sel = itemMaster.find((i) => i.name === val);
    if (!sel) return;
    setCustomItem((s) => ({
      ...s,
      name: sel.name,
      rate: sel.rate,
      measure: sel.measure,
    }));
  };

  const addItem = () => {
    // basic validation
    if (!customItem.name || !customItem.rate || !customItem.measure) return;

    // compute size and total
    const size = calculateSize(customItem);
    const total = calculateTotal({
      ...customItem,
      measure: customItem.measure,
    });

    // final item object — a plain object, NOT an array
    const newItem = {
      id: Date.now(),
      name: customItem.name,
      measure: customItem.measure, // 'nos' | 'sqft' | 'rft' | 'cft'
      // keep original input dimensions so you can edit later
      length: toNum(customItem.length),
      width: toNum(customItem.width),
      height: toNum(customItem.height),
      qty: customItem.measure === "nos" ? toNum(customItem.qty) : undefined,
      size, // computed (sqft / rft / cft) OR numeric qty for nos
      rate: toNum(customItem.rate),
      total, // computed total (size * rate)
    };

    // push correctly into the items array (NO nested arrays)
    setItems((prev) => [...prev, newItem]);

    // reset input
    setCustomItem({
      name: "",
      length: "",
      width: "",
      height: "",
      qty: "",
      rate: "",
      measure: "nos",
    });
  };

  const removeItem = (id) => setItems((s) => s.filter((i) => i.id !== id));

  const startEdit = (id) => setEditId(id);
  const saveEdit = (id, row) => {
    setItems((s) =>
      s.map((it) =>
        it.id === id
          ? { ...row, total: Number(row.size) * Number(row.rate) }
          : it
      )
    );
    setEditId(null);
  };

  // convert strings -> numbers safely
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // returns numeric size (sqft / rft / cft) or qty for nos
  const calculateSize = ({ measure, length, width, height, qty }) => {
    const L = toNum(length);
    const W = toNum(width);
    const H = toNum(height);
    const Q = toNum(qty);

    switch (measure) {
      case "sqft": {
        // length and width are in inches -> sqft = (L * W) / 144
        return Number(((L * W) / 144).toFixed(4)); // keep some precision
      }

      case "rft": {
        // length in inches -> run/linear ft = L / 12
        return Number((L / 12).toFixed(4));
      }

      case "cft": {
        // length, width, height in inches -> cft = (L * W * H) / 1728
        return Number(((L * W * H) / 1728).toFixed(4));
      }

      case "nos":
      default:
        return Q || 0;
    }
  };

  const calculateTotal = ({ measure, rate, length, width, height, qty }) => {
    const R = toNum(rate);
    const size = calculateSize({ measure, length, width, height, qty });
    return Number((size * R).toFixed(2));
  };
  const updateRow = (id, key, value) =>
    setItems((s) =>
      s.map((it) =>
        it.id === id
          ? {
              ...it,
              [key]: value,
              total:
                key === "size" || key === "rate"
                  ? Number(it.size || 0) * Number(it.rate || 0)
                  : it.total,
            }
          : it
      )
    );

  const grandTotal = items.reduce((a, b) => a + (b.total || 0), 0);
  let roomName = "Master Badroom";
  const generatePDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const marginLeft = 40;
    doc.setFontSize(18);
    doc.setTextColor(20);
    doc.text("Business Name", marginLeft, 50);
    doc.setFillColor(COLORS.primary);
    doc.rect(marginLeft, 70, 520, 28, "F");
    doc.setTextColor("#fff");
    doc.setFontSize(14);
    doc.text("QUOTATION", marginLeft + 10, 90);
    doc.setTextColor("#000");
    doc.setFontSize(10);
    doc.text(`Date: ${customer.date || "-"}`, marginLeft, 110);
    doc.text(`Customer: ${customer.name || "-"}`, marginLeft, 125);
    doc.text(`Phone: ${customer.phone || "-"}`, marginLeft, 140);
    doc.text(`Address: ${customer.address || "-"}`, marginLeft, 155);

    const tableBody = items.map((it, idx) => [
      idx + 1,
      it.name,
      it.size + " " + it.measure,
      it.rate.toFixed(2),
      it.total.toFixed(2),
    ]);
    autoTable(doc, {
      startY: 185,
      head: [["#", "Item", "Qty", "Rate", "Total"]],
      body: tableBody,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 143, 138] },
    });

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 220;
    doc.setFillColor("#f1f8e9"); // light green
    doc.rect(marginLeft, finalY, 520, 40, "F");

    doc.setTextColor("#000");
    doc.setFontSize(12);
    doc.text(
      `Grand Total: ₹ ${grandTotal.toFixed(2)}`,
      marginLeft + 350,
      finalY + 25
    );

    doc.save(`quotation_${new Date().getTime()}.pdf`);
  };
  console.log(items);
  const drawer = (
    <Box sx={{ height: "100%", bgcolor: COLORS.primary, color: "#fff" }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Billing App
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Fast • Modern • Responsive
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
      <List>
        <ListItem button>
          <ListItemIcon sx={{ color: "#fff" }}>
            <ReceiptLong />
          </ListItemIcon>
          <ListItemText primary="Create Bill" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AddItemDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: COLORS.bg }}>
          <AppBar
            position="fixed"
            elevation={3}
            sx={{ bgcolor: COLORS.primary }}
          >
            <Toolbar>
              {!isMdUp && (
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Item Billing System
              </Typography>
              <Button
                variant="contained"
                startIcon={<PictureAsPdf />}
                onClick={generatePDF}
                sx={{
                  bgcolor: "#fff",
                  color: COLORS.primary,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#f3f3f3" },
                }}
              >
                Export PDF
              </Button>
            </Toolbar>
          </AppBar>

          {/* Responsive drawer */}
          <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          >
            {isMdUp ? (
              <Drawer
                variant="permanent"
                open
                sx={{
                  "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                  },
                }}
              >
                {drawer}
              </Drawer>
            ) : (
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}
              >
                {drawer}
              </Drawer>
            )}
          </Box>

          <Box
            component="main"
            sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, mt: 8 }}
          >
            <Container maxWidth="lg">
              <Grid container spacing={2}>
                <Grid size={12}>
                  <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Customer Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Customer Name"
                          value={customer.name}
                          onChange={(e) =>
                            setCustomer({ ...customer, name: e.target.value })
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Phone"
                          value={customer.phone}
                          onChange={(e) =>
                            setCustomer({ ...customer, phone: e.target.value })
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Date"
                          type="date"
                          value={customer.date}
                          onChange={(e) =>
                            setCustomer({ ...customer, date: e.target.value })
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Address"
                          value={customer.address}
                          onChange={(e) =>
                            setCustomer({
                              ...customer,
                              address: e.target.value,
                            })
                          }
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Add Item Card */}
                <Grid size={12}>
                  <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Add Item
                    </Typography>

                    <Grid container spacing={2} alignItems="center">
                      <Grid size={12} display="flex" justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => setIsOpen(true)}
                          sx={{ bgcolor: COLORS.primary }}
                        >
                          Add New Item
                        </Button>
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                          size="small"
                          fullWidth
                          select
                          label="Select item from list"
                          value={customItem.name}
                          onChange={(e) => handleMasterSelect(e.target.value)}
                        >
                          <MenuItem value="">— Choose —</MenuItem>
                          {itemMaster.map((it) => (
                            <MenuItem key={it.name} value={it.name}>
                              {it.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid container spacing={2}>
                        {/* Measurement Type */}
                        <Grid item xs={12} md={3}>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            label="Measure"
                            value={customItem.measure}
                            onChange={(e) =>
                              setCustomItem((s) => ({
                                ...s,
                                measure: e.target.value,
                                length: "",
                                width: "",
                                height: "",
                                qty: "",
                              }))
                            }
                          >
                            <MenuItem value="nos">Nos</MenuItem>
                            <MenuItem value="sqft">Sqft</MenuItem>
                            <MenuItem value="rft">Rft</MenuItem>
                            <MenuItem value="cft">Cft</MenuItem>
                          </TextField>
                        </Grid>

                        {/* Length (for sqft / rft / cft) */}
                        {(customItem.measure === "sqft" ||
                          customItem.measure === "rft" ||
                          customItem.measure === "cft") && (
                          <Grid item xs={12} md={2}>
                            <TextField
                              size="small"
                              fullWidth
                              label="Length (inch)"
                              value={customItem.length}
                              onChange={(e) =>
                                setCustomItem({
                                  ...customItem,
                                  length: e.target.value,
                                })
                              }
                            />
                          </Grid>
                        )}

                        {/* Width (for sqft / cft) */}
                        {(customItem.measure === "sqft" ||
                          customItem.measure === "cft") && (
                          <Grid item xs={12} md={2}>
                            <TextField
                              size="small"
                              fullWidth
                              label="Width (inch)"
                              value={customItem.width}
                              onChange={(e) =>
                                setCustomItem({
                                  ...customItem,
                                  width: e.target.value,
                                })
                              }
                            />
                          </Grid>
                        )}

                        {/* Height (for cft only) */}
                        {customItem.measure === "cft" && (
                          <Grid item xs={12} md={2}>
                            <TextField
                              size="small"
                              fullWidth
                              label="Height (inch)"
                              value={customItem.height}
                              onChange={(e) =>
                                setCustomItem({
                                  ...customItem,
                                  height: e.target.value,
                                })
                              }
                            />
                          </Grid>
                        )}

                        {/* Quantity (for NOS only) */}
                        {customItem.measure === "nos" && (
                          <Grid item xs={12} md={2}>
                            <TextField
                              size="small"
                              fullWidth
                              label="Qty"
                              type="number"
                              value={customItem.qty}
                              onChange={(e) =>
                                setCustomItem({
                                  ...customItem,
                                  qty: e.target.value,
                                })
                              }
                            />
                          </Grid>
                        )}
                      </Grid>

                      {/* <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Item Name"
                          value={customItem.name}
                          onChange={(e) =>
                            setCustomItem((s) => ({
                              ...s,
                              name: e.target.value,
                            }))
                          }
                        /> */}
                      {/* </Grid> */}

                      {/* <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Quantity/Size"
                          value={customItem.size}
                          onChange={(e) =>
                            setCustomItem((s) => ({
                              ...s,
                              size: e.target.value,
                            }))
                          }
                        />
                      </Grid> */}

                      <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Rate"
                          value={customItem.rate}
                          onChange={(e) =>
                            setCustomItem((s) => ({
                              ...s,
                              rate: e.target.value,
                            }))
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 2 }}>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Add />}
                          fullWidth
                          onClick={addItem}
                          sx={{ bgcolor: COLORS.primary }}
                        >
                          Add Item
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Items Table */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Item List
                    </Typography>

                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Item</TableCell>
                          <TableCell>Qty / Size</TableCell> {/* UPDATED */}
                          <TableCell>Rate</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {items.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              align="center"
                              sx={{ py: 4, opacity: 0.7 }}
                            >
                              No items added — use the panel above to add
                              products.
                            </TableCell>
                          </TableRow>
                        )}

                        {items.map((row, idx) => (
                          <TableRow key={row.id}>
                            <TableCell>{idx + 1}</TableCell>

                            {/* ITEM NAME */}
                            <TableCell sx={{ width: 220 }}>
                              {editId === row.id ? (
                                <TextField
                                  value={row.name}
                                  onChange={(e) =>
                                    updateRow(row.id, "name", e.target.value)
                                  }
                                  fullWidth
                                />
                              ) : (
                                row.name
                              )}
                            </TableCell>

                            {/* ---------------- UPDATED QTY / SIZE COLUMN ---------------- */}
                            <TableCell>
                              {editId === row.id ? (
                                <>
                                  {/* NOS → QTY */}
                                  {row.measure === "nos" && (
                                    <TextField
                                      value={row.qty}
                                      onChange={(e) =>
                                        updateRow(
                                          row.id,
                                          "qty",
                                          Number(e.target.value)
                                        )
                                      }
                                      type="number"
                                      size="small"
                                    />
                                  )}

                                  {/* SQFT → L & W */}
                                  {row.measure === "sqft" && (
                                    <Stack direction="row" spacing={1}>
                                      <TextField
                                        label="L (in)"
                                        value={row.length}
                                        type="number"
                                        size="small"
                                        onChange={(e) =>
                                          updateRow(
                                            row.id,
                                            "length",
                                            Number(e.target.value)
                                          )
                                        }
                                        sx={{ width: 80 }}
                                      />
                                      <TextField
                                        label="W (in)"
                                        value={row.width}
                                        type="number"
                                        size="small"
                                        onChange={(e) =>
                                          updateRow(
                                            row.id,
                                            "width",
                                            Number(e.target.value)
                                          )
                                        }
                                        sx={{ width: 80 }}
                                      />
                                    </Stack>
                                  )}

                                  {/* RFT → ONLY LENGTH */}
                                  {row.measure === "rft" && (
                                    <TextField
                                      label="L (in)"
                                      value={row.length}
                                      type="number"
                                      size="small"
                                      onChange={(e) =>
                                        updateRow(
                                          row.id,
                                          "length",
                                          Number(e.target.value)
                                        )
                                      }
                                      sx={{ width: 100 }}
                                    />
                                  )}

                                  {/* CFT → L W H */}
                                  {row.measure === "cft" && (
                                    <Stack direction="row" spacing={1}>
                                      <TextField
                                        label="L (in)"
                                        value={row.length}
                                        type="number"
                                        size="small"
                                        onChange={(e) =>
                                          updateRow(
                                            row.id,
                                            "length",
                                            Number(e.target.value)
                                          )
                                        }
                                        sx={{ width: 70 }}
                                      />
                                      <TextField
                                        label="W (in)"
                                        value={row.width}
                                        type="number"
                                        size="small"
                                        onChange={(e) =>
                                          updateRow(
                                            row.id,
                                            "width",
                                            Number(e.target.value)
                                          )
                                        }
                                        sx={{ width: 70 }}
                                      />
                                      <TextField
                                        label="H (in)"
                                        value={row.height}
                                        type="number"
                                        size="small"
                                        onChange={(e) =>
                                          updateRow(
                                            row.id,
                                            "height",
                                            Number(e.target.value)
                                          )
                                        }
                                        sx={{ width: 70 }}
                                      />
                                    </Stack>
                                  )}
                                </>
                              ) : (
                                <>
                                  {/* DISPLAY MODE */}

                                  {row.measure === "nos" && (
                                    <span>{row.qty} Nos</span>
                                  )}

                                  {row.measure === "sqft" && (
                                    <span>
                                      {row.size} sqft
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        (L×W: {row.length}in × {row.width}in)
                                      </Typography>
                                    </span>
                                  )}

                                  {row.measure === "rft" && (
                                    <span>
                                      {row.size} rft
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        (L: {row.length}in)
                                      </Typography>
                                    </span>
                                  )}

                                  {row.measure === "cft" && (
                                    <span>
                                      {row.size} cft
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        (L×W×H: {row.length} × {row.width} ×{" "}
                                        {row.height} in)
                                      </Typography>
                                    </span>
                                  )}
                                </>
                              )}
                            </TableCell>

                            {/* RATE */}
                            <TableCell>
                              {editId === row.id ? (
                                <TextField
                                  value={row.rate}
                                  onChange={(e) =>
                                    updateRow(
                                      row.id,
                                      "rate",
                                      Number(e.target.value)
                                    )
                                  }
                                  type="number"
                                  inputProps={{ min: 0 }}
                                />
                              ) : (
                                `₹ ${row.rate}`
                              )}
                            </TableCell>

                            {/* TOTAL */}
                            <TableCell>₹ {row.total.toFixed(2)}</TableCell>

                            {/* ACTION BUTTONS */}
                            <TableCell align="center">
                              {editId === row.id ? (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  justifyContent="center"
                                >
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => saveEdit(row.id, row)}
                                  >
                                    <Save />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => setEditId(null)}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Stack>
                              ) : (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  justifyContent="center"
                                >
                                  <IconButton
                                    color="inherit"
                                    size="small"
                                    onClick={() => startEdit(row.id)}
                                  >
                                    <Edit />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => removeItem(row.id)}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Stack>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>

                {/* Totals & Actions */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Summary
                    </Typography>

                    <Grid container spacing={1}>
                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Subtotal
                        </Typography>
                      </Grid>
                      <Grid size={6} sx={{ textAlign: "right" }}>
                        <Typography variant="body1">
                          ₹ {grandTotal.toFixed(2)}
                        </Typography>
                      </Grid>

                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Discount
                        </Typography>
                      </Grid>
                      <Grid size={6} sx={{ textAlign: "right" }}>
                        <Typography variant="body1">₹ 0.00</Typography>
                      </Grid>

                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Tax (GST)
                        </Typography>
                      </Grid>
                      <Grid size={6} sx={{ textAlign: "right" }}>
                        <Typography variant="body1">₹ 0.00</Typography>
                      </Grid>

                      <Grid size={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>

                      <Grid size={12}>
                        <Typography variant="h6">Grand Total</Typography>
                      </Grid>
                      <Grid size={5} sx={{ textAlign: "right" }}>
                        <Typography variant="h6" sx={{ color: COLORS.primary }}>
                          ₹ {grandTotal.toFixed(2)}
                        </Typography>
                      </Grid>

                      <Grid size={12} sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          startIcon={<PictureAsPdf />}
                          sx={{ bgcolor: COLORS.primary }}
                          onClick={generatePDF}
                        >
                          Generate PDF
                        </Button>
                      </Grid>

                      <Grid size={6} sx={{ mt: 1 }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          color="secondary"
                          startIcon={<ReceiptLong />}
                        >
                          Save Invoice
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
