/*
  Warnings:

  - You are about to drop the column `paidAmount` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `producttype` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `remainingAmount` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `unitCost` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_productId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_productId_fkey";

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "category" TEXT,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "model" TEXT;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "paidAmount",
DROP COLUMN "phoneNumber",
DROP COLUMN "producttype",
DROP COLUMN "quantity",
DROP COLUMN "remainingAmount",
DROP COLUMN "timestamp",
DROP COLUMN "totalAmount",
DROP COLUMN "unitCost",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Customers" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "producttype" TEXT NOT NULL DEFAULT 'Retail',
    "phoneNumber" TEXT,
    "unitCost" INTEGER NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "remainingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE CASCADE ON UPDATE CASCADE;
