"use client";

import { useGetProductsQuery, useCreateProductsMutation, useDeleteProductMutation } from "@/state/api";
import { PlusCircleIcon, SearchIcon, TrashIcon, Download, Package, AlertCircle } from "lucide-react";
import { useState } from "react";
import Header from "@/app/[components]/Header";
import Ratings from "@/app/[components]/Ratings";
import CreateProductModal from "./CreateProductModal";
import * as XLSX from 'xlsx';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: products, isLoading, isError, refetch } = useGetProductsQuery(searchTerm);
  const [createProduct, { isError: createProductError }] = useCreateProductsMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleCreateProduct = async (productData) => {
    setIsCreatingProduct(true);
    console.log('=== Starting product creation ===');
    console.log('Product data received:', productData);
    console.log('Product data type:', typeof productData);
    console.log('Product data keys:', Object.keys(productData || {}));
    
    try {
      console.log('Calling createProduct mutation...');
      const result = await createProduct(productData).unwrap();
      console.log('✅ Product created successfully:', result);
      setIsModalOpen(false);
      setErrorMessage("");
      refetch(); 
    } catch (error) {
      console.error('❌ Failed to create product');
      console.error('Error object:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error || {}));
      console.error('Error.status:', error?.status);
      console.error('Error.data:', error?.data);
      console.error('Error.message:', error?.message);
      console.error('Error.error:', error?.error);
      
      // Try to extract a meaningful error message
      let errorMsg = "Failed to create product. Please try again.";
      if (error?.data?.message) {
        errorMsg = error.data.message;
      } else if (error?.message) {
        errorMsg = error.message;
      } else if (error?.error) {
        errorMsg = error.error;
      } else if (error?.status) {
        errorMsg = `API Error: ${error.status}`;
      }
      
      setErrorMessage(errorMsg);
      alert(errorMsg); // Temporary alert to show error immediately
    } finally {
      setIsCreatingProduct(false);
      console.log('=== Product creation completed ===');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      setErrorMessage("Invalid product ID");
      return;
    }
  
    try {
      setDeletingProductId(productId);
      console.log('Attempting to delete product with ID:', productId);
      await deleteProduct(productId).unwrap();
      console.log("delete successfully")
      refetch();
      setErrorMessage(""); 
    } catch (error) {
      console.error('Delete error details:', error);
      setErrorMessage(error?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingProductId(false);
    }
  };

  // Excel export function
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(products);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "Products.xlsx");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isError || !products) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-semibold mb-2">Failed to fetch products</p>
          <p className="text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="mx-auto pb-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm animate-pulse">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700 font-medium">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* HEADER BAR */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Header name="Products" />
              <p className="text-gray-500 text-sm mt-1">Manage your inventory and products</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className="flex items-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={() => setIsModalOpen(true)}
                disabled={isCreatingProduct}
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" /> 
                {isCreatingProduct ? 'Creating...' : 'Create Product'}
              </button>
              <button
                className="flex items-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={exportToExcel}
              >
                <Download className="w-5 h-5 mr-2" />
                Export to Excel
              </button>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="mt-6">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                className="w-full py-3 pl-12 pr-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Search products by name, model, or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
                <p className="text-gray-500 mb-6">Try a different search term or create a new product.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <PlusCircleIcon className="w-5 h-5 mr-2" />
                  Create Your First Product
                </button>
              </div>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.productId}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
              >
                <div className="p-6">


                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                     
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {product.model && (
                          <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg font-medium">
                            {product.model}
                          </span>
                        )}
                        {product.color && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium">
                            {product.color}
                          </span>
                        )}

                        <div className="ml-28">
                    {product.isVerified ? (
                      <span className="px-2 py-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        Verified by PTA
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                        Non-Verified
                      </span>
                    )}
                  </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Description */}
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Price and Stock */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Price</p>
                      <p className="text-2xl font-bold text-purple-600">
                        Rs {product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Stock</p>
                      <p className={`text-lg font-semibold ${
                        product.stockQuantity > 10 
                          ? 'text-green-600' 
                          : product.stockQuantity > 0 
                          ? 'text-orange-600' 
                          : 'text-red-600'
                      }`}>
                        {product.stockQuantity} units
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  {product.rating && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <Ratings rating={product.rating} />
                        <span className="text-sm text-gray-600 font-medium">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteProduct(product.productId)}
                    disabled={deletingProductId === product.productId}
                    className={`w-full flex items-center justify-center ${
                      deletingProductId === product.productId
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                    } text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none`}
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    {deletingProductId === product.productId ? 'Deleting...' : 'Delete Product'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
        isCreating={isCreatingProduct}
        error={createProductError}
      />
    </div>
  );
};

export default Products;