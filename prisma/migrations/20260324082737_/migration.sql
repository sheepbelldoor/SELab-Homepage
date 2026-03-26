-- AlterTable
ALTER TABLE "Publication" ADD COLUMN "url" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "photo" TEXT,
    "role" TEXT NOT NULL,
    "bio" TEXT,
    "interest" TEXT,
    "email" TEXT,
    "homepage" TEXT,
    "github" TEXT,
    "scholar" TEXT,
    "cvUrl" TEXT,
    "authorAliases" TEXT NOT NULL DEFAULT '[]',
    "education" TEXT NOT NULL DEFAULT '[]',
    "awards" TEXT NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Member" ("createdAt", "email", "github", "homepage", "id", "interest", "name", "nameEn", "photo", "role", "scholar", "sortOrder", "updatedAt") SELECT "createdAt", "email", "github", "homepage", "id", "interest", "name", "nameEn", "photo", "role", "scholar", "sortOrder", "updatedAt" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
