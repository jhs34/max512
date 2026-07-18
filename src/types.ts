/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum DMXChannelType {
  Master = 'M',
  Red = 'R',
  Green = 'G',
  Blue = 'B',
  White = 'W',
  Strobe = 'S'
}

export interface Fixture {
  id: number; // 1 to 12
  baseAddress: number; // (id - 1) * 6 + 1
  currentValues: Record<DMXChannelType, number>; // 0 to 100
}

export enum PresetMode {
  FIXTURE = 'FIXTURE',
  SCENE = 'SCENE',
  CHASE = 'CHASE'
}

export enum TriggerMode {
  Auto = 'Auto',
  Swing = 'Swing'
}

export enum ButtonType {
  LATCH = 'LATCH',
  SWOP = 'SWOP',
  FLASH = 'FLASH'
}

export interface ScenePreset {
  id: string; // e.g. "A1", "A2", "B1"
  bank: 'A' | 'B';
  number: number; // 1 to 15
  name: string;
  // Fixture index (1-12) -> Partial values
  fixtureValues: Record<number, Partial<Record<DMXChannelType, number>>>;
}

export interface ChaseStep {
  stepNumber: number; // 1-based step index
  // Fixture index (1-12) -> Partial values
  fixtureValues: Record<number, Partial<Record<DMXChannelType, number>>>;
}

export interface ChasePreset {
  id: string; // e.g. "A14", "B1"
  bank: 'A' | 'B';
  number: number; // 1 to 15
  name: string;
  steps: ChaseStep[];
}

export interface ChaseRuntime {
  presetId: string;
  currentStepIndex: number;
  elapsedTimeInStep: number; // in seconds
  speedPercent: number; // 0 to 100
  crossPercent: number; // 0 to 100
}

export interface AppPreset {
  id: string;
  name: string;
  isReadOnly?: boolean;
  scenePresets: ScenePreset[];
  chasePresets: ChasePreset[];
}
