"use client";

import React from 'react';
import { useGetProductsQuery } from "@/state/api";
import Header from "@/app/[components]/Header";
import { ErrorBoundary } from 'react-error-boundary';
import { DataGrid } from "@mui/x-data-grid";
import { Package, TrendingUp, Calendar, Tag, AlertCircle, BarChart3 } from 'lucide-react';

const ErrorFallback = ({ error }) => (
  <div className="flex items-center justify-center p-8 bg-red-50 rounded-2xl border border-red-200">
    <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
    <span className="text-red-700 font-medium">Error: {error.message}</span>
  </div>
);

const LoadingComponent = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
      <p className="text-gray-600 text-lg font-medium">Loading inventory...</p>
    </div>
  </div>
);

const ErrorComponent = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
    <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p className="text-red-600 text-lg font-semibold mb-2">Failed to fetch inventory</p>
      <p className="text-gray-500">Please try again later</p>
    </div>
  </div>
);

const ImagePreviewModal = ({ isOpen, onClose, imageUrl, productName }) => {
  const [scale, setScale] = React.useState(1);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => setScale(1);

  React.useEffect(() => {
    if (isOpen) {
      setScale(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-6xl max-h-[90vh] w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Product Name */}
        {productName && (
          <div className="absolute -top-12 left-0 text-white font-semibold text-lg">
            {productName}
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex gap-2 bg-white rounded-lg shadow-lg p-2 z-10">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom Out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 hover:bg-gray-100 rounded transition-colors text-sm font-medium"
            title="Reset Zoom"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom In"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
        </div>

        {/* Image Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-auto max-h-[80vh] flex items-center justify-center p-8 bg-gray-50">
            <img
              src={imageUrl}
              alt={productName || "Product"}
              style={{
                transform: `scale(${scale})`,
                transition: 'transform 0.2s ease-in-out',
                maxWidth: '100%',
                height: 'auto',
              }}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center text-white text-sm mt-4 opacity-75">
          Click outside to close • Use zoom controls to adjust size
        </div>
      </div>
    </div>
  );
};

const DataGridComponent = ({ products, onImageClick }) => {
  const columns = [
    { 
      field: "serialNo", 
      headerName: "S.No", 
      width: 80,
      headerAlign: 'center',
      align: 'center',
    },
    { 
      field: "image", 
      headerName: "Image", 
      width: 100,
      renderCell: (params) => {
        const imageUrl = params.value;
        const productName = params.row.name;
        return (
          <div className="flex items-center justify-center h-full">
            {imageUrl ? (
              <div 
                onClick={() => onImageClick(imageUrl, productName)}
                className="cursor-pointer transform hover:scale-110 transition-transform duration-200"
              >
                <img
                  src={imageUrl}
                  alt="Product"
                  className="w-14 h-14 rounded-lg object-cover shadow-md hover:shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center" style={{ display: 'none' }}>
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            ) : (
              <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
        );
      },
    },
    { 
      field: "name", 
      headerName: "Product Name", 
      width: 200,
      renderCell: (params) => (
        <div className="font-semibold text-gray-900">{params.value}</div>
      ),
    },
    { 
      field: "model", 
      headerName: "Model", 
      width: 140,
      renderCell: (params) => (
        params.value ? (
          <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg font-medium text-sm">
            {params.value}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">N/A</span>
        )
      ),
    },
    { 
      field: "color", 
      headerName: "Color", 
      width: 120,
      renderCell: (params) => (
        params.value ? (
          <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm">
            {params.value}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">N/A</span>
        )
      ),
    },
    { 
      field: "description", 
      headerName: "Description", 
      width: 250,
      renderCell: (params) => (
        <div className="text-gray-600 text-sm line-clamp-2" title={params.value}>
          {params.value || 'No description'}
        </div>
      ),
    },
    { 
      field: "price", 
      headerName: "Price", 
      width: 130,
      renderCell: (params) => (
        <div className="font-bold text-purple-600">Rs {parseFloat(params.value).toFixed(2)}</div>
      ),
    },
    { 
      field: "rating", 
      headerName: "Rating", 
      width: 110,
      renderCell: (params) => (
        params.value && params.value !== 'N/A' ? (
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="font-medium">{params.value}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">N/A</span>
        )
      ),
    },
    { 
      field: "stockQuantity", 
      headerName: "Stock Quantity", 
      width: 150,
      renderCell: (params) => {
        const quantity = parseInt(params.value);
        const colorClass = quantity > 10 
          ? 'bg-green-100 text-green-700' 
          : quantity > 0 
          ? 'bg-orange-100 text-orange-700' 
          : 'bg-red-100 text-red-700';
        return (
          <div className={`px-3 py-1 rounded-full font-semibold ${colorClass}`}>
            {params.value} units
          </div>
        );
      },
    },
    { 
      field: "category", 
      headerName: "Category", 
      width: 150,
      renderCell: (params) => (
        <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">
          {params.value}
        </div>
      ),
    },
  ];

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
        <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Available</h3>
        <p className="text-gray-500">Start by adding products to your inventory.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={(row) => row.productId}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          rowHeight={80}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f9fafb',
              borderBottom: '2px solid #e5e7eb',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#faf5ff',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '2px solid #e5e7eb',
              backgroundColor: '#f9fafb',
            },
          }}
        />
      </div>
      <InventorySummary products={products} />
    </>
  );
};

const InventorySummary = ({ products }) => {
  const totalAmount = products.reduce((sum, product) => {
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(product.stockQuantity) || 0;
    return sum + (price * quantity);
  }, 0);

  // Calculate category-wise summary
  const categorySummary = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { totalAmount: 0, stockQuantity: 0 };
    }
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(product.stockQuantity) || 0;
    acc[category].totalAmount += price * quantity;
    acc[category].stockQuantity += quantity;
    return acc;
  }, {});

  // Calculate monthly summary
  const monthlySummary = products.reduce((acc, product) => {
    const createdAt = product.createdAt ? new Date(product.createdAt) : new Date();
    const month = createdAt.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(product.stockQuantity) || 0;
    acc[month] += price * quantity;
    return acc;
  }, {});

  return (
    <div className="mt-8 space-y-6">
      {/* Total Inventory Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Total Inventory Value</h2>
            </div>
            <p className="text-purple-100 text-sm">Current worth of all products in stock</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">Rs {totalAmount.toFixed(2)}</div>
            <div className="text-purple-100 text-sm mt-2">{products.length} Products</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product-wise Summary */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Product-wise Amount</h2>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {products.map((product) => {
              const price = parseFloat(product.price) || 0;
              const quantity = parseInt(product.stockQuantity) || 0;
              const productAmount = (price * quantity).toFixed(2);
              return (
                <div 
                  key={product.productId}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors duration-200"
                >
                  <span className="font-medium text-gray-700">{product.name}</span>
                  <span className="font-bold text-purple-600">Rs {productAmount}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category-wise Summary */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Tag className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Category-wise Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categorySummary).map(([name, { stockQuantity, totalAmount }]) => (
                  <tr 
                    key={name} 
                    className="border-b border-gray-100 hover:bg-green-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-700">{name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        {stockQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-green-600">Rs {totalAmount.toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Monthly Summary</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(monthlySummary).map(([month, amount]) => (
            <div 
              key={month}
              className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{month}</span>
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
              <div className="mt-2 text-2xl font-bold text-blue-600">
                Rs {amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const { data: rawProducts, isError, isLoading } = useGetProductsQuery();
  const [previewImage, setPreviewImage] = React.useState(null);
  const [previewProductName, setPreviewProductName] = React.useState("");

  const handleImageClick = (imageUrl, productName) => {
    setPreviewImage(imageUrl);
    setPreviewProductName(productName);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
    setPreviewProductName("");
  };

  const products = React.useMemo(() => {
    if (!rawProducts) return [];
    return rawProducts.map((product, index) => ({
      serialNo: index + 1,
      productId: product.productId || product.id || product._id,
      name: product.name || 'No Name',
      image: product.imageUrl || product.image || null,
      model: product.model || null,
      color: product.color || null,
      description: product.description || null,
      price: product.price != null ? product.price : 'N/A',
      rating: product.rating != null ? product.rating : 'N/A',
      stockQuantity: product.stockQuantity != null ? product.stockQuantity : 'N/A',
      category: product.category || 'Uncategorized',
      createdAt: product.createdAt || new Date().toISOString(),
    }));
  }, [rawProducts]);

  if (isLoading) return <LoadingComponent />;
  if (isError || !products) return <ErrorComponent />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="mx-auto pb-8 w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <Header name="Inventory" />
              <p className="text-gray-500 text-sm mt-1">Track and manage your inventory value</p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-center px-6 py-3 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{products.length}</div>
                <div className="text-xs text-gray-600 font-medium">Total Products</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Grid and Summary */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <DataGridComponent products={products} onImageClick={handleImageClick} />
        </ErrorBoundary>

        {/* Image Preview Modal */}
        <ImagePreviewModal
          isOpen={!!previewImage}
          onClose={handleClosePreview}
          imageUrl={previewImage}
          productName={previewProductName}
        />
      </div>
    </div>
  );
};

export default Inventory;