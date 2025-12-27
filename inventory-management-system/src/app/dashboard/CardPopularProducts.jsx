import { useGetDashboardMetricsQuery } from "@/state/api.jsx";
import { ShoppingBag, TrendingUp, Package, Loader2 } from "lucide-react";
import React from "react";
import Image from "next/image";
import Rating from "../[components]/Ratings/index.jsx";

const CardPopularProducts = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-500 font-medium">Loading products...</p>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Popular Products
                </h2>
                <p className="text-blue-100 text-sm">Top selling items</p>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="overflow-auto h-full">
            {dashboardMetrics?.popularProducts?.map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center justify-between gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={56}
                      height={56}
                      className="rounded-xl w-14 h-14 shadow-md object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between gap-1 flex-1">
                    <div className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600 text-sm bg-blue-100 px-2 py-1 rounded-lg">
                        ₨{product.price}
                      </span>
                      <Rating rating={product.rating || 0} />
                    </div>
                  </div>
                </div>
                 
                <div className="flex flex-col items-end gap-2">
                  <button className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1 text-xs">
                    <Package className="w-3 h-3 text-gray-500" />
                    <span className="font-bold text-gray-700">
                      {Math.round(product.stockQuantity / 1000)}k
                    </span>
                    <span className="text-gray-500">Sold</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Products</p>
                  <p className="text-lg font-bold text-gray-800">
                    {dashboardMetrics?.popularProducts?.length || 0} Items
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-lg font-bold text-green-700">Popular</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardPopularProducts;