/*
  Warnings:

  - You are about to drop the column `Email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `FirstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `LastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `UserName` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Author` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `Category` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `Id` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Book` table. All the data in the column will be lost.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [Email],
[FirstName],
[LastName],
[Password],
[UserName];
ALTER TABLE [dbo].[User] ADD [email] NVARCHAR(50) NOT NULL,
[firstName] NVARCHAR(30) NOT NULL,
[lastName] NVARCHAR(30) NOT NULL,
[password] NVARCHAR(50) NOT NULL,
[userName] NVARCHAR(50) NOT NULL;

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'Book'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_Book] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(60) NOT NULL,
    [author] NVARCHAR(30) NOT NULL,
    [category] NVARCHAR(50) NOT NULL,
    CONSTRAINT [PK_Book] PRIMARY KEY CLUSTERED ([id])
);
IF EXISTS(SELECT * FROM [dbo].[Book])
    EXEC('INSERT INTO [dbo].[_prisma_new_Book] () SELECT  FROM [dbo].[Book] WITH (holdlock tablockx)');
DROP TABLE [dbo].[Book];
EXEC SP_RENAME N'dbo._prisma_new_Book', N'Book';
COMMIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
