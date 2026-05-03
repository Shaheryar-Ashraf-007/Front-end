import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  Box, Typography, Fade, IconButton, Divider,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Launch } from "@mui/icons-material";

// ── Static dropdown options ────────────────────────────────────────────────────

const IPHONE_MODELS = [
  // iPhone 16 Series
  "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
  // iPhone 15 Series
  "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
  // iPhone 14 Series
  "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
  // iPhone 13 Series
  "iPhone 13", "iPhone 13 Mini", "iPhone 13 Pro", "iPhone 13 Pro Max",
  // iPhone 12 Series
  "iPhone 12", "iPhone 12 Mini", "iPhone 12 Pro", "iPhone 12 Pro Max",
  // iPhone 11 Series
  "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
  // Older
  "iPhone XS", "iPhone XS Max", "iPhone XR", "iPhone X",
  "iPhone SE (3rd Gen)", "iPhone SE (2nd Gen)",
  "Other",
];

const IPHONE_COLORS = [
  // iPhone 16 Pro Colors
  "Black Titanium", "White Titanium", "Natural Titanium", "Desert Titanium",
  // iPhone 16 Colors
  "Ultramarine", "Teal", "Pink", "White", "Black",
  // iPhone 15 Pro Colors
  "Blue Titanium", "Natural Titanium (15)", "White Titanium (15)", "Black Titanium (15)",
  // iPhone 15 Colors
  "Black (15)", "Blue (15)", "Green (15)", "Yellow (15)", "Pink (15)",
  // iPhone 14 Colors
  "Midnight", "Starlight", "Blue (14)", "Purple (14)", "Red (14)", "Yellow (14)",
  // iPhone 13 Colors
  "Midnight (13)", "Starlight (13)", "Blue (13)", "Pink (13)", "Green (13)", "Red (13)",
  // iPhone 12 Colors
  "Black (12)", "White (12)", "Red (12)", "Green (12)", "Blue (12)", "Purple (12)",
  // Classic
  "Space Gray", "Silver", "Gold", "Rose Gold",
  "Other",
];

const CATEGORIES = [
  { label: "📱 Mobile / Smartphone", value: "Mobile" },
  { label: "⌚ Watch", value: "Watch" },
  { label: "🎧 AirBuds / Earbuds", value: "AirBuds" },
  { label: "💻 Tablet / iPad", value: "Tablet" },
  { label: "💻 Laptop", value: "Laptop" },
  { label: "📷 Camera & Accessories", value: "Camera" },
  { label: "🔋 Power Bank", value: "PowerBank" },
  { label: "🖥️ Monitor / Display", value: "Monitor" },
  { label: "⌨️ Keyboard & Mouse", value: "KeyboardMouse" },
  { label: "🔌 Charger & Cables", value: "ChargerCables" },
  { label: "🛡️ Cases & Covers", value: "Cases" },
  { label: "🔊 Speaker", value: "Speaker" },
  { label: "📦 Other Accessories", value: "Accessories" },
];

// ── Reusable dropdown sx ───────────────────────────────────────────────────────
const dropdownSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "&:hover fieldset": { borderColor: "#667eea" },
    "&.Mui-focused fieldset": { borderColor: "#667eea" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#667eea" },
};

// ── Component ──────────────────────────────────────────────────────────────────

const CreateProductModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [rating, setRating] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let { width, height } = img;
        const maxSize = 800;

        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        setImagePreview(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!name || !stockQuantity || !price) {
      alert("Product Name, Stock Quantity, and Unit Cost are required!");
      return;
    }

    let imageUrl = null;
    if (imageFile) {
      try {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }

    onCreate({
      name,
      stockQuantity: parseInt(stockQuantity, 10),
      price: parseFloat(price),
      model: model || undefined,
      color: color || undefined,
      description: description || undefined,
      rating: rating ? parseFloat(rating) : undefined,
      category: category || undefined,
      imageUrl,
      isVerified,
    });

    // Reset
    setName(""); setStockQuantity(""); setPrice(""); setModel("");
    setColor(""); setDescription(""); setRating(""); setCategory("");
    setImageFile(null); setImagePreview(null); setIsVerified(false);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Fade in={isOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            width: "90%",
            maxWidth: 520,
            maxHeight: "90vh",
            overflowY: "auto",
            outline: "none",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {/* ── Header ── */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              p: 3,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              position: "relative",
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute", right: 8, top: 8, color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h5" sx={{ color: "white", fontWeight: 600, textAlign: "center", letterSpacing: "-0.5px" }}>
              Create New Product
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", textAlign: "center", mt: 0.5 }}>
              Add a new item to your inventory
            </Typography>
          </Box>

          {/* ── Form ── */}
          <Box sx={{ p: 4 }}>

            {/* Section: Verification */}
            <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 600, mb: 2, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.5px" }}>
              Verification
            </Typography>

            <FormControl fullWidth margin="normal" sx={dropdownSx}>
              <InputLabel>Verification Status</InputLabel>
              <Select
                value={isVerified}
                label="Verification Status"
                onChange={(e) => setIsVerified(e.target.value)}
              >
                <MenuItem value={true}>✅ Verified by PTA</MenuItem>
                <MenuItem value={false}>❌ Non-Verified</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mt: 1, mb: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                { label: "Check IMEI on PTA (DIRBS)", url: "https://dirbs.pta.gov.pk/" },
                { label: "Check IMEI on Punjab Police", url: "https://punjabpolice.gov.pk/e-Gadget" },
              ].map(({ label, url }) => (
                <Button
                  key={label}
                  fullWidth
                  variant="outlined"
                  startIcon={<Launch />}
                  onClick={() => window.open(url, "_blank")}
                  sx={{
                    py: 1.3, borderRadius: 2, textTransform: "none", fontWeight: 600,
                    borderColor: "#0f766e", color: "#0f766e",
                    "&:hover": { borderColor: "#115e59", bgcolor: "rgba(15,118,110,0.05)" },
                  }}
                >
                  {label}
                </Button>
              ))}
              <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center" }}>
                Verify IMEI on external sites, then set status above
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Section: Product Image */}
            <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 600, mb: 2, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.5px" }}>
              Product Image
            </Typography>

            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{
                py: 1.5, borderRadius: 2, borderStyle: "dashed", borderWidth: 2,
                borderColor: imageFile ? "#667eea" : "divider",
                color: imageFile ? "#667eea" : "text.secondary",
                bgcolor: imageFile ? "rgba(102,126,234,0.05)" : "transparent",
                "&:hover": { borderColor: "#667eea", bgcolor: "rgba(102,126,234,0.05)" },
              }}
            >
              {imageFile ? "Change Image" : "Upload Image"}
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>

            {imagePreview && (
              <Box sx={{ mt: 2, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "grey.50" }}>
                <img src={imagePreview} alt="Preview" style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 8 }} />
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Section: Product Details */}
            <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 600, mb: 2, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.5px" }}>
              Product Details
            </Typography>

            <TextField
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required fullWidth margin="normal" sx={dropdownSx}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Stock Quantity" type="number"
                value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)}
                required fullWidth margin="normal" sx={dropdownSx}
              />
              <TextField
                label="Unit Cost" type="number"
                value={price} onChange={(e) => setPrice(e.target.value)}
                required fullWidth margin="normal" sx={dropdownSx}
              />
            </Box>

            {/* ── Model Dropdown ── */}
            <FormControl fullWidth margin="normal" sx={dropdownSx}>
              <InputLabel>iPhone Model</InputLabel>
              <Select
                value={model}
                label="iPhone Model"
                onChange={(e) => setModel(e.target.value)}
                MenuProps={{ PaperProps: { style: { maxHeight: 260 } } }}
              >
                <MenuItem value=""><em>— Select Model —</em></MenuItem>
                {IPHONE_MODELS.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ── Color Dropdown ── */}
            <FormControl fullWidth margin="normal" sx={dropdownSx}>
              <InputLabel>Color</InputLabel>
              <Select
                value={color}
                label="Color"
                onChange={(e) => setColor(e.target.value)}
                MenuProps={{ PaperProps: { style: { maxHeight: 260 } } }}
                renderValue={(val) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{
                      width: 14, height: 14, borderRadius: "50%",
                      bgcolor: colorHex(val),
                      border: "1px solid rgba(0,0,0,0.15)",
                      flexShrink: 0,
                    }} />
                    {val}
                  </Box>
                )}
              >
                <MenuItem value=""><em>— Select Color —</em></MenuItem>
                {IPHONE_COLORS.map((c) => (
                  <MenuItem key={c} value={c}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box sx={{
                        width: 14, height: 14, borderRadius: "50%",
                        bgcolor: colorHex(c),
                        border: "1px solid rgba(0,0,0,0.15)",
                        flexShrink: 0,
                      }} />
                      {c}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ── Category Dropdown ── */}
            <FormControl fullWidth margin="normal" sx={dropdownSx}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
                MenuProps={{ PaperProps: { style: { maxHeight: 260 } } }}
              >
                <MenuItem value=""><em>— Select Category —</em></MenuItem>
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            {/* Section: Optional */}
            <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 600, mb: 2, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.5px" }}>
              Optional Information
            </Typography>

            <TextField
              label="Description (Optional)" value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth margin="normal" multiline rows={3} sx={dropdownSx}
            />

            <TextField
              label="Rating (Optional)" type="number" value={rating}
              onChange={(e) => setRating(e.target.value)}
              fullWidth margin="normal"
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              sx={dropdownSx}
            />

            {/* ── Action Buttons ── */}
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                onClick={handleSubmit}
                variant="contained" fullWidth
                sx={{
                  py: 1.5, borderRadius: 2, textTransform: "none", fontSize: "1rem", fontWeight: 600,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5568d3 0%, #653a8b 100%)",
                    boxShadow: "0 6px 16px rgba(102,126,234,0.4)",
                  },
                }}
              >
                Create Product
              </Button>
              <Button
                onClick={onClose}
                variant="outlined" fullWidth
                sx={{
                  py: 1.5, borderRadius: 2, borderColor: "divider", color: "text.secondary",
                  textTransform: "none", fontSize: "1rem", fontWeight: 600,
                  "&:hover": { borderColor: "text.secondary", bgcolor: "grey.50" },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

// ── Color → hex helper (best-effort visual dot) ────────────────────────────────
function colorHex(name = "") {
  const map = {
    black: "#1c1c1e", white: "#f5f5f7", silver: "#c0c0c0", gold: "#f5d78e",
    "rose gold": "#e8b4a0", midnight: "#1c2340", starlight: "#f2ead8",
    blue: "#4a90d9", purple: "#9b59b6", red: "#e74c3c", green: "#27ae60",
    yellow: "#f1c40f", pink: "#f48fb1", teal: "#1abc9c", ultramarine: "#3f51b5",
    titanium: "#8e8e93", "space gray": "#4a4a4a", natural: "#c8bca8",
    desert: "#c8a97e", other: "#bdbdbd",
  };
  const key = name.toLowerCase().split(" ")[0];
  return map[key] || map[name.toLowerCase()] || "#bdbdbd";
}

export default CreateProductModal;