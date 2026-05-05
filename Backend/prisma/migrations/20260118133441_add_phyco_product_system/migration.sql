-- CreateTable
CREATE TABLE "PhycoCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PhycoCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhycoProduct" (
    "id" SERIAL NOT NULL,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'publish',
    "type" TEXT NOT NULL DEFAULT 'simple',
    "shortDescription" TEXT,
    "description" TEXT,
    "authorId" INTEGER,
    "categoryId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "regularPrice" DOUBLE PRECISION,
    "salePrice" DOUBLE PRECISION,
    "saleStart" TIMESTAMP(3),
    "saleEnd" TIMESTAMP(3),
    "stockStatus" TEXT NOT NULL DEFAULT 'instock',
    "stockQuantity" INTEGER,
    "manageStock" BOOLEAN NOT NULL DEFAULT false,
    "backordersAllowed" BOOLEAN NOT NULL DEFAULT false,
    "featuredImageUrl" TEXT,
    "imageAlt" TEXT,
    "weight" TEXT,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "shippingClassId" INTEGER,
    "taxStatus" TEXT DEFAULT 'taxable',
    "taxClass" TEXT,
    "virtual" BOOLEAN NOT NULL DEFAULT false,
    "downloadable" BOOLEAN NOT NULL DEFAULT false,
    "purchaseNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PhycoProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhycoProductVariation" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "sku" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "regularPrice" DOUBLE PRECISION,
    "salePrice" DOUBLE PRECISION,
    "saleStart" TIMESTAMP(3),
    "saleEnd" TIMESTAMP(3),
    "stockStatus" TEXT NOT NULL DEFAULT 'instock',
    "stockQuantity" INTEGER,
    "manageStock" BOOLEAN NOT NULL DEFAULT false,
    "backordersAllowed" BOOLEAN NOT NULL DEFAULT false,
    "attributes" JSONB NOT NULL,
    "imageUrl" TEXT,
    "weight" TEXT,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhycoProductVariation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhycoProductImage" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PhycoProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhycoProductTag" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "PhycoProductTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhycoProductAttribute" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "variation" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB NOT NULL,

    CONSTRAINT "PhycoProductAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhycoProductDownload" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,

    CONSTRAINT "PhycoProductDownload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhycoOrder" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "orderCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PhycoOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhycoOrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "variationId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhycoOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhycoAddress" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ward" TEXT,
    "district" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhycoAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhycoCategory_slug_key" ON "PhycoCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PhycoProduct_sku_key" ON "PhycoProduct"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "PhycoProduct_slug_key" ON "PhycoProduct"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PhycoProductVariation_sku_key" ON "PhycoProductVariation"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "PhycoProductTag_productId_slug_key" ON "PhycoProductTag"("productId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "PhycoProductAttribute_productId_slug_key" ON "PhycoProductAttribute"("productId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "PhycoOrder_orderCode_key" ON "PhycoOrder"("orderCode");

-- CreateIndex
CREATE UNIQUE INDEX "PhycoAddress_orderId_key" ON "PhycoAddress"("orderId");

-- AddForeignKey
ALTER TABLE "PhycoProduct" ADD CONSTRAINT "PhycoProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PhycoCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoProduct" ADD CONSTRAINT "PhycoProduct_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoProductVariation" ADD CONSTRAINT "PhycoProductVariation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PhycoProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoProductImage" ADD CONSTRAINT "PhycoProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PhycoProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoProductTag" ADD CONSTRAINT "PhycoProductTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PhycoProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoProductAttribute" ADD CONSTRAINT "PhycoProductAttribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PhycoProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoProductDownload" ADD CONSTRAINT "PhycoProductDownload_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PhycoProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoOrder" ADD CONSTRAINT "PhycoOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoOrderItem" ADD CONSTRAINT "PhycoOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "PhycoOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoOrderItem" ADD CONSTRAINT "PhycoOrderItem_variationId_fkey" FOREIGN KEY ("variationId") REFERENCES "PhycoProductVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoAddress" ADD CONSTRAINT "PhycoAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "PhycoOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
