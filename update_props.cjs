const fs = require('fs');
let code = fs.readFileSync('src/components/ConsoleControls.tsx', 'utf8');

code = code.replace(/presetMode: PresetMode;\n  bank: 'A' \| 'B';\n/g, '');
code = code.replace(/  presetMode,\n  bank,\n/g, '');

code = code.replace(/const \[triggerMode, setTriggerMode\]/g, `const presetMode = engine.currentPresetMode;
  const bank = engine.currentBank;
  const [triggerMode, setTriggerMode]`);

fs.writeFileSync('src/components/ConsoleControls.tsx', code);
