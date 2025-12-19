import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
  try {
    const search = req.query.search?.toString() || '';
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      rating,
      stockQuantity,
      description,
      model,
      color,
      category,
      imageUrl
    } = req.body;

    // Validate required fields
    if (!name || !price || !stockQuantity) {
      return res.status(400).json({ 
        message: "Name, price, and stock quantity are required" 
      });
    }

    const product = await prisma.products.create({
      data: {
        name,
        price: parseFloat(price),
        rating: rating ? parseFloat(rating) : null,
        stockQuantity: parseInt(stockQuantity),
        description: description || null,
        imageUrl: imageUrl || null,
        model: model || null,
        color: color || null,
        category: category || 'Uncategorized'
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const deletedProduct = await prisma.products.delete({
      where: { productId },
    });
    res.status(200).json(deletedProduct);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: error?.message || "Failed to delete product" });
  }
};
