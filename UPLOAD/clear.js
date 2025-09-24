const fs = require("fs").promises;
const path = require("path");

async function clearDirectories() {
  const inputDir = "input/";
  const outputDir = "output/";

  try {
    // Clear input directory
    await clearDirectory(inputDir, "input");

    // Clear output directory
    await clearDirectory(outputDir, "output");

    console.log("\n✅ All directories cleared successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function clearDirectory(dirPath, dirName) {
  try {
    // Check if directory exists
    const dirExists = await fs
      .access(dirPath)
      .then(() => true)
      .catch(() => false);

    if (!dirExists) {
      console.log(`📁 ${dirName}/ directory doesn't exist, skipping...`);
      return;
    }

    // Read all files in the directory
    const files = await fs.readdir(dirPath);

    if (files.length === 0) {
      console.log(`📁 ${dirName}/ directory is already empty`);
      return;
    }

    console.log(`🧹 Clearing ${dirName}/ directory...`);

    // Delete each file
    for (const file of files) {
      const filePath = path.join(dirPath, file);

      try {
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
          // If it's a subdirectory, remove it recursively
          await fs.rmdir(filePath, { recursive: true });
          console.log(`   🗂️  Removed directory: ${file}`);
        } else {
          // If it's a file, remove it
          await fs.unlink(filePath);
          console.log(`   🗑️  Removed file: ${file}`);
        }
      } catch (error) {
        console.error(`   ❌ Error removing ${file}:`, error.message);
      }
    }

    console.log(
      `✅ ${dirName}/ directory cleared (${files.length} items removed)`
    );
  } catch (error) {
    console.error(`❌ Error clearing ${dirName}/ directory:`, error.message);
  }
}

// Run the clear operation
clearDirectories();
