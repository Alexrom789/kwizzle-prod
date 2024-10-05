-- CreateTable
CREATE TABLE `Kanji` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kanji` VARCHAR(10) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kunyomi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(20) NOT NULL,
    `kanjiId` INTEGER NOT NULL,

    INDEX `Kunyomi_kanjiId_fkey`(`kanjiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Meaning` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(20) NOT NULL,
    `kanjiId` INTEGER NOT NULL,

    INDEX `Meaning_kanjiId_fkey`(`kanjiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Onyomi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(20) NOT NULL,
    `kanjiId` INTEGER NOT NULL,

    INDEX `Onyomi_kanjiId_fkey`(`kanjiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SimilarKanji` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(10) NOT NULL,
    `kanjiId` INTEGER NOT NULL,

    INDEX `SimilarKanji_kanjiId_fkey`(`kanjiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserKanjiProgress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` ENUM('NEW', 'LEARNING', 'MASTERED', 'INGRAINED') NOT NULL,
    `kanjiId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Kunyomi` ADD CONSTRAINT `Kunyomi_kanjiId_fkey` FOREIGN KEY (`kanjiId`) REFERENCES `Kanji`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Meaning` ADD CONSTRAINT `Meaning_kanjiId_fkey` FOREIGN KEY (`kanjiId`) REFERENCES `Kanji`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Onyomi` ADD CONSTRAINT `Onyomi_kanjiId_fkey` FOREIGN KEY (`kanjiId`) REFERENCES `Kanji`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SimilarKanji` ADD CONSTRAINT `SimilarKanji_kanjiId_fkey` FOREIGN KEY (`kanjiId`) REFERENCES `Kanji`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserKanjiProgress` ADD CONSTRAINT `UserKanjiProgress_kanjiId_fkey` FOREIGN KEY (`kanjiId`) REFERENCES `Kanji`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserKanjiProgress` ADD CONSTRAINT `UserKanjiProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
