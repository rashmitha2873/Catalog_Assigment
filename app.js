const fs = require('fs').promises;

// Read and parse the JSON file
async function readJSONFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading or parsing the JSON file:', error);
        throw error;
    }
}

// Decode the Y-values
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Extract (x, y) points from the JSON data
function extractPoints(data) {
    const points = [];
    const keys = Object.keys(data);

    for (const key of keys) {
        const { base, value } = data[key];
        const x = parseInt(key, 10);
        const y = decodeValue(value, base);
        points.push({ x, y });
    }
    return points;
}

// Lagrange Interpolation
function lagrangeInterpolation(points) {
    const n = points.length;
    let constantTerm = 0;

    for (let i = 0; i < n; i++) {
        const { x: x_i, y: y_i } = points[i];
        let term = y_i;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                const { x: x_j } = points[j];
                term *= -x_j / (x_i - x_j);
            }
        }
        constantTerm += term;
    }

    return constantTerm;
}

// Main function to process multiple test cases
async function processMultipleInputs(filePaths) {
    for (const filePath of filePaths) {
        try {
            console.log(`Processing ${filePath}...`);
            const data = await readJSONFile(filePath);
            const points = extractPoints(data);
            const constantTerm = lagrangeInterpolation(points);
            console.log(`The constant term (secret) for ${filePath} is: ${Math.round(constantTerm)}`);
        } catch (error) {
            console.error(`An error occurred while processing ${filePath}:`, error);
        }
    }
}

// Run the program with multiple test case files
processMultipleInputs(['testcase1.json', 'testcase2.json']);
