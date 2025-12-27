export const toggleProductVerification = async (req, res) => {
  try {
    const { productId, isVerified } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID required" });
    }

    const updatedProduct = await prisma.products.update({
      where: { productId },
      data: { isVerified },
    });

    res.json({
      success: true,
      message: isVerified
        ? "Product marked as VERIFIED"
        : "Product marked as NON-VERIFIED",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};
