const fs = require('fs');
let code = fs.readFileSync('src/components/ConsoleControls.tsx', 'utf8');

code = code.replace(/const faders: \{ type: DMXChannelType; label: string; color: string \}.*?\];/s, `const faders: { type: DMXChannelType; label: string; color: string }[] = [
    { type: DMXChannelType.Master, label: 'MAS', color: 'bg-amber-500' },
    { type: DMXChannelType.Red, label: 'R', color: 'bg-red-500' },
    { type: DMXChannelType.Green, label: 'G', color: 'bg-green-500' },
    { type: DMXChannelType.Blue, label: 'B', color: 'bg-blue-500' },
    { type: DMXChannelType.White, label: 'W', color: 'bg-slate-100 text-slate-900' },
    { type: DMXChannelType.Strobe, label: '싸이키', color: 'bg-zinc-200 text-black' },
  ];`);

fs.writeFileSync('src/components/ConsoleControls.tsx', code);
