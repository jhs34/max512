/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DMXChannelType,
  Fixture,
  PresetMode,
  TriggerMode,
  ButtonType,
  ScenePreset,
  ChasePreset,
  ChaseStep,
  ChaseRuntime
} from './types';
import { DEFAULT_SCENES, DEFAULT_CHASES } from './presetsData';

export class DmxSimulatorEngine {
  public fixtures: Fixture[] = [];
  public activeScenes = new Set<string>(); // Set of active Scene IDs e.g. "A3"
  public flashedScenes = new Set<string>(); // Scenes currently flashed (FLASH button mode)
  
  // Map of active Chase IDs to their playback runtime state
  public activeChases = new Map<string, ChaseRuntime>();
  
  // Custom or preloaded databases
  public scenePresets: ScenePreset[] = [];
  public chasePresets: ChasePreset[] = [];
  
  // Panel configuration states
  public currentBank: 'A' | 'B' = 'A';
  public currentPresetMode: PresetMode = PresetMode.SCENE;
  public currentTriggerMode: TriggerMode = TriggerMode.Auto;
  public currentButtonType: ButtonType = ButtonType.LATCH;
  
  // Speed and Cross settings (globally adjustable or per chase)
  public globalSpeedPercent = 50; // default 50%
  public globalCrossPercent = 60; // default 60%
  
  // Manual control & overrides
  public selectedFixtureIds = new Set<number>(); // 1 to 12
  // fixtureId -> Record<channelType, value>
  public manualOverrides: Record<number, Partial<Record<DMXChannelType, number>>> = {};
  
  // Blackout flag
  public isBlackout = false;
  
  // Global chase play direction: 1 for forward, -1 for backward
  public chaseDirection: 1 | -1 = 1;

  // Program mode states
  public isProgramMode = false;
  public programChaseId: string | null = null; // e.g., "A1"
  public programStepIndex = -1; // -1 means no step has been created yet
  public programSteps: ChaseStep[] = [];

  // Swing rhythm states
  public swingInterval: number = 1.0; // seconds per step in Swing mode
  private lastSwingTapTime: number = 0;

  constructor() {
    this.reset();
  }

  /**
   * Resets the engine to factory/initial state
   */
  public reset(): void {
    // Initialize 12 fixtures at fixed intervals of 16 channels
    this.fixtures = [];
    for (let id = 1; id <= 12; id++) {
      const baseAddress = (id - 1) * 6 + 1;
      this.fixtures.push({
        id,
        baseAddress,
        currentValues: {
          [DMXChannelType.Red]: 0,
          [DMXChannelType.Green]: 0,
          [DMXChannelType.Blue]: 0,
          [DMXChannelType.White]: 0,
          [DMXChannelType.Master]: 0,
          [DMXChannelType.Strobe]: 0
        }
      });
    }

    // Load initial database
    this.scenePresets = JSON.parse(JSON.stringify(DEFAULT_SCENES));
    this.chasePresets = JSON.parse(JSON.stringify(DEFAULT_CHASES));

    this.activeScenes.clear();
    this.flashedScenes.clear();
    this.activeChases.clear();
    this.selectedFixtureIds.clear();
    this.manualOverrides = {};
    this.isBlackout = false;
    this.currentPresetMode = PresetMode.SCENE;
    this.currentButtonType = ButtonType.LATCH;
    this.currentTriggerMode = TriggerMode.Auto;
    this.globalSpeedPercent = 50;
    this.globalCrossPercent = 60;
    this.chaseDirection = 1;

    this.isProgramMode = false;
    this.programChaseId = null;
    this.programStepIndex = -1;
    this.programSteps = [];

    this.swingInterval = 1.0;
    this.lastSwingTapTime = 0;
  }

  /**
   * Loads a set of scene and chase presets into the engine
   */
  public loadPresets(scenes: ScenePreset[], chases: ChasePreset[]): void {
    this.scenePresets = JSON.parse(JSON.stringify(scenes));
    this.chasePresets = JSON.parse(JSON.stringify(chases));

    // Ensure every chase step has a valid stepNumber
    for (const chase of this.chasePresets) {
      if (chase.steps) {
        for (let i = 0; i < chase.steps.length; i++) {
          if (chase.steps[i].stepNumber === undefined) {
            chase.steps[i].stepNumber = i + 1;
          }
        }
      }
    }

    // Clear playback states to avoid residuals
    this.activeScenes.clear();
    this.flashedScenes.clear();
    this.activeChases.clear();
    this.selectedFixtureIds.clear();
    this.manualOverrides = {};

    this.updateFixtureOutputs();
  }

  /**
   * Calculates the TotalStepTime in seconds for a given speed%
   * Range: 0% -> 180s per step, 100% -> 0.03s per step.
   * Formula: TotalStepTime = 180 * (0.03 / 180)^(SpeedPercent / 100)
   */
  public calculateStepTime(speedPercent: number): number {
    const minTime = 0.03;
    const maxTime = 180.0;
    return maxTime * Math.pow(minTime / maxTime, speedPercent / 100);
  }

  /**
   * Ticks the playback clock of all active Chase programs
   * @param deltaTimeInSeconds Elapsed time since last frame
   */
  public tick(deltaTimeInSeconds: number): void {
    this.activeChases.forEach((runtime) => {
      const preset = this.chasePresets.find(p => p.id === runtime.presetId);
      if (!preset || preset.steps.length === 0) return;

      const totalSteps = preset.steps.length;
      if (totalSteps <= 1) return; // 1-step chase doesn't cycle

      // Determine step duration based on trigger mode
      const totalStepTime = this.currentTriggerMode === TriggerMode.Swing 
        ? this.swingInterval 
        : this.calculateStepTime(runtime.speedPercent);

      runtime.elapsedTimeInStep += deltaTimeInSeconds;

      if (runtime.elapsedTimeInStep >= totalStepTime) {
        // Handle step wrap around
        const stepsToAdvance = Math.floor(runtime.elapsedTimeInStep / totalStepTime);
        runtime.elapsedTimeInStep = runtime.elapsedTimeInStep % totalStepTime;

        let nextIndex = runtime.currentStepIndex + stepsToAdvance * this.chaseDirection;
        // Correct modulus for negative/positive index
        nextIndex = ((nextIndex % totalSteps) + totalSteps) % totalSteps;
        runtime.currentStepIndex = nextIndex;
      }
    });

    // Update the live fixture output state
    this.updateFixtureOutputs();
  }

  /**
   * Handles user tapping SWING L (direction -1) or SWING R (direction +1)
   */
  public handleSwingTap(direction: 1 | -1): void {
    const now = performance.now();
    this.chaseDirection = direction;

    // Immediately advance all active chases by 1 step in this direction
    this.activeChases.forEach((runtime) => {
      const preset = this.chasePresets.find(p => p.id === runtime.presetId);
      if (!preset || preset.steps.length <= 1) return;

      runtime.elapsedTimeInStep = 0; // reset phase
      let nextIndex = runtime.currentStepIndex + direction;
      nextIndex = ((nextIndex % preset.steps.length) + preset.steps.length) % preset.steps.length;
      runtime.currentStepIndex = nextIndex;
    });

    if (this.lastSwingTapTime > 0) {
      const diffMs = now - this.lastSwingTapTime;
      if (diffMs >= 150 && diffMs <= 4000) {
        // Set the auto-rhythm to this interval (in seconds)
        this.swingInterval = diffMs / 1000;
      }
    }
    this.lastSwingTapTime = now;
    this.updateFixtureOutputs();
  }

  /**
   * Force manually triggers a Chase step progression (useful for Music or Swing triggers)
   */
  public triggerManualStep(chaseId: string): void {
    const runtime = this.activeChases.get(chaseId);
    if (!runtime) return;

    const preset = this.chasePresets.find(p => p.id === chaseId);
    if (!preset || preset.steps.length <= 1) return;

    runtime.elapsedTimeInStep = 0;
    let nextIndex = runtime.currentStepIndex + this.chaseDirection;
    nextIndex = ((nextIndex % preset.steps.length) + preset.steps.length) % preset.steps.length;
    runtime.currentStepIndex = nextIndex;

    this.updateFixtureOutputs();
  }

  /**
   * Handles button click for Scene selection
   */
  public selectSceneButton(number: number, isPressed: boolean, buttonTypeOverride?: ButtonType): void {
    const presetId = `${this.currentBank}${number}`;
    let preset = this.scenePresets.find(p => p.id === presetId);

    if (this.isProgramMode) {
      if (isPressed) {
        // Scene Programming Save:
        // Copy manualOverrides into this scene's fixtureValues
        if (!preset) {
          preset = {
            id: presetId,
            bank: this.currentBank,
            number,
            name: `Cust Scene ${number}`,
            fixtureValues: {}
          };
          this.scenePresets.push(preset);
        }

        // Deep copy the manual configuration
        preset.fixtureValues = JSON.parse(JSON.stringify(this.manualOverrides));
        if (!preset.name || preset.name.startsWith('Cust Scene') || preset.name === '') {
          preset.name = `Cust Scene ${number}`;
        }

        // Automatically escape program mode
        this.isProgramMode = false;
        this.programChaseId = null;
        this.programStepIndex = -1;
        this.programSteps = [];

        // Clear manual overrides but activate the newly saved Scene for seamless transition
        this.manualOverrides = {};
        this.activeScenes.clear();
        this.activeScenes.add(presetId);
        this.selectedFixtureIds.clear();
      }
      this.updateFixtureOutputs();
      return;
    }

    if (!preset) return;

    const effectiveButtonType = buttonTypeOverride ?? this.currentButtonType;

    if (effectiveButtonType === ButtonType.SWOP) {
      if (isPressed) {
        // Kills all other active scenes
        this.activeScenes.clear();
        this.flashedScenes.clear();
        this.activeScenes.add(presetId);
      }
    } else if (effectiveButtonType === ButtonType.FLASH) {
      if (isPressed) {
        this.flashedScenes.add(presetId);
      } else {
        this.flashedScenes.delete(presetId);
      }
    } else {
      // LATCH Mode (Toggle)
      if (isPressed) {
        if (this.activeScenes.has(presetId)) {
          this.activeScenes.delete(presetId);
        } else {
          this.activeScenes.add(presetId);
        }
      }
    }

    this.updateFixtureOutputs();
  }

  /**
   * Handles button click for Chase selection
   */
  public selectChaseButton(number: number, isPressed: boolean): void {
    const presetId = `${this.currentBank}${number}`;
    let preset = this.chasePresets.find(p => p.id === presetId);

    if (this.isProgramMode) {
      if (isPressed) {
        this.programChaseId = presetId;
        
        // If the preset doesn't exist, dynamically create a new empty placeholder
        if (!preset) {
          preset = {
            id: presetId,
            bank: this.currentBank,
            number,
            name: `Cust Chase ${number}`,
            steps: []
          };
          this.chasePresets.push(preset);
        }

        if (preset.steps && preset.steps.length > 0) {
          this.programSteps = JSON.parse(JSON.stringify(preset.steps));
          this.programStepIndex = 0;
          this.loadStepToManualOverrides(0);
        } else {
          // Auto initialize step 1 for empty chase
          this.programSteps = [{ stepNumber: 1, fixtureValues: {} }];
          this.programStepIndex = 0;
          this.manualOverrides = {};
        }
        this.selectedFixtureIds.clear();
        this.currentPresetMode = PresetMode.FIXTURE; // Switch to Fixture select mode so user can select fixtures immediately
        this.updateFixtureOutputs();
      }
      return;
    }

    if (!preset) return;

    // Flash mode is NOT allowed for Chase programs (from manual types table)
    const effectiveButtonType = this.currentButtonType === ButtonType.FLASH ? ButtonType.LATCH : this.currentButtonType;

    if (effectiveButtonType === ButtonType.SWOP) {
      if (isPressed) {
        // Kill other active chases
        this.activeChases.clear();
        this.activeChases.set(presetId, {
          presetId,
          currentStepIndex: 0,
          elapsedTimeInStep: 0,
          speedPercent: this.globalSpeedPercent,
          crossPercent: this.globalCrossPercent
        });
      }
    } else {
      // LATCH Mode
      if (isPressed) {
        if (this.activeChases.has(presetId)) {
          this.activeChases.delete(presetId);
        } else {
          this.activeChases.set(presetId, {
            presetId,
            currentStepIndex: 0,
            elapsedTimeInStep: 0,
            speedPercent: this.globalSpeedPercent,
            crossPercent: this.globalCrossPercent
          });
        }
      }
    }

    this.updateFixtureOutputs();
  }

  /**
   * Updates speed% of all currently active chases
   */
  public setSpeedPercent(percent: number): void {
    this.globalSpeedPercent = Math.max(0, Math.min(100, percent));
    this.activeChases.forEach((runtime) => {
      runtime.speedPercent = this.globalSpeedPercent;
    });
  }

  /**
   * Updates cross% of all currently active chases
   */
  public setCrossPercent(percent: number): void {
    this.globalCrossPercent = Math.max(0, Math.min(100, percent));
    this.activeChases.forEach((runtime) => {
      runtime.crossPercent = this.globalCrossPercent;
    });
  }

  /**
   * Handles physical manual slider adjustment on active fixtures
   */
  public handleFaderMove(channel: DMXChannelType, value: number): void {
    if (this.selectedFixtureIds.size === 0) return;

    if (this.isProgramMode && this.programChaseId && this.programStepIndex >= 0) {
      const currentStep = this.programSteps[this.programStepIndex];
      if (currentStep) {
        this.selectedFixtureIds.forEach((fixtureId) => {
          if (!currentStep.fixtureValues[fixtureId]) {
            currentStep.fixtureValues[fixtureId] = {};
          }
          currentStep.fixtureValues[fixtureId][channel] = value;

          if (!this.manualOverrides[fixtureId]) {
            this.manualOverrides[fixtureId] = {};
          }
          this.manualOverrides[fixtureId][channel] = value;
        });
      }
      this.updateFixtureOutputs();
      return;
    }

    this.selectedFixtureIds.forEach((fixtureId) => {
      if (!this.manualOverrides[fixtureId]) {
        this.manualOverrides[fixtureId] = {};
      }
      this.manualOverrides[fixtureId][channel] = value;
    });

    this.updateFixtureOutputs();
  }

  /**
   * Sets multiple channel overrides for selected fixtures directly (useful for X/Y wheel)
   */
  public handleWheelMove(channel: DMXChannelType, value: number): void {
    this.handleFaderMove(channel, value);
  }

  /**
   * Pressing CLEAR flushes manual control overrides, selected fixtures, and all active playback presets (Scenes & Chases) immediately
   */
  public clearManualOverrides(): void {
    this.manualOverrides = {};
    this.activeScenes.clear();
    this.flashedScenes.clear();
    this.activeChases.clear();
    this.selectedFixtureIds.clear();
    this.updateFixtureOutputs();
  }

  /**
   * Checks if a specific fixture channel is manually overridden
   */
  public isChannelOverridden(fixtureId: number, channel: DMXChannelType): boolean {
    return this.manualOverrides[fixtureId]?.[channel] !== undefined;
  }

  /**
   * Toggles the Program Mode on/off. When turned off, the created steps are saved to the active Chase ID.
   */
  public toggleProgramMode(): void {
    if (this.isProgramMode) {
      // Exiting: Save steps
      if (this.programChaseId) {
        const preset = this.chasePresets.find(p => p.id === this.programChaseId);
        if (preset) {
          preset.steps = JSON.parse(JSON.stringify(this.programSteps));
          // Change the name so it stands out on the keypad
          if (!preset.name || preset.name.startsWith('Cust Chase') || preset.name === '') {
            preset.name = `Cust Chase ${preset.number}`;
          }
        }
      }
      this.isProgramMode = false;
      this.programChaseId = null;
      this.programStepIndex = -1;
      this.programSteps = [];
      this.selectedFixtureIds.clear();
      this.manualOverrides = {};
    } else {
      // Entering:
      this.isProgramMode = true;
      this.programChaseId = null;
      this.programStepIndex = -1;
      this.programSteps = [];
      // Do NOT clear selectedFixtureIds or manualOverrides here to preserve Step 1 states!
    }
    this.updateFixtureOutputs();
  }

  /**
   * Decrements active step index when editing a Chase in Program Mode
   */
  public handleProgramStepDecrement(): void {
    if (!this.isProgramMode || !this.programChaseId) return;
    if (this.programSteps.length === 0) return;
    
    if (this.programStepIndex > 0) {
      this.programStepIndex--;
      this.loadStepToManualOverrides(this.programStepIndex);
    }
    this.updateFixtureOutputs();
  }

  /**
   * Increments or creates a new step when editing a Chase in Program Mode
   */
  public handleProgramStepIncrement(): void {
    if (!this.isProgramMode || !this.programChaseId) return;

    if (this.programSteps.length === 0) {
      // Create first step!
      this.programSteps.push({ stepNumber: 1, fixtureValues: {} });
      this.programStepIndex = 0;
      this.selectedFixtureIds.clear();
      this.manualOverrides = {};
    } else if (this.programStepIndex === this.programSteps.length - 1) {
      // At the end: Create a new step, copy the last step's look as baseline
      const prevStep = this.programSteps[this.programStepIndex];
      const newFixtureValues = JSON.parse(JSON.stringify(prevStep.fixtureValues));
      this.programSteps.push({ stepNumber: this.programSteps.length + 1, fixtureValues: newFixtureValues });
      this.programStepIndex++;
      this.loadStepToManualOverrides(this.programStepIndex);
    } else {
      // In the middle: Just advance step index
      this.programStepIndex++;
      this.loadStepToManualOverrides(this.programStepIndex);
    }
    this.updateFixtureOutputs();
  }

  /**
   * Deletes the currently selected step in Program Mode
   */
  public handleProgramStepDelete(): void {
    if (!this.isProgramMode || !this.programChaseId) return;
    if (this.programSteps.length === 0) return;

    if (this.programSteps.length > 1) {
      // Remove current step
      this.programSteps.splice(this.programStepIndex, 1);
      // Re-number steps
      for (let i = 0; i < this.programSteps.length; i++) {
        this.programSteps[i].stepNumber = i + 1;
      }
      // Adjust step index if out of bounds
      if (this.programStepIndex >= this.programSteps.length) {
        this.programStepIndex = this.programSteps.length - 1;
      }
      this.loadStepToManualOverrides(this.programStepIndex);
    } else {
      // Only 1 step was present, now it becomes empty
      this.programSteps = [];
      this.programStepIndex = -1;
      this.manualOverrides = {};

      // Delete the saved Chase Preset if steps are 0
      const chaseId = this.programChaseId;
      this.chasePresets = this.chasePresets.filter(p => p.id !== chaseId);
      this.activeChases.delete(chaseId);

      // Reset program chase selection
      this.programChaseId = null;
    }
    this.updateFixtureOutputs();
  }

  /**
   * Loads a step's saved fixture channel values into manualOverrides
   */
  public loadStepToManualOverrides(stepIdx: number): void {
    this.manualOverrides = {};
    const step = this.programSteps[stepIdx];
    if (step) {
      this.manualOverrides = JSON.parse(JSON.stringify(step.fixtureValues));
    }
  }

  /**
   * Handles DMX cell drag or edits in DmxInspector, writing directly into the step
   */
  public handleDmxCellChange(fixtureId: number, channel: DMXChannelType, value: number): void {
    if (this.isProgramMode && this.programChaseId && this.programStepIndex >= 0) {
      const currentStep = this.programSteps[this.programStepIndex];
      if (currentStep) {
        if (!currentStep.fixtureValues[fixtureId]) {
          currentStep.fixtureValues[fixtureId] = {};
        }
        currentStep.fixtureValues[fixtureId][channel] = value;
      }
    }
    
    if (!this.manualOverrides[fixtureId]) {
      this.manualOverrides[fixtureId] = {};
    }
    this.manualOverrides[fixtureId][channel] = value;
    this.updateFixtureOutputs();
  }

  /**
   * Computes state interpolation factor and calculates the blended channel value for a Chase runtime
   */
  private getChaseChannelValue(
    runtime: ChaseRuntime,
    preset: ChasePreset,
    fixtureId: number,
    channel: DMXChannelType
  ): number {
    const steps = preset.steps;
    if (!steps || steps.length === 0) return 0;
    if (steps.length === 1) {
      return steps[0]?.fixtureValues?.[fixtureId]?.[channel] ?? 0;
    }

    let currentIdx = runtime.currentStepIndex;
    if (currentIdx >= steps.length || currentIdx < 0) {
      currentIdx = 0;
      runtime.currentStepIndex = 0;
    }

    const currentStep = steps[currentIdx];
    if (!currentStep) return 0;

    // Find former step based on direction
    const formerStepIndex = ((currentIdx - this.chaseDirection) % steps.length + steps.length) % steps.length;
    const formerStep = steps[formerStepIndex];
    if (!formerStep) {
      return currentStep.fixtureValues?.[fixtureId]?.[channel] ?? 0;
    }

    const valCurrent = currentStep.fixtureValues?.[fixtureId]?.[channel] ?? 0;
    const valFormer = formerStep.fixtureValues?.[fixtureId]?.[channel] ?? 0;

    // Speeds/Cross mathematics (Auto mode logic)
    const totalStepTime = this.currentTriggerMode === TriggerMode.Swing 
      ? this.swingInterval 
      : this.calculateStepTime(runtime.speedPercent);
    const fadeDuration = this.currentTriggerMode === TriggerMode.Swing
      ? 0
      : totalStepTime * (1 - runtime.crossPercent / 100);

    if (runtime.elapsedTimeInStep < fadeDuration && fadeDuration > 0) {
      // Linear interpolation from former step value to current step value
      const factor = runtime.elapsedTimeInStep / fadeDuration;
      return valFormer + (valCurrent - valFormer) * factor;
    } else {
      // Hold state static at current step value
      return valCurrent;
    }
  }

  /**
   * Compiles the combined visual outputs for all 12 fixtures using HTP mixing and Manual overrides
   */
  public updateFixtureOutputs(): void {
    for (const fixture of this.fixtures) {
      const fid = fixture.id;

      for (const channelKey of Object.values(DMXChannelType)) {
        // 1. Blackout condition
        if (this.isBlackout) {
          fixture.currentValues[channelKey] = 0;
          continue;
        }

        // Program Mode stage isolation
        if (this.isProgramMode) {
          fixture.currentValues[channelKey] = this.manualOverrides[fid]?.[channelKey] ?? 0;
          continue;
        }

        // 2. Manual Override (Takes highest precedence over HTP)
        const overrideVal = this.manualOverrides[fid]?.[channelKey];
        if (overrideVal !== undefined) {
          fixture.currentValues[channelKey] = overrideVal;
          continue;
        }

        // 3. Gather active sources for HTP (Highest Takes Precedence)
        let highestValue = 0;
        let activeSourceCount = 0;

        // A. Scenes
        const allActiveScenes = new Set([...this.activeScenes, ...this.flashedScenes]);
        allActiveScenes.forEach((sceneId) => {
          const scene = this.scenePresets.find(s => s.id === sceneId);
          if (scene) {
            const sceneVal = scene.fixtureValues[fid]?.[channelKey];
            if (sceneVal !== undefined) {
              highestValue = Math.max(highestValue, sceneVal);
              activeSourceCount++;
            }
          }
        });

        // B. Chases
        this.activeChases.forEach((runtime) => {
          const chase = this.chasePresets.find(c => c.id === runtime.presetId);
          if (chase) {
            const chaseVal = this.getChaseChannelValue(runtime, chase, fid, channelKey);
            highestValue = Math.max(highestValue, chaseVal);
            activeSourceCount++;
          }
        });

        // If no background scenes or chases target this fixture's channel, default to its resting/base values
        if (activeSourceCount === 0) {
          fixture.currentValues[channelKey] = this.getRestingValue(channelKey);
        } else {
          fixture.currentValues[channelKey] = highestValue;
        }
      }
    }
  }

  /**
   * Get resting or default value for channels when no active source is driving them
   */
  private getRestingValue(channel: DMXChannelType): number {
    
    return 0; // Off
  }

  private getDmxChannelBaseValue(fixtureId: number, channel: DMXChannelType): number {
    return this.manualOverrides[fixtureId]?.[channel] ?? this.getRestingValue(channel);
  }

  /**
   * Computes the raw 512-channel DMX output array.
   * Frame buffer is 1-indexed (array size 513, index 0 unused).
   * Fixed interval layout:
   * Fixture id (1 to 12) starts at address (id-1)*16 + 1.
   * Channel mapping:
   * 1: Red
   * 2: Green
   * 3: Blue
   * 4: White
   * 5: Master
   * 6: Strobe
   */
  public computeDmxBuffer(): Uint8Array {
    const buffer = new Uint8Array(513); // DMX 1 to 512

    this.fixtures.forEach((fixture) => {
      const base = fixture.baseAddress; // e.g. 1, 17, 33...
      
      // Convert normalized 0-100% or 0-999 to 0-255 DMX range
      const scaleTo255 = (val: number) => Math.round((val / 100) * 255);

      

      buffer[base] = scaleTo255(fixture.currentValues[DMXChannelType.Master]);
      buffer[base + 1] = scaleTo255(fixture.currentValues[DMXChannelType.Red]);
      buffer[base + 2] = scaleTo255(fixture.currentValues[DMXChannelType.Green]);
      buffer[base + 3] = scaleTo255(fixture.currentValues[DMXChannelType.Blue]);
      buffer[base + 4] = scaleTo255(fixture.currentValues[DMXChannelType.White]);
      buffer[base + 5] = scaleTo255(fixture.currentValues[DMXChannelType.Strobe]);
    });

    return buffer;
  }

  /**
   * Converts RGBW + Master values into highly realistic visual color representation and CSS effects.
   * Returns CSS rgba background color and shadow/glow parameters.
   */
  public static computeFixtureGlow(fixture: Fixture, isBlackoutGlobal = false, timeMs = performance.now()): {
    colorString: string;
    beamColorString: string;
    glowStyle: string;
    rgbObject: { r: number; g: number; b: number };
    intensity: number;
  } {
    const rVal = fixture.currentValues[DMXChannelType.Red];
    const gVal = fixture.currentValues[DMXChannelType.Green];
    const bVal = fixture.currentValues[DMXChannelType.Blue];
    const wVal = fixture.currentValues[DMXChannelType.White];
    const mVal = isBlackoutGlobal ? 0 : fixture.currentValues[DMXChannelType.Master];

    let mFactor = mVal / 100;
    const strobeVal = fixture.currentValues[DMXChannelType.Strobe] || 0;
    if (strobeVal > 0 && !isBlackoutGlobal) {
      const hz = 1 + (strobeVal / 100) * 19;
      const periodMs = 1000 / hz;
      if ((timeMs % periodMs) > periodMs / 2) {
        mFactor = 0;
      }
    }

    // Convert channels to 0-255 RGB output
    const rOut = (rVal / 100) * mFactor * 255;
    const gOut = (gVal / 100) * mFactor * 255;
    const bOut = (bVal / 100) * mFactor * 255;
    const wOut = (wVal / 100) * mFactor * 255;

    // Add white channel values to RGB with standard stage lighting scaling.
    // If any RGB channel is active alongside White, prevent desaturation from completely
    // washing out the color into pure white. We dynamically scale down the white component's 
    // contribution to inactive color channels, ensuring an elegant pastel/soft-mixed colored glow.
    let rFinalRaw = rOut + wOut;
    let gFinalRaw = gOut + wOut * 0.95;
    let bFinalRaw = bOut + wOut * 0.9;

    const maxRgb = Math.max(rOut, gOut, bOut);
    if (maxRgb > 0 && wOut > 0) {
      const rRatio = rOut / maxRgb;
      const gRatio = gOut / maxRgb;
      const bRatio = bOut / maxRgb;

      // Active color channels get full white addition, inactive ones get reduced white to preserve hue
      const rWhiteFactor = 0.5 + 0.5 * rRatio;
      const gWhiteFactor = 0.5 + 0.5 * gRatio;
      const bWhiteFactor = 0.5 + 0.5 * bRatio;

      rFinalRaw = rOut + wOut * rWhiteFactor;
      gFinalRaw = gOut + wOut * 0.95 * gWhiteFactor;
      bFinalRaw = bOut + wOut * 0.9 * bWhiteFactor;
    }

    const rFinal = Math.min(255, Math.round(rFinalRaw));
    const gFinal = Math.min(255, Math.round(gFinalRaw));
    const bFinal = Math.min(255, Math.round(bFinalRaw));

    // Intensity factor for transparency calculations
    const intensity = Math.max(rFinal, gFinal, bFinal) / 255;

    const colorString = `rgb(${rFinal}, ${gFinal}, ${bFinal})`;
    // Faded beam representation
    const beamColorString = `rgba(${rFinal}, ${gFinal}, ${bFinal}, ${intensity * 0.5})`;

    // Generate high-fidelity glow styles using multiple box shadow layers
    const glowStyle = intensity > 0.05
      ? `0 0 15px ${intensity * 4}px rgba(${rFinal}, ${gFinal}, ${bFinal}, ${0.8 * intensity}), 
         0 0 30px ${intensity * 12}px rgba(${rFinal}, ${gFinal}, ${bFinal}, ${0.4 * intensity})`
      : 'none';

    return {
      colorString,
      beamColorString,
      glowStyle,
      rgbObject: { r: rFinal, g: gFinal, b: bFinal },
      intensity
    };
  }
}
