-- AlterTable
ALTER TABLE "PhycoCart" ADD COLUMN     "couponCode" TEXT,
ADD COLUMN     "discount" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "PhycoOrder" ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "discount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "sessionId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PhycoCoupon" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "minAmount" DOUBLE PRECISION,
    "maxDiscount" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageLimit" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhycoCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhycoCoupon_code_key" ON "PhycoCoupon"("code");
