/*
  Warnings:

  - You are about to drop the column `email` on the `Salaries` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Salaries_email_key";

-- AlterTable
ALTER TABLE "Salaries" DROP COLUMN "email";
