
const fs = require('fs');

for (const file of fs.readdirSync('media')) {
    fs.copyFileSync(`media/${file}`, `dist/${file}`);
}
