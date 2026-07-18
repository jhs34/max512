import React, { useState, useEffect } from 'react';
import { Zap, Sliders } from 'lucide-react';
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
  activeScenes: Set<string>;
  flashedScenes: Set<string>;
  activeChases: Map<string, any>;
}

export const ConsoleControls: React.FC<ConsoleControlsProps> = ({
  engine,
  onStateChange,
  selectedFixtureIds,
  activeScenes,
  flashedScenes,
  activeChases
}) => {
  const presetMode = engine.currentPresetMode;
  const bank = engine.currentBank;
  const [triggerMode, setTriggerMode] = useState<TriggerMode>(engine.currentTriggerMode);
  const [buttonType, setButtonType] = useState<ButtonType>(engine.currentButtonType);
  const [direction, setDirection] = useState<1 | -1>(engine.chaseDirection);

  // Sync state variables from the engine
  useEffect(() => {
    setTriggerMode(engine.currentTriggerMode);
    setButtonType(engine.currentButtonType);
    setDirection(engine.chaseDirection);
  }, [
    engine.currentTriggerMode,
    engine.currentButtonType,
    engine.globalSpeedPercent,
    engine.globalCrossPercent,
    engine.isBlackout,
    engine.chaseDirection,
    engine.currentPresetMode,
    engine
  ]);

  const getShortcutLabel = (keyNum: number): string => {
    if (keyNum >= 1 && keyNum <= 9) return String(keyNum);
    if (keyNum === 10) return '0';
    if (keyNum === 11) return '-';
    if (keyNum === 12) return '=';
    if (keyNum === 13) return '[';
    if (keyNum === 14) return ']';
    if (keyNum === 15) return '\\';
    if (keyNum === 16) return 'BS';
    return '';
  };

  // Keyboard shortcut listener for Keypad Grid
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true')) {
        return;
      }

      let keyNum: number | null = null;
      switch (e.key) {
        case '1': keyNum = 1; break;
        case '2': keyNum = 2; break;
        case '3': keyNum = 3; break;
        case '4': keyNum = 4; break;
        case '5': keyNum = 5; break;
        case '6': keyNum = 6; break;
        case '7': keyNum = 7; break;
        case '8': keyNum = 8; break;
        case '9': keyNum = 9; break;
        case '0': keyNum = 10; break;
        case '-': keyNum = 11; break;
        case '=': keyNum = 12; break;
        case '[': keyNum = 13; break;
        case ']': keyNum = 14; break;
        case '\\': keyNum = 15; break;
        case 'Backspace': 
          keyNum = 16; 
          e.preventDefault(); 
          break;
        default:
          return;
      }

      if (keyNum !== null) {
        const isClearKey = keyNum === 16;
        const validFixture = keyNum <= 12;
        if (isClearKey || validFixture || presetMode !== PresetMode.FIXTURE) {
          handleNumberKey(keyNum, true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true')) {
        return;
      }

      let keyNum: number | null = null;
      switch (e.key) {
        case '1': keyNum = 1; break;
        case '2': keyNum = 2; break;
        case '3': keyNum = 3; break;
        case '4': keyNum = 4; break;
        case '5': keyNum = 5; break;
        case '6': keyNum = 6; break;
        case '7': keyNum = 7; break;
        case '8': keyNum = 8; break;
        case '9': keyNum = 9; break;
        case '0': keyNum = 10; break;
        case '-': keyNum = 11; break;
        case '=': keyNum = 12; break;
        case '[': keyNum = 13; break;
        case ']': keyNum = 14; break;
        case '\\': keyNum = 15; break;
        case 'Backspace': keyNum = 16; break;
        default:
          return;
      }

      if (keyNum !== null) {
        const isClearKey = keyNum === 16;
        if (!isClearKey && engine.currentButtonType === ButtonType.FLASH && presetMode === PresetMode.SCENE) {
          handleNumberKey(keyNum, false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [presetMode, engine, bank, buttonType, selectedFixtureIds]);



  const handleModeAndBankChange = (mode: PresetMode, targetBank: 'A' | 'B') => {
    engine.currentPresetMode = mode;
    engine.currentBank = targetBank;

    // Direct hardware check: CHASE or FIXTURE mode forces LATCH or SWOP (Flash is forbidden)
    if (mode !== PresetMode.SCENE && engine.currentButtonType === ButtonType.FLASH) {
      engine.currentButtonType = ButtonType.LATCH;
      setButtonType(ButtonType.LATCH);
    }
    onStateChange();
  };

  const handleTypeButtonClick = () => {
    const curMode = engine.currentPresetMode;
    let nextType: ButtonType = ButtonType.LATCH;

    if (curMode === PresetMode.SCENE) {
      if (buttonType === ButtonType.LATCH) {
        nextType = ButtonType.SWOP;
      } else if (buttonType === ButtonType.SWOP) {
        nextType = ButtonType.FLASH;
      } else {
        nextType = ButtonType.LATCH;
      }
    } else {
      // FLASH is strictly disabled in CHASE & FIXTURE modes
      nextType = buttonType === ButtonType.LATCH ? ButtonType.SWOP : ButtonType.LATCH;
    }

    engine.currentButtonType = nextType;
    setButtonType(nextType);
    onStateChange();
  };

  const handleModeButtonClick = () => {
    // Mode transitions (Auto, Swing) are strictly restricted to CHASE mode!
    if (presetMode !== PresetMode.CHASE) return;

    const nextTrigger: TriggerMode = triggerMode === TriggerMode.Auto
      ? TriggerMode.Swing
      : TriggerMode.Auto;

    engine.currentTriggerMode = nextTrigger;
    setTriggerMode(nextTrigger);
    onStateChange();
  };

  const handleNumberKey = (num: number, isPressed: boolean) => {
    if (num === 16) {
      if (isPressed) {
        engine.clearManualOverrides();
        onStateChange();
      }
      return;
    }

    if (presetMode === PresetMode.FIXTURE) {
      if (isPressed) {
        if (engine.selectedFixtureIds.has(num)) {
          engine.selectedFixtureIds.delete(num);
        } else {
          engine.selectedFixtureIds.add(num);
        }
        onStateChange();
      }
    } else if (presetMode === PresetMode.SCENE) {
      engine.selectSceneButton(num, isPressed);
      onStateChange();
    } else if (presetMode === PresetMode.CHASE) {
      engine.selectChaseButton(num, isPressed);
      onStateChange();
    }
  };

  const faders: { type: DMXChannelType; label: string; color: string }[] = [
    { type: DMXChannelType.Master, label: 'MAS', color: 'bg-amber-500' },
    { type: DMXChannelType.Red, label: 'RED', color: 'bg-red-500' },
    { type: DMXChannelType.Green, label: 'GRN', color: 'bg-green-500' },
    { type: DMXChannelType.Blue, label: 'BLU', color: 'bg-blue-500' },
    { type: DMXChannelType.White, label: 'WHT', color: 'bg-slate-100 text-slate-900' },
    { type: DMXChannelType.Strobe, label: 'STR', color: 'bg-zinc-200 text-black' },
  ];

  const isKeyLEDActive = (num: number): boolean => {
    if (num === 16) {
      return (
        Object.keys(engine.manualOverrides).length > 0 || 
        selectedFixtureIds.size > 0 ||
        activeScenes.size > 0 ||
        flashedScenes.size > 0 ||
        activeChases.size > 0
      );
    }
    const presetId = `${bank}${num}`;
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
    if (engine.isProgramMode) {
      if (presetMode === PresetMode.SCENE) {
        return `P-SCENE: SELECT ${bank}1~15 TO SAVE`;
      }
      if (!engine.programChaseId) {
        return 'P-CHASE: SELECT KEY 1-15 TO REC';
      }
      const stepInfo = engine.programStepIndex >= 0 
        ? `S:${engine.programStepIndex + 1}/${engine.programSteps.length}`
        : 'S:0/0';
      
      if (selectedFixtureIds.size === 0) {
        return `${engine.programChaseId} ${stepInfo} | SELECT F1-12`;
      } else {
        return `${engine.programChaseId} ${stepInfo} | MOVE CH1-6`;
      }
    }
    if (presetMode === PresetMode.SCENE) {
      const activeList = Array.from(new Set([...activeScenes, ...flashedScenes])).map(id => id);
      return activeList.length > 0 ? activeList.join(', ') : 'None Active';
    } else if (presetMode === PresetMode.CHASE) {
      const activeList = Array.from(activeChases.keys());
      if (activeList.length === 0) return 'None Active';
      const lastChaseId = activeList[activeList.length - 1];
      const runtime = activeChases.get(lastChaseId);
      const stepNum = runtime ? String(runtime.currentStepIndex + 1).padStart(3, '0') : '001';
      return `${lastChaseId} Step ${stepNum}#`;
    } else {
      const activeList = Array.from(selectedFixtureIds);
      return activeList.length > 0 ? `F${activeList.join(',F')}` : 'No Fixtures';
    }
  };

  return (
    <div className="flex-1 flex flex-col p-5 bg-[#c2b09a] rounded-xl border-4 border-[#a3927d] select-none text-black font-sans relative overflow-hidden shadow-2xl max-w-full">
      
      {/* Brand Header with Larger Text */}
      <div className="flex justify-between items-end border-b border-[#a3927d] pb-2.5 mb-4">
        <h1 className="text-xl md:text-2xl font-black italic tracking-tighter text-[#1c1c1c]">
          MAX<span className="font-light">512</span> <span className="text-sm font-bold ml-2 text-[#4a4a4a] uppercase tracking-wider not-italic">Stage controller</span>
        </h1>
        <h2 className="text-2xl font-black text-[#2e2e2e] tracking-tighter">Net.DO</h2>
      </div>

      {engine.isProgramMode && (
        <div className="bg-[#fef2f2] border-2 border-red-500 rounded-lg p-3.5 mb-4 text-red-950 shadow-[0_0_15px_rgba(239,68,68,0.15)] flex flex-col gap-2 md:flex-row md:items-center justify-between">
          <div className="flex items-start gap-2.5">
            <span className="relative flex h-3.5 w-3.5 mt-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
            </span>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-black text-[10px] tracking-wider uppercase bg-red-600 text-white px-1.5 py-0.5 rounded">PROGRAM MODE ACTIVATED</span>
                {engine.programChaseId && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] px-1.5 py-0.5 rounded uppercase">FIXTURE CONTROL ON</span>
                )}
              </div>
              <p className="text-xs font-bold mt-1.5 text-gray-800">
                {presetMode === PresetMode.SCENE ? (
                  <>현재 <span className="underline font-black text-emerald-700">Scene 저장 대기 모드</span>입니다. 1~15번 숫자 버튼 중 원하는 슬롯을 누르면 현재 연출한 임시 조명이 영구 저장되며 프로그램 모드를 자동 탈출합니다!</>
                ) : engine.programChaseId ? (
                  <>현재 <span className="underline font-black text-red-700">Chase {engine.programChaseId}</span>를 편집 중입니다. <span className="font-extrabold text-blue-900">Step {engine.programStepIndex + 1}/{engine.programSteps.length}</span></>
                ) : (
                  <>현재 <span className="underline font-black text-red-700">프로그램 저장 대기 모드</span>입니다. <span className="font-extrabold text-blue-950">SCENE A/B</span>를 누르면 Scene 저장, <span className="font-extrabold text-blue-950">CHASE A/B</span>를 누르면 Chase 녹화가 가능합니다.</>
                )}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                {presetMode === PresetMode.SCENE
                  ? "팁: 1단계에서 수동 조명 연출(F1-12 조명 선택 후 Fader 조작)한 임시 조명 값들이 그대로 해당 Scene 슬롯에 영구 저장됩니다."
                  : engine.programChaseId 
                    ? "팁: 키패드(F1-F12)에서 조명을 선택하고 fader를 올리면 해당 Step에 값이 기록됩니다." 
                    : "Chase 프리셋을 선택하면 자동으로 조명 선택 모드(FIXTURE)로 변경되어 첫 단계를 기록할 수 있습니다."
                }
              </p>
            </div>
          </div>
          {engine.programChaseId && (
            <div className="flex flex-col gap-1.5 mt-2 md:mt-0 font-mono text-[10px] bg-red-50 p-2 rounded border border-red-200">
              <span className="font-extrabold text-red-800">● STEP+ : 현재 씬 저장 후 다음 단계로 복사/이동</span>
              <span className="font-extrabold text-red-800">● STEP- : 이전 단계로 돌아가서 확인/수정</span>
              <span className="font-extrabold text-red-800">● PROG 다시 누르기 : 전체 단계 저장 후 종료</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-5 flex-col md:flex-row">
        
        {/* LEFT COLUMN: MANUAL FADERS (Taller, highly precise, with larger fonts) */}
        <div className="w-full md:w-[48%] flex flex-col border border-[#a3927d] p-4 rounded-lg bg-[#d9cbb8] shadow-inner">
          <div className="text-sm md:text-base font-black text-[#222] uppercase mb-4 text-center border-b border-[#a3927d] pb-2">
            Manual Faders (CH 1 - 6)
          </div>
          
          <div className="grid grid-cols-6 gap-2">
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

              // Color configs for different channels
              const faderColorMap: Record<DMXChannelType, { glow: string; off: string; stripe: string }> = {
                [DMXChannelType.Master]: { glow: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]', off: 'bg-amber-950/70', stripe: 'bg-amber-400' },
                [DMXChannelType.Red]: { glow: 'bg-red-500 shadow-[0_0_8px_#ef4444]', off: 'bg-red-950/70', stripe: 'bg-red-500' },
                [DMXChannelType.Green]: { glow: 'bg-emerald-500 shadow-[0_0_8px_#10b981]', off: 'bg-emerald-950/70', stripe: 'bg-emerald-400' },
                [DMXChannelType.Blue]: { glow: 'bg-blue-500 shadow-[0_0_8px_#3b82f6]', off: 'bg-blue-950/70', stripe: 'bg-blue-500' },
                [DMXChannelType.White]: { glow: 'bg-zinc-100 shadow-[0_0_8px_#e4e4e7]', off: 'bg-zinc-600/70', stripe: 'bg-zinc-300' },
                [DMXChannelType.Strobe]: { glow: 'bg-fuchsia-500 shadow-[0_0_8px_#d946ef]', off: 'bg-fuchsia-950/70', stripe: 'bg-fuchsia-400' },
              };
              const activeColor = faderColorMap[fader.type];

              return (
                <div key={fader.type} className="flex flex-col items-center bg-[#cbbfaf]/25 rounded-lg p-1.5 border border-[#a3927d]/25 shadow-sm">
                  <div className="text-[10px] md:text-xs font-black text-gray-800 mb-1">CH{idx + 1}</div>
                  
                  {/* Status LED Indicator for active fader overrides */}
                  <div className={`w-2.5 h-2.5 rounded-full ${isOverridden ? activeColor.glow : 'bg-gray-600'} mb-2 transition-all`}></div>
                  
                  {/* Fader Track - Wider, Metallic Groove with Tick Marks */}
                  <div className="relative h-44 md:h-56 w-8 bg-gradient-to-b from-[#12110f] to-[#201c18] border border-[#a3927d]/80 rounded-md flex justify-center py-2.5 shadow-[inset_0_4px_8px_rgba(0,0,0,0.85)]">
                    
                    {/* Tick Mark lines across track */}
                    <div className="absolute inset-y-3 left-1.5 right-1.5 flex flex-col justify-between pointer-events-none opacity-30">
                      {[...Array(11)].map((_, i) => (
                        <div key={i} className="w-full h-[1px] bg-white/50"></div>
                      ))}
                    </div>

                    {/* Numeric level ticks on left side */}
                    <div className="absolute left-0.5 top-0 bottom-0 flex flex-col justify-between py-2 text-[8px] text-gray-400 font-mono font-bold pointer-events-none select-none">
                      <span>10</span><span>5</span><span>0</span>
                    </div>

                    {/* Center slit guide */}
                    <div className="absolute w-[2px] h-full bg-[#050505] left-1/2 -translate-x-1/2"></div>
                    
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentVal}
                      disabled={selectedFixtureIds.size === 0}
                      onChange={(e) => {
                        engine.handleFaderMove(fader.type, parseInt(e.target.value, 10));
                        onStateChange();
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-10 [writing-mode:vertical-lr]"
                      style={{ transform: 'rotate(180deg)' }}
                    />
                    
                    {/* Fader Knob - Thick, Metallic, Tactile, and Parameter Stripe */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-8 h-7 bg-gradient-to-b ${selectedFixtureIds.size === 0 ? 'from-gray-500 to-gray-700 opacity-40' : 'from-[#333] via-[#4d4c4a] to-[#222]'} border-2 border-[#111] shadow-[0_4px_8px_rgba(0,0,0,0.6)] rounded pointer-events-none flex flex-col items-center justify-center gap-[2px]`}
                      style={{ bottom: `calc(${currentVal}% - 14px)` }}
                    >
                      {/* Tactile grips */}
                      <div className="w-5 h-[1.5px] bg-black/60"></div>
                      {/* Color indicator stripe */}
                      <div className={`w-5 h-[3px] rounded-sm ${selectedFixtureIds.size === 0 ? 'bg-gray-600' : isOverridden ? activeColor.stripe + ' shadow-[0_0_4px_rgba(255,255,255,0.8)]' : activeColor.stripe + '/50'}`}></div>
                      <div className="w-5 h-[1.5px] bg-black/60"></div>
                    </div>
                  </div>

                  {/* Digital Segment-Style LED Readout */}
                  <div className="mt-2 bg-[#0d0f0c] border border-[#374229] rounded px-1 py-0.5 h-5 w-11 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)] font-mono font-bold text-[9px] tracking-widest">
                    <span className={selectedFixtureIds.size === 0 ? 'text-gray-700' : isOverridden ? 'text-[#bef264] drop-shadow-[0_0_2px_rgba(190,242,100,0.8)]' : 'text-[#65a30d]'}>
                      {selectedFixtureIds.size === 0 ? '---' : String(currentVal).padStart(3, '0')}
                    </span>
                  </div>

                  <div className="text-[10px] font-black mt-1.5 text-gray-800 tracking-tight text-center uppercase leading-none">{fader.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: LCD SCREEN, SYSTEM STATUS LEDS, 2x3 KEY CONTROL GRID, ROTARY WHEELS */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* LCD Screen with noticeably larger fonts */}
          <div className="bg-[#a3927d] p-2.5 rounded-lg border border-[#948470] flex justify-center shadow-inner">
             <div className="bg-[#aac487] border-2 border-[#6c7d54] w-full h-20 rounded flex flex-col p-2.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between text-[#1a230e] font-mono text-xs md:text-sm font-black uppercase tracking-wide">
                   {engine.isProgramMode ? (
                     <span className="text-red-900 font-extrabold animate-pulse flex items-center gap-1">
                       <span className="w-2.5 h-2.5 rounded-full bg-red-700 inline-block animate-ping"></span>
                       REC:{presetMode}-{bank}
                     </span>
                   ) : (
                     <span>MODE: {presetMode}-{bank}</span>
                   )}
                   <span>SPD: {engine.globalSpeedPercent}%</span>
                   <span>CROSS: {engine.globalCrossPercent}%</span>
                </div>
                <div className="flex justify-between text-[#000] font-mono text-sm md:text-base font-black mt-auto border-t border-[#6c7d54]/35 pt-1.5">
                   <span className="truncate max-w-[240px]">Active: {getLCDActivePresetString()}</span>
                   <span>{engine.isBlackout ? 'BLACKOUT' : 'READY'}</span>
                </div>
             </div>
          </div>

          {/* Indicators & Control Grid Row */}
          <div className="flex gap-2.5 flex-row-reverse w-full">
             
             {/* Passive LED Status indicators showing exact console settings */}
             <div className="flex flex-col gap-2 bg-[#d9cbb8] border border-[#a3927d] p-2 sm:p-3 rounded-lg justify-center shadow-inner w-[110px] sm:w-[125px] flex-shrink-0">
                <div className="text-center text-[10px] font-black text-gray-600 border-b border-[#a3927d]/55 pb-1 uppercase tracking-widest">
                   STATUS
                </div>
                
                {/* LATCH LED (Red) */}
                <div className="flex items-center gap-2 justify-between">
                   <span className="text-xs font-black text-gray-700">LATCH</span>
                   <div className={`w-3.5 h-3.5 rounded-full border border-black/35 ${buttonType === ButtonType.LATCH ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-red-950'}`}></div>
                </div>

                {/* SWOP LED (Red) */}
                <div className="flex items-center gap-2 justify-between">
                   <span className="text-xs font-black text-gray-700">SWOP</span>
                   <div className={`w-3.5 h-3.5 rounded-full border border-black/35 ${buttonType === ButtonType.SWOP ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-red-950'}`}></div>
                </div>

                {/* FLASH Indicator - Derived when both LATCH and SWOP are OFF */}
                <div className="flex items-center gap-2 justify-between border-t border-[#a3927d]/40 pt-1">
                   <span className="text-xs font-black text-gray-700">FLASH</span>
                   <div className={`w-3.5 h-3.5 rounded-full border border-black/35 ${buttonType === ButtonType.FLASH ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-amber-950'}`}></div>
                </div>

                {/* Beat Sync Type indicators */}
                <div className="border-t border-[#a3927d]/50 pt-1.5 flex flex-col gap-1">
                   <div className="flex items-center gap-2 justify-between">
                      <span className="text-[10px] font-black text-gray-600">AUTO</span>
                      <div className={`w-2.5 h-2.5 rounded-full ${triggerMode === TriggerMode.Auto ? 'bg-green-500 shadow-[0_0_6px_#22c55e]' : 'bg-green-950'}`}></div>
                   </div>
                   <div className="flex items-center gap-2 justify-between">
                      <span className="text-[10px] font-black text-gray-600">SWING</span>
                      <div className={`w-2.5 h-2.5 rounded-full ${triggerMode === TriggerMode.Swing ? 'bg-cyan-500 shadow-[0_0_6px_#06b6d4]' : 'bg-cyan-950'}`}></div>
                   </div>

                </div>
             </div>
             
             {/* EDIT, TYPE & MODE - Exact 2x3 tactile button grid */}
             <div className="grid grid-cols-3 gap-1.5 sm:gap-2 flex-1 bg-[#d9cbb8] border border-[#a3927d] p-2 sm:p-3 rounded-lg shadow-inner">
                
                {/* Row 1 Col 1: TYPE (ButtonType selector) */}
                <div className="flex flex-col items-center justify-center p-1 bg-[#cbbcb1]/20 rounded border border-[#a3927d]/20 overflow-hidden">
                   <div className="text-[10px] sm:text-xs font-black mb-1.5 text-center text-gray-800 uppercase tracking-tighter truncate w-full">TYPE</div>
                   <button 
                     onClick={handleTypeButtonClick}
                     className="w-10 h-10 bg-[#3a3a3a] active:bg-[#1a1a1a] rounded-full border-b-[3px] border-[#1e1e1e] active:border-b-0 shadow-lg active:translate-y-[2px] transition-all flex items-center justify-center group"
                     title="Cycle trigger types: LATCH -> SWOP -> FLASH"
                   >
                     <div className={`w-2.5 h-2.5 rounded-full transition-all ${buttonType === ButtonType.FLASH ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-red-500 shadow-[0_0_6px_#ef4444]'}`}></div>
                   </button>
                   <span className="text-[8px] sm:text-[10px] font-black text-gray-600 mt-1 uppercase truncate w-full text-center">{buttonType}</span>
                </div>

                {/* Row 1 Col 2: PROGRAM (PROG, enters/exits program mode) */}
                <div className="flex flex-col items-center justify-center p-1 bg-[#cbbcb1]/20 rounded border border-[#a3927d]/20 overflow-hidden">
                   <div className={`text-[10px] sm:text-xs font-black mb-1.5 text-center uppercase tracking-tighter transition-all truncate w-full ${engine.isProgramMode ? 'text-red-600 font-extrabold' : 'text-gray-800'}`}>
                     {engine.isProgramMode ? 'PROG●' : 'PROG'}
                   </div>
                   <button 
                     onClick={() => { engine.toggleProgramMode(); onStateChange(); }} 
                     className={`w-10 h-10 rounded-full border-b-[3px] shadow-lg active:translate-y-[2px] transition-all flex items-center justify-center ${engine.isProgramMode ? 'bg-red-600 border-red-800 hover:bg-red-500 active:bg-red-700' : 'bg-[#3a3a3a] border-[#1a1a1a] hover:bg-[#2c2c2c]'}`}
                     title="Toggle Program Edit Mode"
                   >
                      <div className={`w-3.5 h-3.5 rounded-full ${engine.isProgramMode ? 'bg-white animate-pulse' : 'bg-[#111]'}`}></div>
                   </button>
                   <span className="text-[8px] sm:text-[10px] font-black text-gray-600 mt-1 uppercase truncate w-full text-center">{engine.isProgramMode ? 'RECORDING' : 'PLAYBACK'}</span>
                </div>

                {/* Row 1 Col 3: BLACKOUT */}
                <div className="flex flex-col items-center justify-center p-1 bg-[#cbbcb1]/20 rounded border border-[#a3927d]/20 overflow-hidden">
                   <div className="text-[10px] sm:text-xs font-black mb-1.5 text-center text-gray-800 uppercase tracking-tighter truncate w-full">BLACKOUT</div>
                   <button 
                     onClick={() => { engine.isBlackout = !engine.isBlackout; onStateChange(); }} 
                     className={`w-10 h-10 rounded-full border-b-[3px] shadow-lg active:translate-y-[2px] transition-all flex items-center justify-center ${engine.isBlackout ? 'bg-red-600 border-red-800 shadow-[0_0_8px_#ef4444]' : 'bg-[#3a3a3a] border-[#1e1e1e] hover:bg-[#2c2c2c]'}`}
                     title="Blackout DMX outputs"
                   >
                      <div className={`w-2 h-2 rounded-full ${engine.isBlackout ? 'bg-white' : 'bg-[#111]'}`}></div>
                   </button>
                   <span className="text-[8px] sm:text-[10px] font-black text-gray-600 mt-1 uppercase truncate w-full text-center">{engine.isBlackout ? 'KILL DMX' : 'LIVE'}</span>
                </div>

                {/* Row 2 Col 1: MODE (TriggerMode selector - replaces old TAP) */}
                <div className={`flex flex-col items-center justify-center p-1 bg-[#cbbcb1]/20 rounded border border-[#a3927d]/20 transition-all ${presetMode !== PresetMode.CHASE ? 'opacity-40 cursor-not-allowed' : ''}`}>
                   <div className="text-xs font-black mb-1.5 text-center text-gray-800 uppercase tracking-tighter truncate w-full">MODE</div>
                   <button 
                     onClick={handleModeButtonClick}
                     disabled={presetMode !== PresetMode.CHASE}
                     className={`w-10 h-10 rounded-full border-b-[3px] shadow-lg transition-all flex items-center justify-center ${
                       presetMode === PresetMode.CHASE 
                         ? 'bg-gradient-to-b from-[#4d3d2e] to-[#2c221a] text-amber-500 border-[#1c140f] active:translate-y-[2px] active:border-b-0 cursor-pointer hover:from-[#5e4b39]' 
                         : 'bg-gray-600 border-gray-800 text-gray-400 cursor-not-allowed'
                     }`}
                     title={presetMode === PresetMode.CHASE ? "Cycle tempo modes: Auto -> Swing" : "Only works in Chase Mode"}
                   >
                     <Zap className={`w-4 h-4 ${presetMode === PresetMode.CHASE ? 'text-amber-400 animate-pulse' : 'text-gray-400'}`} />
                   </button>
                   <span className="text-[8px] sm:text-[10px] font-black text-gray-600 mt-1 uppercase truncate w-full text-center">{presetMode === PresetMode.CHASE ? triggerMode : 'BLOCKED'}</span>
                </div>

                {/* Row 2 Col 2: SWING L (STEP- in program mode) */}
                <div className="flex flex-col items-center justify-center p-1 bg-[#cbbcb1]/20 rounded border border-[#a3927d]/20">
                   <div className="text-xs font-black mb-1.5 text-center text-gray-800 uppercase tracking-tighter truncate w-full">
                     {engine.isProgramMode ? 'STEP-' : 'SWING ◀'}
                   </div>
                   <button 
                     onClick={() => { 
                       if (engine.isProgramMode) {
                         engine.handleProgramStepDecrement();
                       } else {
                         engine.handleSwingTap(-1);
                         setDirection(-1);
                       }
                       onStateChange(); 
                     }} 
                     className={`w-10 h-10 rounded-lg border-b-[3px] shadow-lg active:translate-y-[2px] active:border-b-0 flex items-center justify-center font-black text-sm transition-all ${
                       !engine.isProgramMode && direction === -1 && triggerMode === TriggerMode.Swing
                       ? 'bg-[#1e1e1e] border-black text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]' 
                       : 'bg-[#beb09a] border-[#a3927d] text-[#111] hover:bg-[#b5a590]'
                     }`}
                     title={engine.isProgramMode ? "Decrement program step" : "Tap rhythm L / Swing reverse"}
                   >
                     ◀
                   </button>
                   <span className="text-[8px] sm:text-[10px] font-black text-gray-600 mt-1 uppercase truncate w-full text-center">{engine.isProgramMode ? 'PREV' : 'TAP L'}</span>
                </div>

                {/* Row 2 Col 3: SWING R (STEP+ in program mode) */}
                <div className="flex flex-col items-center justify-center p-1 bg-[#cbbcb1]/20 rounded border border-[#a3927d]/20">
                   <div className="text-xs font-black mb-1.5 text-center text-gray-800 uppercase tracking-tighter truncate w-full">
                     {engine.isProgramMode ? 'STEP+' : 'SWING ▶'}
                   </div>
                   <button 
                     onClick={() => { 
                       if (engine.isProgramMode) {
                         engine.handleProgramStepIncrement();
                       } else {
                         engine.handleSwingTap(1);
                         setDirection(1);
                       }
                       onStateChange(); 
                     }} 
                     className={`w-10 h-10 rounded-lg border-b-[3px] shadow-lg active:translate-y-[2px] active:border-b-0 flex items-center justify-center font-black text-sm transition-all ${
                        !engine.isProgramMode && direction === 1 && triggerMode === TriggerMode.Swing
                        ? 'bg-[#1e1e1e] border-black text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]' 
                        : 'bg-[#beb09a] border-[#a3927d] text-[#111] hover:bg-[#b5a590]'
                      }`}
                      title={engine.isProgramMode ? "Increment/Add program step" : "Tap rhythm R / Swing forward"}
                    >
                      ▶
                    </button>
                    <span className="text-[8px] sm:text-[10px] font-black text-gray-600 mt-1 uppercase truncate w-full text-center">{engine.isProgramMode ? 'NEXT' : 'TAP R'}</span>
                 </div>

              </div>
           </div>

           {/* DESKTOP-ONLY: Speed / Cross Stacked Horizontal Sliders under grid row */}
           <div className="hidden xl:flex flex-col gap-3.5 bg-[#d9cbb8] border border-[#a3927d] rounded-lg p-4 shadow-inner mt-4">
              {/* Speed Rate Slider */}
              <div className="flex flex-col gap-1">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center gap-1">⚡ SPEED RATE (속도 조절)</span>
                    <span className="text-xs font-mono font-black text-sky-800 bg-sky-100 border border-sky-300 px-1.5 py-0.5 rounded shadow-sm">{engine.globalSpeedPercent}%</span>
                 </div>
                 <div className="relative flex items-center h-8">
                    <input 
                       type="range" min="0" max="100" 
                       value={engine.globalSpeedPercent} 
                       onChange={(e) => { engine.setSpeedPercent(Number(e.target.value)); onStateChange(); }} 
                       className="w-full h-2.5 bg-[#1a1410] rounded-full appearance-none cursor-pointer border border-[#a3927d]/40 outline-none
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-[#60a5fa] [&::-webkit-slider-thumb]:to-[#2563eb] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-b [&::-moz-range-thumb]:from-[#60a5fa] [&::-moz-range-thumb]:to-[#2563eb] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                    />
                 </div>
              </div>

              {/* Cross Fade Slider Row */}
              <div className="flex flex-col gap-1">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center gap-1">🎚️ CROSS FADE (크로스 페이드)</span>
                    <span className="text-xs font-mono font-black text-purple-800 bg-purple-100 border border-purple-300 px-1.5 py-0.5 rounded shadow-sm">{engine.globalCrossPercent}%</span>
                 </div>
                 <div className="relative flex items-center h-8">
                    <input 
                       type="range" min="0" max="100" 
                       value={engine.globalCrossPercent} 
                       onChange={(e) => { engine.setCrossPercent(Number(e.target.value)); onStateChange(); }} 
                       className="w-full h-2.5 bg-[#1a1410] rounded-full appearance-none cursor-pointer border border-[#a3927d]/40 outline-none
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-[#c084fc] [&::-webkit-slider-thumb]:to-[#9333ea] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-b [&::-moz-range-thumb]:from-[#c084fc] [&::-moz-range-thumb]:to-[#9333ea] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                    />
                 </div>
              </div>
           </div>

        </div>
      </div>

      {/* BOTTOM SECTION: Mode Direct Buttons & Keypad */}
      <div className="flex gap-4 mt-5 flex-col xl:flex-row">
        
        {/* DESKTOP-ONLY Left Side: Direct Select Bank Buttons (Bigger Text, 2x3 Grid) */}
        <div className="hidden xl:grid grid-cols-2 gap-2 bg-[#d9cbb8] p-3 rounded-lg border border-[#a3927d] shadow-inner w-full xl:w-[240px]">
            <div className="col-span-2 text-xs md:text-sm font-black text-center text-[#333] tracking-wider border-b border-[#a3927d]/40 pb-1.5 mb-1.5">
               DIRECT SELECT BANK
            </div>
            
            {/* CHASE A */}
            <button 
              onClick={() => handleModeAndBankChange(PresetMode.CHASE, 'A')}
              className={`px-3 py-2 rounded-lg border-2 text-xs font-black flex flex-col items-center transition-all ${
                presetMode === PresetMode.CHASE && bank === 'A' 
                  ? 'bg-[#1a1a1a] border-cyan-500 text-cyan-400 shadow-lg' 
                  : (engine.isProgramMode && engine.programChaseId?.startsWith('A'))
                  ? 'bg-red-50 border-red-500 text-red-700 animate-pulse'
                  : 'bg-[#beaf9b] border-[#a3927d] hover:bg-[#b5a590]'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mb-1.5 ${
                presetMode === PresetMode.CHASE && bank === 'A' 
                  ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' 
                  : (engine.isProgramMode && engine.programChaseId?.startsWith('A'))
                  ? 'bg-red-600 shadow-[0_0_8px_#ef4444]'
                  : 'bg-red-950'
              }`}></div>
              CHASE A {engine.isProgramMode && engine.programChaseId?.startsWith('A') && '●'}
            </button>
            
            {/* CHASE B */}
            <button 
              onClick={() => handleModeAndBankChange(PresetMode.CHASE, 'B')}
              className={`px-3 py-2 rounded-lg border-2 text-xs font-black flex flex-col items-center transition-all ${
                presetMode === PresetMode.CHASE && bank === 'B' 
                  ? 'bg-[#1a1a1a] border-cyan-500 text-cyan-400 shadow-lg' 
                  : (engine.isProgramMode && engine.programChaseId?.startsWith('B'))
                  ? 'bg-red-50 border-red-500 text-red-700 animate-pulse'
                  : 'bg-[#beaf9b] border-[#a3927d] hover:bg-[#b5a590]'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mb-1.5 ${
                presetMode === PresetMode.CHASE && bank === 'B' 
                  ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' 
                  : (engine.isProgramMode && engine.programChaseId?.startsWith('B'))
                  ? 'bg-red-600 shadow-[0_0_8px_#ef4444]'
                  : 'bg-red-950'
              }`}></div>
              CHASE B {engine.isProgramMode && engine.programChaseId?.startsWith('B') && '●'}
            </button>

            {/* SCENE A */}
            <button 
              onClick={() => handleModeAndBankChange(PresetMode.SCENE, 'A')}
              className={`px-3 py-2 rounded-lg border-2 text-xs font-black flex flex-col items-center transition-all ${presetMode === PresetMode.SCENE && bank === 'A' ? 'bg-[#1a1a1a] border-cyan-500 text-cyan-400 shadow-lg' : 'bg-[#beaf9b] border-[#a3927d] hover:bg-[#b5a590]'}`}
            >
              <div className={`w-2 h-2 rounded-full mb-1.5 ${presetMode === PresetMode.SCENE && bank === 'A' ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' : 'bg-red-950'}`}></div>
              SCENE A
            </button>
            
            {/* SCENE B */}
            <button 
              onClick={() => handleModeAndBankChange(PresetMode.SCENE, 'B')}
              className={`px-3 py-2 rounded-lg border-2 text-xs font-black flex flex-col items-center transition-all ${presetMode === PresetMode.SCENE && bank === 'B' ? 'bg-[#1a1a1a] border-cyan-500 text-cyan-400 shadow-lg' : 'bg-[#beaf9b] border-[#a3927d] hover:bg-[#b5a590]'}`}
            >
              <div className={`w-2 h-2 rounded-full mb-1.5 ${presetMode === PresetMode.SCENE && bank === 'B' ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' : 'bg-red-950'}`}></div>
              SCENE B
            </button>

            {/* FIXTURE A */}
            <button 
              onClick={() => handleModeAndBankChange(PresetMode.FIXTURE, 'A')}
              className={`px-3 py-2 rounded-lg border-2 text-xs font-black flex flex-col items-center transition-all ${presetMode === PresetMode.FIXTURE && bank === 'A' ? 'bg-[#1a1a1a] border-cyan-500 text-cyan-400 shadow-lg' : 'bg-[#beaf9b] border-[#a3927d] hover:bg-[#b5a590]'}`}
            >
              <div className={`w-2 h-2 rounded-full mb-1.5 ${presetMode === PresetMode.FIXTURE && bank === 'A' ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' : 'bg-red-950'}`}></div>
              FIXTURE A
            </button>
            
            {/* FIXTURE B */}
            <button 
              onClick={() => handleModeAndBankChange(PresetMode.FIXTURE, 'B')}
              className={`px-3 py-2 rounded-lg border-2 text-xs font-black flex flex-col items-center transition-all ${presetMode === PresetMode.FIXTURE && bank === 'B' ? 'bg-[#1a1a1a] border-cyan-500 text-cyan-400 shadow-lg' : 'bg-[#beaf9b] border-[#a3927d] hover:bg-[#b5a590]'}`}
            >
              <div className={`w-2 h-2 rounded-full mb-1.5 ${presetMode === PresetMode.FIXTURE && bank === 'B' ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' : 'bg-red-950'}`}></div>
              FIXTURE B
            </button>
        </div>

        {/* MOBILE/TABLET Left Side: Combined Bank/Mode Selector (Blue Box) & Speed/Cross Sliders (Red Box) */}
        <div className="flex flex-row gap-2.5 w-full xl:hidden">
          {/* Blue Box: Bank & Mode Select Panel */}
          <div id="bank-mode-selector-panel" className="w-[115px] sm:w-[135px] flex-shrink-0 bg-[#d9cbb8] p-2 sm:p-2.5 rounded-lg border-2 border-cyan-600/40 shadow-inner flex flex-col justify-between">
            <div className="text-[10px] md:text-xs font-black text-center text-[#111] tracking-wider border-b border-[#a3927d]/40 pb-1 mb-2 uppercase">
               BANK / MODE
            </div>
            
            {/* Bank Selection (A / B) */}
            <div className="flex gap-1.5 mb-2.5">
               <button 
                 onClick={() => handleModeAndBankChange(presetMode, 'A')}
                 className={`flex-1 py-1 rounded border text-[10px] font-black flex items-center justify-center gap-1 transition-all ${
                   bank === 'A' 
                     ? 'bg-[#1a1a1a] border-cyan-500 text-cyan-400 shadow-sm' 
                     : 'bg-[#beaf9b] border-[#a3927d] text-gray-800 hover:bg-[#b5a590]'
                 }`}
               >
                 <div className={`w-1.5 h-1.5 rounded-full ${bank === 'A' ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' : 'bg-red-950'}`}></div>
                 A
               </button>
               <button 
                 onClick={() => handleModeAndBankChange(presetMode, 'B')}
                 className={`flex-1 py-1 rounded border text-[10px] font-black flex items-center justify-center gap-1 transition-all ${
                   bank === 'B' 
                     ? 'bg-[#1a1a1a] border-cyan-500 text-cyan-400 shadow-sm' 
                     : 'bg-[#beaf9b] border-[#a3927d] text-gray-800 hover:bg-[#b5a590]'
                 }`}
               >
                 <div className={`w-1.5 h-1.5 rounded-full ${bank === 'B' ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' : 'bg-red-950'}`}></div>
                 B
               </button>
            </div>

            {/* Mode Selection (CHASE / SCENE / FIXTURE) */}
            <div className="flex flex-col gap-1.5 flex-1 justify-center">
               {/* CHASE */}
               <button 
                 onClick={() => handleModeAndBankChange(PresetMode.CHASE, bank)}
                 className={`py-1.5 px-2 rounded-lg border-2 text-[10px] font-black flex items-center justify-between transition-all ${
                   presetMode === PresetMode.CHASE 
                     ? 'bg-[#1a1a1a] border-cyan-500 text-cyan-400 shadow-md' 
                     : (engine.isProgramMode && engine.programChaseId)
                     ? 'bg-red-50 border-red-500 text-red-700 animate-pulse'
                     : 'bg-[#beaf9b] border-[#a3927d] hover:bg-[#b5a590]'
                 }`}
               >
                 <span className="flex items-center gap-1">
                   <Zap className="w-3 h-3" />
                   CHASE
                 </span>
                 <div className={`w-1.5 h-1.5 rounded-full ${
                   presetMode === PresetMode.CHASE 
                     ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' 
                     : (engine.isProgramMode && engine.programChaseId)
                     ? 'bg-red-600 shadow-[0_0_8px_#ef4444]'
                     : 'bg-red-950'
                  }`}></div>
               </button>

               {/* SCENE */}
               <button 
                 onClick={() => handleModeAndBankChange(PresetMode.SCENE, bank)}
                 className={`py-1.5 px-2 rounded-lg border-2 text-[10px] font-black flex items-center justify-between transition-all ${
                   presetMode === PresetMode.SCENE 
                     ? 'bg-[#1a1a1a] border-cyan-500 text-cyan-400 shadow-md' 
                     : 'bg-[#beaf9b] border-[#a3927d] hover:bg-[#b5a590]'
                 }`}
               >
                 <span className="flex items-center gap-1">
                   <Sliders className="w-3 h-3" />
                   SCENE
                 </span>
                 <div className={`w-1.5 h-1.5 rounded-full ${presetMode === PresetMode.SCENE ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' : 'bg-red-950'}`}></div>
               </button>

               {/* FIXTURE */}
               <button 
                 onClick={() => handleModeAndBankChange(PresetMode.FIXTURE, bank)}
                 className={`py-1.5 px-2 rounded-lg border-2 text-[10px] font-black flex items-center justify-between transition-all ${
                   presetMode === PresetMode.FIXTURE 
                     ? 'bg-[#1a1a1a] border-cyan-500 text-cyan-400 shadow-md' 
                     : 'bg-[#beaf9b] border-[#a3927d] hover:bg-[#b5a590]'
                 }`}
               >
                 <span className="flex items-center gap-1">
                   <Sliders className="w-3 h-3" />
                   FIXTURE
                 </span>
                 <div className={`w-1.5 h-1.5 rounded-full ${presetMode === PresetMode.FIXTURE ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' : 'bg-red-950'}`}></div>
               </button>
            </div>
          </div>

          {/* Red Box: Speed & Cross Sliders Panel */}
          <div id="speed-cross-sliders-panel" className="flex-1 bg-[#d9cbb8] p-2 sm:p-3.5 rounded-lg border-2 border-red-600/40 shadow-inner flex flex-col justify-between">
            <div className="text-xs md:text-sm font-black text-center text-[#111] tracking-wider border-b border-[#a3927d]/40 pb-1.5 mb-3 uppercase">
               RATE & FADE SLIDERS
            </div>
            
            {/* Speed Rate Slider */}
            <div className="flex flex-col gap-1 mb-4 flex-1 justify-center">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center gap-1">⚡ SPEED (속도)</span>
                  <span className="text-[10px] font-mono font-black text-sky-800 bg-sky-100 border border-sky-300 px-1.5 py-0.5 rounded shadow-sm">{engine.globalSpeedPercent}%</span>
               </div>
               <div className="relative flex items-center h-8">
                  <input 
                     type="range" min="0" max="100" 
                     value={engine.globalSpeedPercent} 
                     onChange={(e) => { engine.setSpeedPercent(Number(e.target.value)); onStateChange(); }} 
                     className="w-full h-2 bg-[#1a1410] rounded-full appearance-none cursor-pointer border border-[#a3927d]/40 outline-none
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-[#60a5fa] [&::-webkit-slider-thumb]:to-[#2563eb] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-b [&::-moz-range-thumb]:from-[#60a5fa] [&::-moz-range-thumb]:to-[#2563eb] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                  />
               </div>
            </div>

            {/* Cross Fade Slider */}
            <div className="flex flex-col gap-1 flex-1 justify-center">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center gap-1">🎚️ CROSS (크로스)</span>
                  <span className="text-[10px] font-mono font-black text-purple-800 bg-purple-100 border border-purple-300 px-1.5 py-0.5 rounded shadow-sm">{engine.globalCrossPercent}%</span>
               </div>
               <div className="relative flex items-center h-8">
                  <input 
                     type="range" min="0" max="100" 
                     value={engine.globalCrossPercent} 
                     onChange={(e) => { engine.setCrossPercent(Number(e.target.value)); onStateChange(); }} 
                     className="w-full h-2 bg-[#1a1410] rounded-full appearance-none cursor-pointer border border-[#a3927d]/40 outline-none
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-[#c084fc] [&::-webkit-slider-thumb]:to-[#9333ea] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-b [&::-moz-range-thumb]:from-[#c084fc] [&::-moz-range-thumb]:to-[#9333ea] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Keypad Grid (With larger font numbers and keys) */}
        <div className="flex-1 flex flex-col gap-2 relative bg-[#d9cbb8] border border-[#a3927d] p-3 rounded-lg shadow-inner">
           <div className="text-xs md:text-sm font-black text-[#333] uppercase tracking-wider mb-2 border-b border-[#a3927d]/40 pb-1.5">
             Keypad Grid (Keys 1 - 15 + Key 16: CLEAR)
           </div>
           
           <div className="grid grid-cols-4 sm:grid-cols-8 gap-x-2.5 gap-y-3.5">
              {Array.from({ length: 16 }).map((_, i) => {
                 const keyNum = i + 1;
                 const isClearKey = keyNum === 16;
                 const isLEDOn = isKeyLEDActive(keyNum);
                 const validFixture = keyNum <= 12;
                 
                 let btnLabel = '';
                 if (isClearKey) {
                   btnLabel = 'CLR';
                 } else if (presetMode === PresetMode.SCENE) {
                   const preset = engine.scenePresets.find(p => p.id === `${bank}${keyNum}`);
                   btnLabel = preset ? preset.name.split(' ')[0] : `S${keyNum}`;
                 } else if (presetMode === PresetMode.CHASE) {
                   const preset = engine.chasePresets.find(p => p.id === `${bank}${keyNum}`);
                   btnLabel = preset ? preset.name.split(' ')[0] : `C${keyNum}`;
                 } else {
                   btnLabel = keyNum <= 12 ? `F${keyNum}` : `Aux ${keyNum}`;
                 }

                 return (
                    <div key={keyNum} className="flex flex-col items-center">
                       <div className="flex items-center justify-center mb-1.5 w-full">
                          <span className={`text-xs md:text-sm font-black px-1.5 py-0.5 rounded leading-none flex items-center gap-1 ${isClearKey ? 'bg-orange-200 text-orange-800' : 'bg-[#beaf9b] border border-[#a3927d] text-[#111]'}`}>
                             <span>{isClearKey ? 'CL' : keyNum}</span>
                             <span className="text-[8px] font-mono font-extrabold opacity-65 bg-black/10 px-0.5 rounded-sm">
                                {getShortcutLabel(keyNum)}
                             </span>
                          </span>
                       </div>
                       
                       <button 
                          onMouseDown={() => { if(isClearKey || validFixture || presetMode !== PresetMode.FIXTURE) handleNumberKey(keyNum, true) }}
                          onMouseUp={() => { if (!isClearKey && engine.currentButtonType === ButtonType.FLASH && presetMode === PresetMode.SCENE) handleNumberKey(keyNum, false); }}
                          onMouseLeave={() => { if (!isClearKey && engine.currentButtonType === ButtonType.FLASH && presetMode === PresetMode.SCENE) handleNumberKey(keyNum, false); }}
                          onTouchStart={(e) => { e.preventDefault(); if(isClearKey || validFixture || presetMode !== PresetMode.FIXTURE) handleNumberKey(keyNum, true) }}
                          onTouchEnd={(e) => { e.preventDefault(); if (!isClearKey && engine.currentButtonType === ButtonType.FLASH && presetMode === PresetMode.SCENE) handleNumberKey(keyNum, false); }}
                          onTouchCancel={(e) => { e.preventDefault(); if (!isClearKey && engine.currentButtonType === ButtonType.FLASH && presetMode === PresetMode.SCENE) handleNumberKey(keyNum, false); }}
                          className={`w-full h-8 rounded-full border-b-[2px] shadow-md transition-all flex justify-center items-center ${
                             isLEDOn 
                             ? 'bg-[#1e1e1e] border-black translate-y-[1px]' 
                             : isClearKey 
                             ? 'bg-[#ea580c] border-[#9a3412] text-white hover:bg-[#f97316]' 
                             : 'bg-[#404040] border-[#222222] hover:bg-[#333333]'
                          }`}
                          disabled={!isClearKey && presetMode === PresetMode.FIXTURE && !validFixture}
                          title={isClearKey ? 'Clear All overrides and playbacks' : `Trigger Key ${keyNum}`}
                       >
                          <div className={`w-2.5 h-2.5 rounded-full shadow-inner ${isLEDOn ? (isClearKey ? 'bg-orange-500 shadow-[0_0_8px_#f97316]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]') : 'bg-red-950'}`}></div>
                       </button>
                       
                       <span className={`text-xs font-extrabold mt-1.5 text-center truncate w-full leading-none ${isClearKey ? 'text-red-700' : 'text-gray-700'}`} title={btnLabel}>
                         {btnLabel}
                       </span>
                    </div>
                 );
              })}
           </div>
        </div>

      </div>
    </div>
  );
};
