const fs = require('fs');
let code = fs.readFileSync('src/components/StagePreview.tsx', 'utf8');

code = code.replace(/\/\/ Compute projection target X & Y on stage floor based on Pan\/Tilt[\s\S]*?const tiltOffset = \(\(fixture\.currentValues\.Tilt - 50\) \/ 50\) \* 45;/g, 
  `// Fixed lighting pointing straight down
            const panOffset = 0;
            const tiltOffset = 0;`);
            
code = code.replace(/const targetBeamWidth = Math\.max\(10, 45 \* \(fixture\.currentValues\.Master \/ 100\) \* \(1 \+ \(fixture\.currentValues\.Tilt \/ 100\)\)\);/g,
  `const targetBeamWidth = Math.max(10, 45 * (fixture.currentValues.Master / 100));`);

fs.writeFileSync('src/components/StagePreview.tsx', code);
