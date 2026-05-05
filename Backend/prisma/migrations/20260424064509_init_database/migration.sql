/*
  Warnings:

  - You are about to drop the `PhycoAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoCart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoCartItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoCoupon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoOrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoProductAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoProductDownload` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoProductImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoProductTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoProductVariation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoWishlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PhycoWishlistItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PhycoAddress" DROP CONSTRAINT "PhycoAddress_orderId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoCart" DROP CONSTRAINT "PhycoCart_userId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoCartItem" DROP CONSTRAINT "PhycoCartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoCartItem" DROP CONSTRAINT "PhycoCartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoCategory" DROP CONSTRAINT "PhycoCategory_parentId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoOrder" DROP CONSTRAINT "PhycoOrder_userId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoOrderItem" DROP CONSTRAINT "PhycoOrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoOrderItem" DROP CONSTRAINT "PhycoOrderItem_variationId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoProduct" DROP CONSTRAINT "PhycoProduct_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoProduct" DROP CONSTRAINT "PhycoProduct_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoProductAttribute" DROP CONSTRAINT "PhycoProductAttribute_productId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoProductDownload" DROP CONSTRAINT "PhycoProductDownload_productId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoProductImage" DROP CONSTRAINT "PhycoProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoProductTag" DROP CONSTRAINT "PhycoProductTag_productId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoProductVariation" DROP CONSTRAINT "PhycoProductVariation_productId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoWishlist" DROP CONSTRAINT "PhycoWishlist_userId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoWishlistItem" DROP CONSTRAINT "PhycoWishlistItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "PhycoWishlistItem" DROP CONSTRAINT "PhycoWishlistItem_wishlistId_fkey";

-- DropTable
DROP TABLE "PhycoAddress";

-- DropTable
DROP TABLE "PhycoCart";

-- DropTable
DROP TABLE "PhycoCartItem";

-- DropTable
DROP TABLE "PhycoCategory";

-- DropTable
DROP TABLE "PhycoCoupon";

-- DropTable
DROP TABLE "PhycoOrder";

-- DropTable
DROP TABLE "PhycoOrderItem";

-- DropTable
DROP TABLE "PhycoProduct";

-- DropTable
DROP TABLE "PhycoProductAttribute";

-- DropTable
DROP TABLE "PhycoProductDownload";

-- DropTable
DROP TABLE "PhycoProductImage";

-- DropTable
DROP TABLE "PhycoProductTag";

-- DropTable
DROP TABLE "PhycoProductVariation";

-- DropTable
DROP TABLE "PhycoWishlist";

-- DropTable
DROP TABLE "PhycoWishlistItem";
