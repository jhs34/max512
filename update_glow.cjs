const fs = require('fs');
let code = fs.readFileSync('src/DmxSimulatorEngine.ts', 'utf8');

code = code.replace(
  /public static computeFixtureGlow\(fixture: Fixture, isBlackoutGlobal = false\): \{/g,
  `public static computeFixtureGlow(fixture: Fixture, isBlackoutGlobal = false, timeMs = performance.now()): {`
);

code = code.replace(
  /const mFactor = mVal \/ 100;/g,
  `let mFactor = mVal / 100;
    const strobeVal = fixture.currentValues[DMXChannelType.Strobe] || 0;
    if (strobeVal > 0 && !isBlackoutGlobal) {
      const hz = 1 + (strobeVal / 100) * 19;
      const periodMs = 1000 / hz;
      if ((timeMs % periodMs) > periodMs / 2) {
        mFactor = 0;
      }
    }`
);

fs.writeFileSync('src/DmxSimulatorEngine.ts', code);
