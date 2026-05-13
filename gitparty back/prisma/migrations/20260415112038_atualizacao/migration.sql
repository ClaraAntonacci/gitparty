/*
  Warnings:

  - You are about to drop the column `imagemId` on the `eventos` table. All the data in the column will be lost.
  - Added the required column `eventosId` to the `Imagem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `eventos` DROP FOREIGN KEY `Eventos_imagemId_fkey`;

-- DropIndex
DROP INDEX `Eventos_imagemId_fkey` ON `eventos`;

-- AlterTable
ALTER TABLE `eventos` DROP COLUMN `imagemId`;

-- AlterTable
ALTER TABLE `imagem` ADD COLUMN `eventosId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Imagem` ADD CONSTRAINT `Imagem_eventosId_fkey` FOREIGN KEY (`eventosId`) REFERENCES `Eventos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
