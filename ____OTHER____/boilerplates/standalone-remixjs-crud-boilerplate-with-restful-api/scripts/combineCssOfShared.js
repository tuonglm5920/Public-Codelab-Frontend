const fs = require('fs');
const path = require('path');

// Function to recursively find all CSS files in a directory
const findCssFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findCssFiles(filePath, fileList);
    } else if (path.extname(file) === '.css') {
      fileList.push(filePath);
    }
  });

  return fileList;
};

// Function to combine CSS files
const combineCssOfShared = (sourceDir, outputFile) => {
  const cssFiles = findCssFiles(sourceDir);
  let combinedCss = '';

  cssFiles.forEach(file => {
    const cssContent = fs.readFileSync(file, 'utf-8');
    combinedCss += `/* Extracted from ${file} */\n${cssContent}\n\n`;
  });

  fs.writeFileSync(outputFile, combinedCss, 'utf-8');
  console.log(`Combined CSS written to ${outputFile}`);
};

// Define source directory and output file
const sourceDir = 'app/shared/reactjs';
const outputFile = './shared.css';

// Run the function
combineCssOfShared(sourceDir, outputFile);
