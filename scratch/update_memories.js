const fs = require('fs');
const path = require('path');

let data = '';
process.stdin.on('data', chunk => {
  data += chunk;
});

process.stdin.on('end', () => {
  try {
    const memories = JSON.parse(data.trim());
    if (!Array.isArray(memories)) {
      console.error("Error: Clipboard content is not a valid JSON array.");
      process.exit(1);
    }
    
    const filePath = path.join(__dirname, '../src/data/romanticData.ts');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find INITIAL_MEMORIES array and replace it
    const startIndex = content.indexOf('export const INITIAL_MEMORIES: MemoryItem[] = [');
    if (startIndex === -1) {
      console.error("Error: Could not find INITIAL_MEMORIES array in romanticData.ts");
      process.exit(1);
    }
    
    // Find the matching closing bracket '];' after startIndex
    let braceCount = 0;
    let endIndex = -1;
    for (let i = startIndex; i < content.length; i++) {
      if (content[i] === '[') {
        braceCount++;
      } else if (content[i] === ']') {
        braceCount--;
        if (braceCount === 0) {
          // Check if it is followed by semicolon
          if (content[i + 1] === ';') {
            endIndex = i + 2;
          } else {
            endIndex = i + 1;
          }
          break;
        }
      }
    }
    
    if (endIndex === -1) {
      console.error("Error: Could not parse end of INITIAL_MEMORIES array.");
      process.exit(1);
    }
    
    const prefix = content.substring(0, startIndex);
    const suffix = content.substring(endIndex);
    const middle = `export const INITIAL_MEMORIES: MemoryItem[] = ${JSON.stringify(memories, null, 2)};`;
    
    fs.writeFileSync(filePath, prefix + middle + suffix, 'utf8');
    console.log("Successfully updated src/data/romanticData.ts with your memories!");
  } catch (err) {
    console.error("Error processing JSON:", err.message);
    process.exit(1);
  }
});
