/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { DmxSimulatorEngine } from './DmxSimulatorEngine';
import { StagePreview } from './components/StagePreview';
import { ConsoleControls } from './components/ConsoleControls';
import { DmxInspector } from './components/DmxInspector';
import { Info, HelpCircle, Sliders, Settings, Share2, Copy, Plus, Trash2, Download, Upload, X, Check } from 'lucide-react';
import { DEFAULT_SCENES, DEFAULT_CHASES } from './presetsData';
import { AppPreset, DMXChannelType } from './types';

const EMPTY_PRESET: AppPreset = {
  id: 'empty',
  name: '아무것도 없는 빈 프리셋',
  isReadOnly: true,
  scenePresets: [],
  chasePresets: []
};

const DEFAULT_PRESET: AppPreset = {
  id: 'default',
  name: '기본 프리셋',
  isReadOnly: true,
  scenePresets: DEFAULT_SCENES,
  chasePresets: DEFAULT_CHASES
};

const migrateFixtureValues = (fixtureValues: any) => {
  if (!fixtureValues || typeof fixtureValues !== 'object') return {};
  const migrated: any = {};
  const channelMap: Record<string, string> = {
    'Master': 'M', 'M': 'M',
    'Red': 'R', 'R': 'R',
    'Green': 'G', 'G': 'G',
    'Blue': 'B', 'B': 'B',
    'White': 'W', 'W': 'W',
    'Strobe': 'S', 'S': 'S'
  };
  const orderKeys = ['M', 'R', 'G', 'B', 'W', 'S'];

  for (const [fixId, channels] of Object.entries(fixtureValues)) {
    if (!channels || typeof channels !== 'object') continue;
    const tempChannels: any = {};
    for (const [chanName, val] of Object.entries(channels as any)) {
      const targetKey = channelMap[chanName] || chanName;
      tempChannels[targetKey] = val;
    }

    // Sort channels according to the orderKeys sequence
    const sortedChannels: any = {};
    for (const key of orderKeys) {
      if (tempChannels[key] !== undefined) {
        sortedChannels[key] = tempChannels[key];
      } else {
        if (key === 'S') {
          sortedChannels['S'] = 0;
        }
      }
    }
    // Also include any other unexpected keys that might be there
    for (const key of Object.keys(tempChannels)) {
      if (!orderKeys.includes(key)) {
        sortedChannels[key] = tempChannels[key];
      }
    }

    migrated[fixId] = sortedChannels;
  }
  return migrated;
};

const migratePreset = (preset: any): AppPreset => {
  if (!preset) return preset;
  
  const scenePresets = Array.isArray(preset.scenePresets)
    ? preset.scenePresets.map((sp: any) => {
        if (!sp) return { id: '', name: '', number: 0, fixtureValues: {} };
        return {
          ...sp,
          fixtureValues: migrateFixtureValues(sp.fixtureValues)
        };
      })
    : [];

  const chasePresets = Array.isArray(preset.chasePresets)
    ? preset.chasePresets.map((cp: any) => {
        if (!cp) return { id: '', name: '', number: 0, steps: [] };
        const steps = Array.isArray(cp.steps)
          ? cp.steps.map((step: any, i: number) => {
              if (!step) return { stepNumber: i + 1, fixtureValues: {} };
              return {
                stepNumber: step.stepNumber !== undefined ? step.stepNumber : i + 1,
                fixtureValues: migrateFixtureValues(step.fixtureValues)
              };
            })
          : [];
        return {
          ...cp,
          steps
        };
      })
    : [];

  return {
    ...preset,
    scenePresets,
    chasePresets
  };
};

export default function App() {
  // Instantiating the core DMX simulation engine
  const engineRef = useRef<DmxSimulatorEngine>(new DmxSimulatorEngine());
  const engine = engineRef.current;

  // React state mirrors to drive re-renders of child views
  const [fixtures, setFixtures] = useState([...engine.fixtures]);
  const [selectedFixtureIds, setSelectedFixtureIds] = useState<Set<number>>(new Set(engine.selectedFixtureIds));
  const [activeScenes, setActiveScenes] = useState<Set<string>>(new Set(engine.activeScenes));
  const [flashedScenes, setFlashedScenes] = useState<Set<string>>(new Set(engine.flashedScenes));
  const [activeChases, setActiveChases] = useState<Map<string, any>>(new Map(engine.activeChases));
  const [dmxBuffer, setDmxBuffer] = useState<Uint8Array>(engine.computeDmxBuffer());
  const [tickCounter, setTickCounter] = useState(0);
  const [activeTab, setActiveTab] = useState<'console' | 'dmx'>('console');

  // Preset management states
  const [presets, setPresets] = useState<AppPreset[]>(() => {
    const stored = localStorage.getItem('dmx_custom_presets');
    const migratedDefault = migratePreset(DEFAULT_PRESET);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const migratedList = Array.isArray(parsed) ? parsed.map(p => migratePreset(p)) : [];
        return [EMPTY_PRESET, migratedDefault, ...migratedList];
      } catch (e) {
        console.error('Failed to parse custom presets', e);
      }
    }
    return [EMPTY_PRESET, migratedDefault];
  });

  const [activePresetId, setActivePresetId] = useState<string>(() => {
    return localStorage.getItem('dmx_active_preset_id') || 'default';
  });

  const [showSettings, setShowSettings] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [exportText, setExportText] = useState('');
  const [copiedPresetId, setCopiedPresetId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isProgramMode, setIsProgramMode] = useState(engine.isProgramMode);

  const handleRenameScene = (id: string, num: number, newName: string) => {
    let preset = engine.scenePresets.find(p => p.id === id);
    if (!preset) {
      preset = {
        id,
        bank: id.startsWith('A') ? 'A' : 'B',
        number: num,
        name: newName,
        fixtureValues: {}
      };
      engine.scenePresets.push(preset);
    } else {
      preset.name = newName;
    }
    saveCurrentEngineStateToPreset();
    syncStateFromEngine();
  };

  const handleRenameChase = (id: string, num: number, newName: string) => {
    let preset = engine.chasePresets.find(p => p.id === id);
    if (!preset) {
      preset = {
        id,
        bank: id.startsWith('A') ? 'A' : 'B',
        number: num,
        name: newName,
        steps: []
      };
      engine.chasePresets.push(preset);
    } else {
      preset.name = newName;
    }
    saveCurrentEngineStateToPreset();
    syncStateFromEngine();
  };

  // Load active preset on mount
  useEffect(() => {
    const storedActiveId = localStorage.getItem('dmx_active_preset_id') || 'default';
    const found = presets.find(p => p.id === storedActiveId) || DEFAULT_PRESET;
    engine.loadPresets(found.scenePresets, found.chasePresets);
    syncStateFromEngine();
  }, []);

  const lastDmxBufferRef = useRef<Uint8Array | null>(null);

  // Function to pull latest state values from the simulation engine
  const syncStateFromEngine = () => {
    const computed = engine.computeDmxBuffer();
    lastDmxBufferRef.current = computed;
    setFixtures([...engine.fixtures]);
    setSelectedFixtureIds(new Set(engine.selectedFixtureIds));
    setActiveScenes(new Set(engine.activeScenes));
    setFlashedScenes(new Set(engine.flashedScenes));
    setActiveChases(new Map(engine.activeChases));
    setDmxBuffer(computed);
    setIsProgramMode(engine.isProgramMode);
    setTickCounter((prev) => prev + 1);
  };

  // Keep a stable reference of syncStateFromEngine to prevent stale closures
  const syncStateRef = useRef(syncStateFromEngine);
  useEffect(() => {
    syncStateRef.current = syncStateFromEngine;
  }, [syncStateFromEngine]);

  // Synchronize any scene/chase edits to the active custom preset
  const saveCurrentEngineStateToPreset = () => {
    if (activePresetId === 'default' || activePresetId === 'empty') return;

    setPresets((prev) => {
      const updated = prev.map((p) => {
        if (p.id === activePresetId) {
          const rawPreset = {
            ...p,
            scenePresets: JSON.parse(JSON.stringify(engine.scenePresets)),
            chasePresets: JSON.parse(JSON.stringify(engine.chasePresets))
          };
          return migratePreset(rawPreset);
        }
        return p;
      });
      localStorage.setItem('dmx_custom_presets', JSON.stringify(updated.filter((p) => !p.isReadOnly)));
      return updated;
    });
  };

  // Auto-save whenever program mode is toggled off
  useEffect(() => {
    if (!isProgramMode) {
      saveCurrentEngineStateToPreset();
    }
  }, [isProgramMode]);

  // Handle switching presets
  const handleSelectPreset = (id: string, currentPresetsList = presets) => {
    const found = currentPresetsList.find(p => p.id === id) || DEFAULT_PRESET;
    setActivePresetId(id);
    localStorage.setItem('dmx_active_preset_id', id);

    engine.loadPresets(found.scenePresets, found.chasePresets);
    syncStateFromEngine();
  };

  const handleCreatePreset = () => {
    if (!newPresetName.trim()) return;
    const newPreset: AppPreset = {
      id: 'custom_' + Date.now(),
      name: newPresetName.trim(),
      scenePresets: JSON.parse(JSON.stringify(engine.scenePresets)),
      chasePresets: JSON.parse(JSON.stringify(engine.chasePresets))
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem('dmx_custom_presets', JSON.stringify(updated.filter((p) => !p.isReadOnly)));

    handleSelectPreset(newPreset.id, updated);
    setNewPresetName('');
    showSuccess('현재 콘솔 설정을 기반으로 새 프리셋이 활성화되었습니다!');
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === activePresetId) {
      handleSelectPreset('default', presets);
    }
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    localStorage.setItem('dmx_custom_presets', JSON.stringify(updated.filter((p) => !p.isReadOnly)));
    showSuccess('프리셋이 성공적으로 삭제되었습니다.');
  };

  const handleCopyJson = (preset: AppPreset) => {
    const migrated = migratePreset(preset);
    const exportFormat = {
      name: migrated.name,
      scenePresets: migrated.scenePresets,
      chasePresets: migrated.chasePresets
    };
    const text = JSON.stringify(exportFormat, null, 2);
    setExportText(text);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPresetId(preset.id);
      setTimeout(() => setCopiedPresetId(null), 2000);
    });
  };

  const handleImportPreset = () => {
    try {
      const parsed = JSON.parse(importText);
      if (!parsed.name) {
        throw new Error('프리셋 이름("name")이 명시되어야 합니다.');
      }

      const rawPreset: AppPreset = {
        id: 'custom_' + Date.now(),
        name: parsed.name.trim(),
        scenePresets: Array.isArray(parsed.scenePresets) ? parsed.scenePresets : [],
        chasePresets: Array.isArray(parsed.chasePresets) ? parsed.chasePresets : []
      };

      const newPreset = migratePreset(rawPreset);

      const updated = [...presets, newPreset];
      setPresets(updated);
      localStorage.setItem('dmx_custom_presets', JSON.stringify(updated.filter((p) => !p.isReadOnly)));

      handleSelectPreset(newPreset.id, updated);
      setImportText('');
      setImportError('');
      showSuccess('프리셋 JSON이 정상적으로 가져와지고 활성화되었습니다!');
    } catch (err: any) {
      setImportError(err.message || '올바른 JSON 형식이 아닙니다. 형식을 확인해주세요.');
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  // High-precision animation loop for live fading & step transitions
  useEffect(() => {
    let lastTime = performance.now();
    let lastSyncTime = 0;
    let animationFrameId: number;

    const frameTick = (now: number) => {
      const deltaSec = Math.max(0, Math.min(0.1, (now - lastTime) / 1000));
      lastTime = now;

      // Tick the engine
      engine.tick(deltaSec);

      // Pull latest frame states with throttling and idle check to save rendering performance
      const hasActiveChases = engine.activeChases.size > 0;
      const isAnyFixtureStrobing = engine.fixtures.some(f => (f.currentValues[DMXChannelType.Strobe] ?? 0) > 0);
      const isAnimating = hasActiveChases || isAnyFixtureStrobing;

      if (isAnimating) {
        if (now - lastSyncTime >= 16) { // ~60 FPS smooth rendering for anims and high-speed strobing
          syncStateRef.current();
          lastSyncTime = now;
        }
      } else {
        // When completely idle (no active chases animating), only sync if DMX values actually changed
        const currentDmx = engine.computeDmxBuffer();
        let dmxChanged = false;
        const lastDmx = lastDmxBufferRef.current;
        if (!lastDmx || currentDmx.length !== lastDmx.length) {
          dmxChanged = true;
        } else {
          for (let i = 0; i < currentDmx.length; i++) {
            if (currentDmx[i] !== lastDmx[i]) {
              dmxChanged = true;
              break;
            }
          }
        }
        if (dmxChanged) {
          syncStateRef.current();
        }
      }

      animationFrameId = requestAnimationFrame(frameTick);
    };

    animationFrameId = requestAnimationFrame(frameTick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [engine]);

  // Handle fixture selection toggles
  const handleToggleSelectFixture = (id: number) => {
    if (engine.selectedFixtureIds.has(id)) {
      engine.selectedFixtureIds.delete(id);
    } else {
      engine.selectedFixtureIds.add(id);
    }
    syncStateFromEngine();
  };



  return (
    <div
      id="dmx-app-wrapper"
      className="h-screen bg-[#0a0a0b] text-[#e2e2e7] font-sans flex flex-col overflow-hidden select-none"
    >
      {/* DESKTOP VIEW (Visible on xl: and up) */}
      <main className="hidden xl:flex flex-1 gap-5 p-5 overflow-hidden max-w-[1750px] mx-auto w-full">
        {/* Left Side: Stage Visualization & Live DMX Matrix */}
        <div className="w-[45%] flex flex-col gap-4 h-full overflow-hidden">
          {/* 1. Stage Preview */}
          <StagePreview
            fixtures={fixtures}
            selectedIds={selectedFixtureIds}
            onToggleSelect={handleToggleSelectFixture}
            isBlackout={engine.isBlackout}
            instanceId="desktop"
          />

          {/* 3. DMX-512 Universe Matrix View */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <DmxInspector dmxBuffer={dmxBuffer} engine={engine} onStateChange={syncStateFromEngine} />
          </div>
        </div>

        {/* Right Side: Tactile Emulation Control Desk */}
        <div className="flex-1 overflow-y-auto pr-1 pb-4 max-w-[880px]">
          <ConsoleControls
            engine={engine}
            selectedFixtureIds={selectedFixtureIds}
            activeScenes={activeScenes}
            flashedScenes={flashedScenes}
            activeChases={activeChases}
            onStateChange={syncStateFromEngine}
            isPresetReadOnly={activePresetId === 'default' || activePresetId === 'empty'}
            onRenameScene={handleRenameScene}
            onRenameChase={handleRenameChase}
            onSavePreset={saveCurrentEngineStateToPreset}
          />
        </div>
      </main>

      {/* MOBILE / TABLET VIEW (Visible on screens below xl) */}
      <div className="flex xl:hidden flex-1 flex-col overflow-hidden">
        {/* Stage Preview (Pinned to top so users can see visual changes live) */}
        <div className="flex-shrink-0 bg-black">
          <StagePreview
            fixtures={fixtures}
            selectedIds={selectedFixtureIds}
            onToggleSelect={handleToggleSelectFixture}
            isBlackout={engine.isBlackout}
            instanceId="mobile"
          />
        </div>

        {/* Tab Selection Bar */}
        <div className="flex-shrink-0 flex border-b border-[#222] bg-[#000] p-1.5 gap-2">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex-1 py-2 text-xs font-black rounded-md transition-all flex items-center justify-center gap-1.5 border whitespace-nowrap ${
              activeTab === 'console'
                ? 'bg-[#d9cbb8] text-slate-900 border-[#a3927d] shadow-sm'
                : 'bg-[#141416] text-[#888] border-[#222] hover:text-white'
            }`}
          >
            🎚️ 콘솔 컨트롤
          </button>
          <button
            onClick={() => setActiveTab('dmx')}
            className={`flex-1 py-2 text-xs font-black rounded-md transition-all flex items-center justify-center gap-1.5 border whitespace-nowrap ${
              activeTab === 'dmx'
                ? 'bg-[#d9cbb8] text-slate-900 border-[#a3927d] shadow-sm'
                : 'bg-[#141416] text-[#888] border-[#222] hover:text-white'
            }`}
          >
            📊 DMX 매트릭스
          </button>
        </div>

        {/* Active Tab Content Container with Independent Scroll Retention */}
        <div className="flex-1 relative bg-[#0a0a0b]">
          <div className={`absolute inset-0 overflow-y-auto p-3 pb-10 ${activeTab === 'console' ? '' : 'hidden'}`}>
            <ConsoleControls
              engine={engine}
              selectedFixtureIds={selectedFixtureIds}
              activeScenes={activeScenes}
              flashedScenes={flashedScenes}
              activeChases={activeChases}
              onStateChange={syncStateFromEngine}
              isPresetReadOnly={activePresetId === 'default' || activePresetId === 'empty'}
              onRenameScene={handleRenameScene}
              onRenameChase={handleRenameChase}
              onSavePreset={saveCurrentEngineStateToPreset}
            />
          </div>
          <div className={`absolute inset-0 overflow-y-auto p-3 pb-10 ${activeTab === 'dmx' ? '' : 'hidden'}`}>
            <DmxInspector dmxBuffer={dmxBuffer} engine={engine} onStateChange={syncStateFromEngine} />
          </div>
        </div>
      </div>

      {/* Floating Settings Button in Top-Right */}
      <button
        id="open-settings-btn"
        onClick={() => {
          setShowSettings(true);
          const activePreset = presets.find(p => p.id === activePresetId) || DEFAULT_PRESET;
          setExportText(JSON.stringify({
            name: activePreset.name,
            scenePresets: activePreset.scenePresets,
            chasePresets: activePreset.chasePresets
          }, null, 2));
        }}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-50 p-1.5 sm:p-2 rounded-lg bg-[#141416]/90 hover:bg-[#d9cbb8] hover:text-slate-900 border border-[#222] hover:border-[#a3927d] transition-all cursor-pointer shadow-md flex items-center gap-1 group font-black text-[10px] sm:text-xs text-zinc-300"
        title="프리셋 설정"
      >
        <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-45 duration-300" />
        <span className="hidden sm:inline">프리셋 설정</span>
      </button>

      {/* Global Toast Message Notification */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] px-4 py-2.5 rounded-lg bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-black shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {successMessage}
        </div>
      )}

      {/* Settings Modal Overlay */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-[#121315] border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#e2e2e7]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-[#161719]">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#d9cbb8]" />
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">⚙️ 프리셋 구성 설정</h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Active Preset Display */}
              <div className="bg-zinc-900/60 p-3.5 rounded-lg border border-zinc-850 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">현재 활성화된 프리셋</div>
                  <div className="text-sm font-black text-[#d9cbb8] mt-0.5">
                    {presets.find(p => p.id === activePresetId)?.name || '기본 프리셋'}
                  </div>
                </div>
                {/* Save active preset indicator */}
                {activePresetId !== 'default' && activePresetId !== 'empty' && (
                  <button
                    onClick={() => {
                      saveCurrentEngineStateToPreset();
                      showSuccess('현재 콘솔 설정이 성공적으로 이 프리셋에 저장되었습니다.');
                    }}
                    className="px-3 py-1.5 bg-[#d9cbb8] hover:bg-[#c3b4a1] text-slate-900 font-black text-xs rounded transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    콘솔 현재상태 저장
                  </button>
                )}
              </div>

              {/* Preset Selection & Management List */}
              <div className="space-y-3">
                <div className="text-xs font-black uppercase text-zinc-400 tracking-wider">프리셋 목록</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {presets.map((preset) => {
                    const isActive = preset.id === activePresetId;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset.id)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isActive
                            ? 'bg-zinc-850 border-[#d9cbb8]/80 text-[#d9cbb8]'
                            : 'bg-zinc-900/30 border-zinc-800 hover:bg-zinc-800/40 text-zinc-300'
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="font-bold text-xs truncate">{preset.name}</div>
                          <div className="text-[9px] text-zinc-500 mt-0.5 flex gap-1 items-center">
                            {preset.isReadOnly ? (
                              <span className="px-1.5 py-0.2 bg-zinc-800 border border-zinc-700 rounded text-[8px] text-zinc-400 font-black">기본제공</span>
                            ) : (
                              <span className="px-1.5 py-0.2 bg-[#d9cbb8]/10 border border-[#d9cbb8]/20 rounded text-[8px] text-[#d9cbb8] font-black">사용자설정</span>
                            )}
                            <span>• 씬 {preset.scenePresets.length}개</span>
                            <span>• 체이스 {preset.chasePresets.length}개</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Export / Share Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyJson(preset);
                            }}
                            className="p-1.5 hover:bg-zinc-700/80 rounded text-zinc-400 hover:text-[#d9cbb8] transition-all"
                            title="공유용 텍스트 복사"
                          >
                            {copiedPresetId === preset.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Delete Button (Only for custom) */}
                          {!preset.isReadOnly && (
                            <button
                              onClick={(e) => handleDeletePreset(preset.id, e)}
                              className="p-1.5 hover:bg-red-950/50 rounded text-zinc-400 hover:text-red-400 transition-all"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Create New Preset From Current Stage */}
              <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg space-y-3">
                <div className="text-xs font-black uppercase text-zinc-400 tracking-wider">현재 설정으로 새 프리셋 만들기</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="새 프리셋 이름 입력 (예: 버스킹 세팅, 메인쇼 A)"
                    className="flex-1 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-[#d9cbb8] rounded px-3 py-2 text-xs focus:outline-none transition-all text-white"
                  />
                  <button
                    onClick={handleCreatePreset}
                    disabled={!newPresetName.trim()}
                    className="px-4 py-2 bg-[#d9cbb8] hover:bg-[#c3b4a1] disabled:bg-zinc-800 disabled:text-zinc-600 text-slate-900 font-black text-xs rounded transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    새 프리셋 생성
                  </button>
                </div>
              </div>

              {/* Export / Import Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="space-y-2 flex flex-col">
                  <div className="text-xs font-black uppercase text-zinc-400 tracking-wider flex items-center justify-between">
                    <span>공유하기 (JSON 복사)</span>
                  </div>
                  <div className="relative flex-1">
                    <textarea
                      readOnly
                      value={exportText}
                      onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                      placeholder="프리셋을 선택하면 공유용 JSON이 여기에 표시됩니다."
                      className="w-full h-[110px] bg-zinc-950 border border-zinc-800 rounded p-2.5 text-[10px] font-mono focus:outline-none resize-none text-zinc-400"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(exportText);
                        showSuccess('JSON 코드가 클립보드에 복사되었습니다!');
                      }}
                      className="absolute bottom-2 right-2 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[10px] font-black text-zinc-300 transition-all cursor-pointer"
                    >
                      코드 복사
                    </button>
                  </div>
                </div>

                {/* Import Card */}
                <div className="space-y-2 flex flex-col">
                  <div className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                    가져오기 (JSON 붙여넣기)
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <textarea
                      value={importText}
                      onChange={(e) => {
                        setImportText(e.target.value);
                        setImportError('');
                      }}
                      placeholder="이곳에 공유받은 프리셋 JSON 문자열을 붙여넣으세요..."
                      className="w-full h-[110px] bg-zinc-950 border border-zinc-800 rounded p-2.5 text-[10px] font-mono focus:outline-none resize-none focus:border-[#d9cbb8] transition-all text-zinc-200"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-red-400 font-bold max-w-[170px] truncate">{importError}</span>
                      <button
                        onClick={handleImportPreset}
                        disabled={!importText.trim()}
                        className="px-3.5 py-1.5 bg-[#d9cbb8] hover:bg-[#c3b4a1] disabled:bg-zinc-800 disabled:text-zinc-600 text-slate-900 font-black text-xs rounded transition-all cursor-pointer flex-shrink-0"
                      >
                        가져오기 실행
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-zinc-800 bg-[#161719] flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-black transition-all cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
