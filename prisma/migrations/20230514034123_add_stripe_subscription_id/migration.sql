/*
  Warnings:

  - Added the required column `stripe_subscription_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Subscription` ADD COLUMN `stripe_subscription_id` VARCHAR(191) NOT NULL;
