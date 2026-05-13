-- AlterTable
ALTER TABLE `eventos` ADD COLUMN `imagemId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Imagem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeOriginal` VARCHAR(191) NOT NULL,
    `nomeArquivo` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Eventos` ADD CONSTRAINT `Eventos_imagemId_fkey` FOREIGN KEY (`imagemId`) REFERENCES `Imagem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
