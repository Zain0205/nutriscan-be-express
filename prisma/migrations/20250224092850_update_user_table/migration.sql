/*
  Warnings:

  - Added the required column `goal` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `age` INTEGER NULL,
    ADD COLUMN `goal` ENUM('Bulking', 'Cutting', 'Maintenance') NOT NULL,
    ADD COLUMN `goal_calories` INTEGER NOT NULL DEFAULT 2000,
    ADD COLUMN `height` DOUBLE NULL,
    ADD COLUMN `weight` DOUBLE NULL;
