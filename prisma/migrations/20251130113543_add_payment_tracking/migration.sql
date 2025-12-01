-- AlterTable
ALTER TABLE "Payment" ADD COLUMN "channel" TEXT;
ALTER TABLE "Payment" ADD COLUMN "contact" TEXT;
ALTER TABLE "Payment" ADD COLUMN "trackingNumber" TEXT;

-- CreateIndex
CREATE INDEX "Payment_trackingNumber_idx" ON "Payment"("trackingNumber");
