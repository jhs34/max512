const fs = require('fs');
let code = fs.readFileSync('src/DmxSimulatorEngine.ts', 'utf8');

code = code.replace(/\[DMXChannelType\.Pan\]: 50, \/\/ center\s+\[DMXChannelType\.Tilt\]: 50  \/\/ center/g, '[DMXChannelType.Strobe]: 0');
code = code.replace(/if \(channelKey === DMXChannelType\.Pan \|\| channelKey === DMXChannelType\.Tilt\) \{[\s\S]*?\} else \{/g, '');
code = code.replace(/fixture\.currentValues\[channelKey\] = 0;\s+\}/g, 'fixture.currentValues[channelKey] = 0;');
code = code.replace(/if \(channel === DMXChannelType\.Pan \|\| channel === DMXChannelType\.Tilt\) \{\s+return 50; \/\/ Centered\s+\}/g, '');
code = code.replace(/\* 6: Pan\s+\* 7: Tilt\s+\* Channels 8 to 16 are filled with 0\./g, '* 6: Strobe');

code = code.replace(/\/\/ Pan\/Tilt can be fully scaled or mapped\s+const scalePanTilt = \(val: number\) => Math\.round\(\(val \/ 100\) \* 255\);/g, '');
code = code.replace(/buffer\[base\] = scaleTo255\(fixture\.currentValues\[DMXChannelType\.Red\]\);\s+buffer\[base \+ 1\] = scaleTo255\(fixture\.currentValues\[DMXChannelType\.Green\]\);\s+buffer\[base \+ 2\] = scaleTo255\(fixture\.currentValues\[DMXChannelType\.Blue\]\);\s+buffer\[base \+ 3\] = scaleTo255\(fixture\.currentValues\[DMXChannelType\.White\]\);\s+buffer\[base \+ 4\] = scaleTo255\(fixture\.currentValues\[DMXChannelType\.Master\]\);\s+buffer\[base \+ 5\] = scalePanTilt\(fixture\.currentValues\[DMXChannelType\.Pan\]\);\s+buffer\[base \+ 6\] = scalePanTilt\(fixture\.currentValues\[DMXChannelType\.Tilt\]\);\s+\/\/ Rest channels are 0 \(padding to 16\)\s+for \(let offset = 7; offset < 16; offset\+\+\) \{\s+buffer\[base \+ offset\] = 0;\s+\}/g, `buffer[base] = scaleTo255(fixture.currentValues[DMXChannelType.Master]);
      buffer[base + 1] = scaleTo255(fixture.currentValues[DMXChannelType.Red]);
      buffer[base + 2] = scaleTo255(fixture.currentValues[DMXChannelType.Green]);
      buffer[base + 3] = scaleTo255(fixture.currentValues[DMXChannelType.Blue]);
      buffer[base + 4] = scaleTo255(fixture.currentValues[DMXChannelType.White]);
      buffer[base + 5] = scaleTo255(fixture.currentValues[DMXChannelType.Strobe]);`);

fs.writeFileSync('src/DmxSimulatorEngine.ts', code);
