import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box, Typography, Fade, IconButton, Divider, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Launch } from "@mui/icons-material";

const CreatePurchaseModal = ({ isOpen, onClose, onCreate }) => {
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
    const [isVerified, setIsVerified] = useState(false); // NEW STATE


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create compressed preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 800px width/height)
          let width = img.width;
          let height = img.height;
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
          
          // Convert to base64 with compression
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setImagePreview(compressedDataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!name || !stockQuantity || !price) {
      alert("Product Name, Stock Quantity, and Unit Cost are required!");
      return;
    }

    // Convert image to base64 if exists
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

    const productData = {
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

    };

    onCreate(productData);
    
    // Reset form
    setName("");
    setStockQuantity("");
    setPrice("");
    setModel("");
    setColor("");
    setDescription("");
    setRating("");
    setCategory("");
    setImageFile(null);
    setImagePreview(null);
    setIsVerified(false); 

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
          {/* Header */}
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
                position: "absolute",
                right: 8,
                top: 8,
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                color: "white",
                fontWeight: 600,
                textAlign: "center",
                letterSpacing: "-0.5px",
              }}
            >
              Create New Product
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.9)",
                textAlign: "center",
                mt: 0.5,
              }}
            >
              Add a new item to your inventory
            </Typography>
          </Box>

          {/* Form Content */}
          <Box sx={{ p: 4 }}>
            {/* Product Details Section */}
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                mb: 2,
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.5px",
              }}
            >
              Product Details
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel id="verified-label">Verification Status</InputLabel>
              <Select
                labelId="verified-label"
                value={isVerified}
                label="Verification Status"
                onChange={(e) => setIsVerified(e.target.value)}
              >
                <MenuItem value={true}>Verified</MenuItem>
                <MenuItem value={false}>Non-Verified</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mt: 1, mb: 3 }}>
  <Button
    fullWidth
    variant="outlined"
    startIcon={<Launch />}
    onClick={() => window.open("https://dirbs.pta.gov.pk/", "_blank")}
    sx={{
      py: 1.3,
      borderRadius: 2,
      textTransform: "none",
      fontWeight: 600,
      borderColor: "#0f766e",
      color: "#0f766e",
      "&:hover": {
        borderColor: "#115e59",
        bgcolor: "rgba(15, 118, 110, 0.05)",
      },
    }}
  >
    Check IMEI on PTA (DIRBS)
  </Button>

  <Typography
    variant="caption"
    sx={{
      display: "block",
      mt: 1,
      color: "text.secondary",
      textAlign: "center",
    }}
  >
    Open PTA website, verify IMEI manually, then select status above
  </Typography>
</Box>



             <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                mb: 2,
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.5px",
              }}
            >
              Product Image
            </Typography>

            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: imageFile ? "#667eea" : "divider",
                color: imageFile ? "#667eea" : "text.secondary",
                bgcolor: imageFile ? "rgba(102, 126, 234, 0.05)" : "transparent",
                "&:hover": {
                  borderColor: "#667eea",
                  bgcolor: "rgba(102, 126, 234, 0.05)",
                },
              }}
            >
              {imageFile ? "Change Image" : "Upload Image"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {imagePreview && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  bgcolor: "grey.50",
                }}
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <TextField
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#667eea" },
                  "&.Mui-focused fieldset": { borderColor: "#667eea" },
                },
              }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Stock Quantity"
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": { borderColor: "#667eea" },
                    "&.Mui-focused fieldset": { borderColor: "#667eea" },
                  },
                }}
              />

              <TextField
                label="Unit Cost"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": { borderColor: "#667eea" },
                    "&.Mui-focused fieldset": { borderColor: "#667eea" },
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": { borderColor: "#667eea" },
                    "&.Mui-focused fieldset": { borderColor: "#667eea" },
                  },
                }}
              />

              <TextField
                label="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": { borderColor: "#667eea" },
                    "&.Mui-focused fieldset": { borderColor: "#667eea" },
                  },
                }}
              />
            </Box>

            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#667eea" },
                  "&.Mui-focused fieldset": { borderColor: "#667eea" },
                },
              }}
            />

            <Divider sx={{ my: 3 }} />

            {/* Image Upload Section */}
           

            {/* Optional Information Section */}
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                mb: 2,
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.5px",
              }}
            >
              Optional Information
            </Typography>

            <TextField
              label="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#667eea" },
                  "&.Mui-focused fieldset": { borderColor: "#667eea" },
                },
              }}
            />

            <TextField
              label="Rating (Optional)"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": { borderColor: "#667eea" },
                  "&.Mui-focused fieldset": { borderColor: "#667eea" },
                },
              }}
            />

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5568d3 0%, #653a8b 100%)",
                    boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
                  },
                }}
              >
                Create Product
              </Button>
              <Button
                onClick={onClose}
                variant="outlined"
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: "divider",
                  color: "text.secondary",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "text.secondary",
                    bgcolor: "grey.50",
                  },
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

export default CreatePurchaseModal;