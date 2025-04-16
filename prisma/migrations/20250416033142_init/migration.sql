-- CreateTable
CREATE TABLE `Yuri` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `rating` VARCHAR(191) NOT NULL,
    `source` TEXT NOT NULL,
    `artist` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tag` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tag_tag_key`(`tag`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `YuriTag` (
    `yuriId` VARCHAR(191) NOT NULL,
    `tagId` INTEGER NOT NULL,

    PRIMARY KEY (`yuriId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `YuriTag` ADD CONSTRAINT `YuriTag_yuriId_fkey` FOREIGN KEY (`yuriId`) REFERENCES `Yuri`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YuriTag` ADD CONSTRAINT `YuriTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
