-- Step 1: Add the updatedAt column, allowing NULL initially
ALTER TABLE "File" ADD COLUMN "updatedAt" DATETIME NULL;

-- Step 2: Update existing rows with the current timestamp
UPDATE "File" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;

-- Step 3: Recreate the table with the updated schema
CREATE TABLE "File_new" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "html" TEXT NOT NULL,
  "userId" INTEGER NOT NULL,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Step 4: Copy data from the old table to the new table
INSERT INTO "File_new" ("id", "name", "html", "userId", "updatedAt")
SELECT "id", "name", "html", "userId", "updatedAt" FROM "File";

-- Step 5: Drop the old table
DROP TABLE "File";

-- Step 6: Rename the new table to the original name
ALTER TABLE "File_new" RENAME TO "File";
