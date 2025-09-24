const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");

async function convertImages(
  startNumber = 0,
  baseUrl = "https://woodylinwc.github.io/Image-Storage/GIDLE/"
) {
  const inputDir = "input/";
  const outputDir = "output/";

  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // Read all files from input directory
    const files = await fs.readdir(inputDir);

    // Filter for image files
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
      ".tiff",
    ];
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    console.log(`Found ${imageFiles.length} image files`);

    const urls = []; // Array to store ALL URLs from 0 to final number
    let finalImageNumber = startNumber + imageFiles.length - 1;

    // Convert each image
    for (let i = 0; i < imageFiles.length; i++) {
      const inputPath = path.join(inputDir, imageFiles[i]);
      const outputNumber = startNumber + i;
      const outputPath = path.join(outputDir, `image_${outputNumber}.JPG`);

      try {
        await sharp(inputPath)
          .jpeg({ quality: 90 }) // Convert to JPEG with 90% quality
          .toFile(outputPath);

        console.log(`Converted: ${imageFiles[i]} -> image_${outputNumber}.JPG`);
      } catch (error) {
        console.error(`Error converting ${imageFiles[i]}:`, error.message);
        finalImageNumber--; // Reduce final number if conversion failed
      }
    }

    // Generate ALL URLs from image_0.JPG to the final image
    for (let i = 0; i <= finalImageNumber; i++) {
      const imageUrl = `${baseUrl}image_${i}.JPG`;
      urls.push(imageUrl);
    }

    // Generate urls.json file in the same directory as the script
    const urlsJsonPath = "urls.json";
    await fs.writeFile(urlsJsonPath, JSON.stringify(urls, null, 2));

    console.log(`\nConversion complete!`);
    console.log(
      `Generated ${imageFiles.length} images starting from image_${startNumber}.JPG`
    );
    console.log(
      `URLs file contains all images from image_0.JPG to image_${finalImageNumber}.JPG (${urls.length} total URLs)`
    );
    console.log(`URLs saved to: ${urlsJsonPath}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run the conversion - just edit these values as needed:
convertImages(3747, "https://woodylinwc.github.io/Image-Storage/GIDLE/");
