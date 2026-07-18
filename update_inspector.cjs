const fs = require('fs');
let code = fs.readFileSync('src/components/DmxInspector.tsx', 'utf8');

code = code.replace(/const maxChannels = viewRange === 'fixtures' \? 192 : 512;/g, `const maxChannels = viewRange === 'fixtures' ? 72 : 512;`);
code = code.replace(/const fixtureIdx = Math\.floor\(\(address - 1\) \/ 16\) \+ 1;/g, `const fixtureIdx = Math.floor((address - 1) / 6) + 1;`);
code = code.replace(/const channelOffset = \(address - 1\) % 16 \+ 1;/g, `const channelOffset = (address - 1) % 6 + 1;`);

code = code.replace(/switch \(channelOffset\) \{[\s\S]*?default: return prefix \+ \`ch\$\{channelOffset\}\`;\s+\}/g, `switch (channelOffset) {
        case 1: return prefix + 'Mst';
        case 2: return prefix + 'R';
        case 3: return prefix + 'G';
        case 4: return prefix + 'B';
        case 5: return prefix + 'W';
        case 6: return prefix + 'Str';
        default: return prefix + \`ch\${channelOffset}\`;
      }`);

fs.writeFileSync('src/components/DmxInspector.tsx', code);
