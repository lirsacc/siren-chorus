import { useState, useEffect, useMemo } from "preact/hooks";

import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

export function randomName(): string {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "-",
    length: 2,
  });
}

export function randomIshId(length: number = 20): string {
  return Array.from(Array(length), () =>
    Math.floor(Math.random() * 36).toString(36),
  ).join("");
}

export function useFlag(initial: boolean) {
  const [on, setOn] = useState(initial);
  return {
    on: on,
    toggle: () => setOn(!on),
    turnOn: () => setOn(true),
    turnOff: () => setOn(false),
  };
}

const STORAGE_PREFIX = "siren-chorus:1:";

export function useStoredString(
  key: string,
  fallback: string,
): [string, (value: string) => void] {
  const prefixedKey = useMemo(() => `${STORAGE_PREFIX}${key}`, [key]);
  const stored = localStorage.getItem(prefixedKey);
  const [value, setValue] = useState(stored != null ? stored : fallback);

  useEffect(() => {
    localStorage.setItem(prefixedKey, value);
  }, [value, prefixedKey]);

  useEffect(() => {
    const stored = localStorage.getItem(prefixedKey);
    if (stored != null) {
      setValue(stored);
    }
  }, [prefixedKey]);

  return [value, setValue];
}

export const USER_COLOURS = [
  { color: "#30bced", light: "#30bced33" },
  { color: "#6eeb83", light: "#6eeb8333" },
  { color: "#ffbc42", light: "#ffbc4233" },
  { color: "#ecd444", light: "#ecd44433" },
  { color: "#ee6352", light: "#ee635233" },
  { color: "#9ac2c9", light: "#9ac2c933" },
  { color: "#8acb88", light: "#8acb8833" },
  { color: "#1be7ff", light: "#1be7ff33" },
];

export function getRandomColour() {
  return USER_COLOURS[Math.round(Math.random() * 100) % USER_COLOURS.length];
}
