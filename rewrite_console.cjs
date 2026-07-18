const fs = require('fs');

let code = `
import React, { useState, useEffect } from 'react';
import { Power, Settings, RefreshCcw, Zap } from 'lucide-react';
import {
  DMXChannelType,
  PresetMode,
  TriggerMode,
  ButtonType,
} from '../types';
import { DmxSimulatorEngine } from '../DmxSimulatorEngine';

interface ConsoleControlsProps {
  engine: DmxSimulatorEngine;
  onStateChange: () => void;
  selectedFixtureIds: Set<number>;
  presetMode: PresetMode;
  bank: 'A' | 'B';
  activeScenes: Set<string>;
  flashedScenes: Set<string>;
  activeChases: Map<string, any>;
}

export const ConsoleControls: React.FC<ConsoleControlsProps> = ({
  engine,
  onStateChange,
  selectedFixtureIds,
  presetMode,
  bank,
  activeScenes,
  flashedScenes,
  activeChases
}) => {
  const [triggerMode, setTriggerMode] = useState<TriggerMode>(engine.currentTriggerMode);
  const [buttonType, setButtonType] = useState<ButtonType>(engine.currentButtonType);

  useEffect(() => {
    setTriggerMode(engine.currentTriggerMode);
    setButtonType(engine.currentButtonType);
  }, [
    engine.currentTriggerMode,
    engine.currentButtonType,
    engine.globalSpeedPercent,
    engine.globalCrossPercent,
    engine.isBlackout,
    engine.chaseDirection,
    engine
  ]);

  const toggleBank = () => {
    engine.currentBank = engine.currentBank === 'A' ? 'B' : 'A';
    onStateChange();
  };

  const handleModeChange = (mode: PresetMode) => {
    engine.currentPresetMode = mode;
    onStateChange();
  };

  const handleNumberKey = (num: number, isPressed: boolean) => {
    if (engine.currentPresetMode === PresetMode.FIXTURE) {
      if (isPressed) {
        if (engine.selectedFixtureIds.has(num)) {
          engine.selectedFixtureIds.delete(num);
        } else {
          engine.selectedFixtureIds.add(num);
        }
        onStateChange();
      }
    } else if (engine.currentPresetMode === PresetMode.SCENE) {
      engine.selectSceneButton(num, isPressed);
      onStateChange();
    } else if (engine.currentPresetMode === PresetMode.CHASE) {
      engine.selectChaseButton(num, isPressed);
      onStateChange();
    }
  };

  const faders: { type: DMXChannelType; label: string; color: string }[] = [
    { type: DMXChannelType.Master, label: 'MAS', color: 'bg-amber-500' },
    { type: DMXChannelType.Red, label: 'R', color: 'bg-red-500' },
    { type: DMXChannelType.Green, label: 'G', color: 'bg-green-500' },
    { type: DMXChannelType.Blue, label: 'B', color: 'bg-blue-500' },
    { type: DMXChannelType.White, label: 'W', color: 'bg-slate-100 text-slate-900' },
    { type: DMXChannelType.Strobe, label: '싸이키', color: 'bg-zinc-200 text-black' },
  ];

  const isKeyLEDActive = (num: number): boolean => {
    const presetId = \`\${bank}\${num}\`;
    if (presetMode === PresetMode.FIXTURE) {
      return selectedFixtureIds.has(num);
    } else if (presetMode === PresetMode.SCENE) {
      return activeScenes.has(presetId) || flashedScenes.has(presetId);
    } else if (presetMode === PresetMode.CHASE) {
      return activeChases.has(presetId);
    }
    return false;
  };

  const getLCDActivePresetString = (): string => {
    if (presetMode === PresetMode.SCENE) {
      const activeList = Array.from(new Set([...activeScenes, ...flashedScenes])).map(id => id);
      return activeList.length > 0 ? activeList.join(', ') : 'None Active';
    } else if (presetMode === PresetMode.CHASE) {
      const activeList = Array.from(activeChases.keys());
      if (activeList.length === 0) return 'None Active';
      const lastChaseId = activeList[activeList.length - 1];
      const runtime = activeChases.get(lastChaseId);
      const stepNum = runtime ? String(runtime.currentStepIndex + 1).padStart(3, '0') : '001';
      return \`\${lastChaseId} Step \${stepNum}#\`;
    } else {
      const activeList = Array.from(selectedFixtureIds);
      return activeList.length > 0 ? \`F\${activeList.join(',F')}\` : 'No Fixtures';
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-[#d1cbb8] rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border-4 border-[#b5af9a] select-none text-black font-sans relative overflow-hidden">
      
      {/* Brand Header */}
      <div className="flex justify-between items-end border-b-2 border-[#a39d88] pb-2 mb-4">
        <h1 className="text-3xl font-black italic tracking-tighter text-[#333]">
          MAX<span className="font-light">512</span> <span className="text-sm font-bold ml-2 text-[#666] uppercase tracking-widest not-italic">Moving Light Controller</span>
        </h1>
        <h2 className="text-4xl font-black text-[#444] tracking-tighter">Net.DO</h2>
      </div>

      <div className="flex gap-8">
        
        {/* LEFT COLUMN: FADERS */}
        <div className="w-[50%] flex flex-col border border-[#a39d88] p-4 rounded bg-[#e3decf] shadow-inner relative">
          
          <div className="absolute left-2 top-2 flex flex-col gap-2">
            <button className="w-8 h-6 bg-[#eee] border border-gray-400 rounded text-[9px] shadow-sm flex items-center justify-center font-bold">1-16</button>
            <button className="w-8 h-6 bg-[#ccc] border border-gray-400 rounded text-[9px] shadow-sm flex items-center justify-center font-bold">17-32</button>
          </div>
          
          <div className="flex justify-center gap-4 ml-12">
            {faders.map((fader, idx) => {
              let currentVal = 0;
              let isOverridden = false;
              if (selectedFixtureIds.size > 0) {
                const firstFid = selectedFixtureIds.values().next().value;
                if (firstFid !== undefined) {
                  currentVal = engine.manualOverrides[firstFid]?.[fader.type] ?? 0;
                  isOverridden = engine.isChannelOverridden(firstFid, fader.type);
                }
              }
              return (
                <div key={fader.type} className="flex flex-col items-center">
                  <div className="text-[10px] font-bold mb-1">CH{idx + 1}</div>
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] mb-2 opacity-80"></div>
                  
                  {/* Fader Track */}
                  <div className="relative h-48 w-6 bg-[#cfcabb] border border-[#a39d88] rounded flex justify-center py-2 shadow-inner">
                    
                    {/* Scale markings */}
                    <div className="absolute left-0 top-0 bottom-0 w-full flex flex-col justify-between items-end pr-1 text-[8px] text-gray-500 font-mono pointer-events-none">
                      <span>10</span><span>8</span><span>6</span><span>4</span><span>2</span><span>0</span>
                    </div>

                    <div className="absolute w-1 h-full bg-[#111] left-1/2 -translate-x-1/2"></div>
                    
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentVal}
                      onChange={(e) => engine.handleFaderMove(fader.type, parseInt(e.target.value, 10))}
                      className="absolute inset-x-0 w-full h-full opacity-0 cursor-ns-resize z-10 [writing-mode:vertical-lr]"
                      style={{ transform: 'rotate(180deg)' }}
                    />
                    
                    {/* Fader Knob */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-8 h-6 bg-gradient-to-b from-[#eee] to-[#ccc] border-b-2 border-[#999] shadow-md rounded-sm pointer-events-none flex items-center justify-center"
                      style={{ bottom: \`calc(\${currentVal}% - 12px)\` }}
                    >
                      <div className="w-full h-1 bg-gray-400"></div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold mt-2 text-[#555]">{fader.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: LCD, CONTROL/EDIT, SHAPE, WHEELS */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* LCD Section */}
          <div className="bg-[#b5af9a] p-3 rounded-lg border-2 border-[#a39d88] flex justify-center shadow-inner">
             <div className="bg-[#c4cf9f] border-[3px] border-[#8a8d7a] w-full h-24 rounded flex flex-col p-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between text-[#222] font-mono text-[10px] font-bold mb-2 uppercase">
                   <span>CHASE</span>
                   <span>STEP</span>
                   <span>SPEED</span>
                   <span>CROSS</span>
                </div>
                <div className="flex justify-between text-[#111] font-mono text-lg font-bold mt-auto mb-1">
                   <span>{presetMode === PresetMode.CHASE ? '01' : '--'}</span>
                   <span>{getLCDActivePresetString()}</span>
                   <span>{engine.globalSpeedPercent}</span>
                   <span>{engine.globalCrossPercent}%</span>
                </div>
             </div>
          </div>

          {/* Mode & Function Buttons */}
          <div className="flex gap-4">
             {/* Mode selectors */}
             <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => { engine.currentButtonType = ButtonType.LATCH; setButtonType(ButtonType.LATCH); onStateChange(); }} className="w-10 h-6 bg-[#eee] border-b-2 border-gray-400 rounded text-[9px] shadow-sm font-bold">LATCH</button>
                  <div className={\`w-2 h-2 rounded-full \${buttonType === ButtonType.LATCH ? 'bg-red-500' : 'bg-[#666]'}\`}></div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { engine.currentButtonType = ButtonType.SWOP; setButtonType(ButtonType.SWOP); onStateChange(); }} className="w-10 h-6 bg-[#eee] border-b-2 border-gray-400 rounded text-[9px] shadow-sm font-bold">SWOP</button>
                  <div className={\`w-2 h-2 rounded-full \${buttonType === ButtonType.SWOP ? 'bg-red-500' : 'bg-[#666]'}\`}></div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => { engine.currentTriggerMode = TriggerMode.Auto; setTriggerMode(TriggerMode.Auto); onStateChange(); }} className="w-10 h-6 bg-[#eee] border-b-2 border-gray-400 rounded text-[9px] shadow-sm font-bold">AUTO</button>
                  <div className={\`w-2 h-2 rounded-full \${triggerMode === TriggerMode.Auto ? 'bg-green-500' : 'bg-[#666]'}\`}></div>
                </div>
             </div>
             
             {/* Edit / Type / Mode */}
             <div className="grid grid-cols-3 gap-3 flex-1">
                <div className="flex flex-col items-center">
                   <div className="text-[9px] font-bold mb-1">TYPE</div>
                   <button className="w-10 h-10 bg-[#555] rounded-full border-b-4 border-[#333] shadow-md"></button>
                </div>
                <div className="flex flex-col items-center">
                   <div className="text-[9px] font-bold mb-1 text-red-700">PROGRAM</div>
                   <button className="w-10 h-10 bg-[#555] rounded-full border-b-4 border-[#333] shadow-md flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                   </button>
                </div>
                <div className="flex flex-col items-center">
                   <div className="text-[9px] font-bold mb-1">BLACKOUT</div>
                   <button onClick={() => { engine.isBlackout = !engine.isBlackout; onStateChange(); }} className="w-10 h-10 bg-[#555] rounded-full border-b-4 border-[#333] shadow-md flex items-center justify-center">
                      <div className={\`w-2 h-2 rounded-full \${engine.isBlackout ? 'bg-red-500 animate-pulse' : 'bg-[#333]'}\`}></div>
                   </button>
                </div>

                <div className="flex flex-col items-center mt-2">
                   <div className="text-[9px] font-bold mb-1">MODE</div>
                   <button className="w-10 h-10 bg-[#cfcabb] rounded border-b-4 border-[#a39d88] shadow-md"></button>
                </div>
                <div className="flex flex-col items-center mt-2">
                   <div className="text-[9px] font-bold mb-1 flex justify-between w-full px-2"><span>◄</span><span>SWING</span><span>►</span></div>
                   <button className="w-10 h-10 bg-[#cfcabb] rounded border-b-4 border-[#a39d88] shadow-md"></button>
                </div>
                <div className="flex flex-col items-center mt-2">
                   <div className="text-[9px] font-bold mb-1">DELETE / CLEAR</div>
                   <button onClick={() => { engine.clearManualOverrides(); onStateChange(); }} className="w-10 h-10 bg-[#cfcabb] rounded border-b-4 border-[#a39d88] shadow-md flex items-center justify-center font-bold text-xs text-red-600">CL</button>
                </div>
             </div>
          </div>

          {/* Rotary Wheels (Speed / Cross) */}
          <div className="flex justify-between items-center bg-[#e3decf] border border-[#a39d88] rounded p-4 mt-2 shadow-inner">
             <div className="flex flex-col items-center relative">
                <div className="text-[10px] font-bold text-[#555] uppercase absolute top-[-25px]">Speed (X)</div>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f5f5f5] to-[#bbb] border-4 border-[#cfcabb] shadow-[0_5px_15px_rgba(0,0,0,0.3)] relative flex items-center justify-center">
                   <input 
                      type="range" min="0" max="100" 
                      value={engine.globalSpeedPercent} 
                      onChange={(e) => { engine.setSpeedPercent(Number(e.target.value)); onStateChange(); }} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10" 
                   />
                   {/* Wheel indents */}
                   <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#999] to-[#eee] absolute top-3 shadow-inner"></div>
                   <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#999] to-[#eee] absolute bottom-3 shadow-inner"></div>
                   <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#999] to-[#eee] absolute left-3 shadow-inner"></div>
                   <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#999] to-[#eee] absolute right-3 shadow-inner"></div>
                </div>
             </div>
             
             <div className="flex flex-col items-center relative">
                <div className="text-[10px] font-bold text-[#555] uppercase absolute top-[-25px]">Cross (Y)</div>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f5f5f5] to-[#bbb] border-4 border-[#cfcabb] shadow-[0_5px_15px_rgba(0,0,0,0.3)] relative flex items-center justify-center">
                   <input 
                      type="range" min="0" max="100" 
                      value={engine.globalCrossPercent} 
                      onChange={(e) => { engine.setCrossPercent(Number(e.target.value)); onStateChange(); }} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10" 
                   />
                   <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#999] to-[#eee] absolute top-4 left-4 shadow-inner"></div>
                   <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#999] to-[#eee] absolute bottom-4 right-4 shadow-inner"></div>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* BOTTOM SECTION: Mode Select & Number Keys */}
      <div className="flex gap-4 mt-6">
        
        {/* Left Side: Mode Buttons */}
        <div className="flex gap-4 bg-[#e3decf] p-2 px-4 rounded border border-[#a39d88] shadow-inner items-center">
           <div className="text-[10px] font-bold tracking-widest text-[#555] mr-4 whitespace-nowrap">FIXTURE CHANNEL &gt;&gt;&gt;</div>
           
           <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                 <div className={\`w-2 h-2 rounded-full \${presetMode === PresetMode.CHASE ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'bg-red-900'}\`}></div>
                 <span className="text-[9px] font-bold text-[#555]">(A) CHASE (B)</span>
              </div>
              <button onClick={() => handleModeChange(PresetMode.CHASE)} className="w-10 h-10 bg-[#cfcabb] rounded border-b-4 border-[#a39d88] shadow-md"></button>
           </div>
           
           <div className="flex flex-col items-center ml-2">
              <div className="flex items-center gap-1 mb-1">
                 <div className={\`w-2 h-2 rounded-full \${presetMode === PresetMode.SCENE ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'bg-red-900'}\`}></div>
                 <span className="text-[9px] font-bold text-[#555]">(A) SCENE (B)</span>
              </div>
              <button onClick={() => handleModeChange(PresetMode.SCENE)} className="w-10 h-10 bg-[#cfcabb] rounded border-b-4 border-[#a39d88] shadow-md"></button>
           </div>
           
           <div className="flex flex-col items-center ml-2">
              <div className="flex items-center gap-1 mb-1">
                 <div className={\`w-2 h-2 rounded-full \${presetMode === PresetMode.FIXTURE ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'bg-red-900'}\`}></div>
                 <span className="text-[9px] font-bold text-[#555]">(A) FIXTURE (B)</span>
              </div>
              <button onClick={() => handleModeChange(PresetMode.FIXTURE)} className="w-10 h-10 bg-white rounded border-b-4 border-[#ccc] shadow-md"></button>
           </div>
        </div>

        {/* Right Side: 16 Number Keys */}
        <div className="flex-1 flex flex-col gap-2 relative">
           <div className="text-[10px] font-bold text-[#555] absolute -top-5 left-0">NUMBER</div>
           
           <div className="grid grid-cols-8 gap-x-2 gap-y-4">
              {Array.from({ length: 16 }).map((_, i) => {
                 const keyNum = i + 1;
                 const isLEDOn = isKeyLEDActive(keyNum);
                 const validFixture = keyNum <= 12;
                 return (
                    <div key={keyNum} className="flex flex-col items-center">
                       <div className="flex items-center gap-1 mb-1 w-full px-1">
                          <span className="text-[10px] font-bold text-[#333] w-4 text-center bg-[#cfcabb] border border-[#a39d88] rounded">{keyNum}</span>
                       </div>
                       <button 
                          onMouseDown={() => { if(validFixture || presetMode !== PresetMode.FIXTURE) handleNumberKey(keyNum, true) }}
                          onMouseUp={() => { if (buttonType === ButtonType.FLASH && presetMode === PresetMode.SCENE) handleNumberKey(keyNum, false); }}
                          onMouseLeave={() => { if (buttonType === ButtonType.FLASH && presetMode === PresetMode.SCENE) handleNumberKey(keyNum, false); }}
                          className={\`w-full h-10 rounded-full border-b-[5px] shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-all flex justify-center items-center \${
                             isLEDOn 
                             ? 'bg-[#333] border-[#111] translate-y-[2px] shadow-[0_2px_4px_rgba(0,0,0,0.4)]' 
                             : 'bg-[#555] border-[#333]'
                          }\`}
                          disabled={presetMode === PresetMode.FIXTURE && !validFixture}
                       >
                          <div className={\`w-2 h-2 rounded-full shadow-inner \${isLEDOn ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)]' : 'bg-red-950'}\`}></div>
                       </button>
                    </div>
                 );
              })}
           </div>
        </div>

      </div>
    </div>
  );
};
`
fs.writeFileSync('src/components/ConsoleControls.tsx', code);
