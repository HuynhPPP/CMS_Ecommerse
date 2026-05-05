-- AlterTable
ALTER TABLE "PhycoCategory" ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "PhycoCategory" ADD CONSTRAINT "PhycoCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PhycoCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
