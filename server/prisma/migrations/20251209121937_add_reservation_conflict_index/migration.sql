-- CreateIndex
CREATE INDEX "Reservation_roomId_startDate_endDate_idx" ON "public"."Reservation"("roomId", "startDate", "endDate");
