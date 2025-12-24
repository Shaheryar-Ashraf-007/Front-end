// src/state/api.jsx
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
    credentials: "include", // important for cookies
    prepareHeaders: (headers) => {
      // Optional: attach Authorization header if token exists in localStorage
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "DashboardMetrics",
    "Products",
    "Users",
    "Salaries",
    "Expenses",
  ],
  endpoints: (build) => ({
    /* ================= AUTH ================= */
    login: build.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    /* ================= DASHBOARD ================= */
    getDashboardMetrics: build.query({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),

    /* ================= PRODUCTS ================= */
    getProducts: build.query({
      query: (search) => ({ url: "/products", params: search ? { search } : {} }),
      providesTags: ["Products"],
    }),
    createProducts: build.mutation({
      query: (formData) => ({ url: "/products", method: "POST", body: formData }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: build.mutation({
      query: (productId) => ({ url: `/products/${productId}`, method: "DELETE" }),
      invalidatesTags: ["Products"],
    }),

    /* ================= USERS ================= */
    getUsers: build.query({
      query: (search) => ({ url: "/users", params: search ? { search } : {} }),
      providesTags: ["Users"],
    }),
    createUsers: build.mutation({
      query: (newUser) => ({ url: "/users", method: "POST", body: newUser }),
      invalidatesTags: ["Users"],
    }),
    deleteUsers: build.mutation({
      query: (userId) => ({ url: `/users/${userId}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),

    /* ================= SALARIES ================= */
    getSalaries: build.query({
      query: (search) => ({ url: "/salaries", params: search ? { search } : {} }),
      providesTags: ["Salaries"],
    }),
    createSalaries: build.mutation({
      query: (newSalary) => ({ url: "/salaries", method: "POST", body: newSalary }),
      invalidatesTags: ["Salaries"],
    }),
    deleteSalaries: build.mutation({
      query: (userId) => ({ url: `/salaries/${userId}`, method: "DELETE" }),
      invalidatesTags: ["Salaries"],
    }),

    /* ================= EXPENSES ================= */
    getExpensesByCategory: build.query({
      query: (search) => ({ url: "/expenses", params: search ? { search } : {} }),
      providesTags: ["Expenses"],
    }),
    createExpense: build.mutation({
      query: (newExpense) => ({ url: "/expenses", method: "POST", body: newExpense }),
      invalidatesTags: ["Expenses"],
    }),
    deleteExpense: build.mutation({
      query: (expenseId) => ({ url: `/expenses/${expenseId}`, method: "DELETE" }),
      invalidatesTags: ["Expenses"],
    }),
  }),
});

/* ================= EXPORT HOOKS ================= */
export const {
  useLoginMutation,
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductsMutation,
  useDeleteProductMutation,
  useGetUsersQuery,
  useCreateUsersMutation,
  useDeleteUsersMutation,
  useGetSalariesQuery,
  useCreateSalariesMutation,
  useDeleteSalariesMutation,
  useGetExpensesByCategoryQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
} = api;
