-- CreateEnum
CREATE TYPE "Recurrence" AS ENUM ('weekly', 'monthly', 'yearly');

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "recurrence" "Recurrence",
    "installments" INTEGER,
    "isSubscription" BOOLEAN,
    "dueDate" TIMESTAMP(3),
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
