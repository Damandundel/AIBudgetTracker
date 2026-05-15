const fs = require("fs");
const path = require("path");

function getFilePath(fileName) {
    return path.join(__dirname, "..", "data", fileName);
}

function readData(fileName) {
    const filePath = getFilePath(fileName);

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]");
    }

    const data = fs.readFileSync(filePath, "utf-8");

    if (!data.trim()) {
        return [];
    }

    return JSON.parse(data);
}

function writeData(fileName, data) {
    const filePath = getFilePath(fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

module.exports = {
    readData,
    writeData
};