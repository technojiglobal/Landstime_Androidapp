// Landstime_Androidapp/Frontend/excel-to-json.js

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Path to your Excel file
const filePath = path.join(__dirname, 'translations.xlsx');

console.log('📂 Reading file:', filePath);

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error('❌ Error: translations.xlsx not found!');
  process.exit(1);
}

// Read the workbook
const workbook = XLSX.readFile(filePath);

// Get first sheet
const sheetName = workbook.SheetNames[0];
console.log('📋 Reading sheet:', sheetName);

const sheet = workbook.Sheets[sheetName];

// Convert sheet to JSON
const data = XLSX.utils.sheet_to_json(sheet);

console.log(`📊 Total rows found: ${data.length}`);

// Initialize empty JSON objects for each language
const en = {};
const hi = {};
const te = {};

let processedCount = 0;
let skippedCount = 0;
const duplicates = [];
const seenKeys = new Set();

// Loop through each row and assign key-value
data.forEach((row, index) => {
    const key = row.key;
    
    if (!key || key.trim() === '') {
        console.log(`⚠️  Row ${index + 2}: Skipped (empty key)`);
        skippedCount++;
        return;
    }

    // Check for duplicates
    if (seenKeys.has(key)) {
        duplicates.push({ row: index + 2, key });
        console.log(`⚠️  Row ${index + 2}: Duplicate key "${key}" (overwriting previous value)`);
    }
    seenKeys.add(key);

    en[key] = row.en || row.EN || "";
    hi[key] = row.hi || row.HI || "";
    te[key] = row.te || row.TE || "";
    
    processedCount++;
});

console.log(`\n✅ Processed: ${processedCount} keys`);
console.log(`⚠️  Skipped: ${skippedCount} rows (empty keys)`);
console.log(`🔄 Duplicates: ${duplicates.length} keys`);

if (duplicates.length > 0) {
    console.log('\n⚠️  Duplicate keys found:');
    duplicates.forEach(d => {
        console.log(`   Row ${d.row}: "${d.key}"`);
    });
}

// Create translations folder if it doesn't exist
const translationsDir = path.join(__dirname, 'translations');
if (!fs.existsSync(translationsDir)) {
  fs.mkdirSync(translationsDir);
  console.log('📁 Created translations folder');
}

// Output JSON files to translations folder
fs.writeFileSync(
  path.join(translationsDir, 'en.json'), 
  JSON.stringify(en, null, 2),
  'utf8'
);
fs.writeFileSync(
  path.join(translationsDir, 'hi.json'), 
  JSON.stringify(hi, null, 2),
  'utf8'
);
fs.writeFileSync(
  path.join(translationsDir, 'te.json'), 
  JSON.stringify(te, null, 2),
  'utf8'
);

console.log('\n✅ Translation files generated:');
console.log(`   - en.json (${Object.keys(en).length} keys)`);
console.log(`   - hi.json (${Object.keys(hi).length} keys)`);
console.log(`   - te.json (${Object.keys(te).length} keys)`);

// Show all keys
console.log('\n📝 All keys in generated files:');
Object.keys(en).forEach((key, index) => {
  console.log(`   ${index + 1}. ${key}`);
});

console.log('\n✅ Done!');