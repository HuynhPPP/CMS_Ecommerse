-- CreateTable
CREATE TABLE "PhycoCart" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhycoCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhycoCartItem" (
    "id" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhycoCartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhycoWishlist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhycoWishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhycoWishlistItem" (
    "id" SERIAL NOT NULL,
    "wishlistId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhycoWishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhycoCart_userId_key" ON "PhycoCart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PhycoCart_sessionId_key" ON "PhycoCart"("sessionId");

-- CreateIndex
CREATE INDEX "PhycoCart_userId_idx" ON "PhycoCart"("userId");

-- CreateIndex
CREATE INDEX "PhycoCart_sessionId_idx" ON "PhycoCart"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "PhycoCartItem_cartId_productId_key" ON "PhycoCartItem"("cartId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "PhycoWishlist_userId_key" ON "PhycoWishlist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PhycoWishlist_sessionId_key" ON "PhycoWishlist"("sessionId");

-- CreateIndex
CREATE INDEX "PhycoWishlist_userId_idx" ON "PhycoWishlist"("userId");

-- CreateIndex
CREATE INDEX "PhycoWishlist_sessionId_idx" ON "PhycoWishlist"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "PhycoWishlistItem_wishlistId_productId_key" ON "PhycoWishlistItem"("wishlistId", "productId");

-- AddForeignKey
ALTER TABLE "PhycoCart" ADD CONSTRAINT "PhycoCart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoCartItem" ADD CONSTRAINT "PhycoCartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "PhycoCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoCartItem" ADD CONSTRAINT "PhycoCartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PhycoProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoWishlist" ADD CONSTRAINT "PhycoWishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoWishlistItem" ADD CONSTRAINT "PhycoWishlistItem_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "PhycoWishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhycoWishlistItem" ADD CONSTRAINT "PhycoWishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PhycoProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
