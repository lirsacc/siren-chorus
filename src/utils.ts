import { useState, useEffect } from "preact/hooks";

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

export function useStoredString(
  key: string,
  fallback: string,
): [string, (value: string) => void] {
  const stored = localStorage.getItem(key);
  const [value, setValue] = useState(stored != null ? stored : fallback);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored != null) {
      setValue(stored);
    }
  }, [key]);

  return [value, setValue];
}

const USER_COLOURS = [
  { bg: "#0a93af", text: "#000000" },
  { bg: "#1663d0", text: "#ffffff" },
  { bg: "#3945da", text: "#ffffff" },
  { bg: "#703bd7", text: "#ffffff" },
  { bg: "#b13bc8", text: "#ffffff" },
  { bg: "#ffe154", text: "#000000" },
  { bg: "#c7ea63", text: "#000000" },
  { bg: "#88e198", text: "#000000" },
  { bg: "#52dba3", text: "#000000" },
  { bg: "#55e0e1", text: "#000000" },
  { bg: "#4500ff", text: "#ffffff" },
  { bg: "#bd03f4", text: "#ffffff" },
  { bg: "#fc087b", text: "#000000" },
  { bg: "#ff0f08", text: "#000000" },
  { bg: "#ff7000", text: "#000000" },
];

export function getRandomColour() {
  return USER_COLOURS[Math.round(Math.random() * 100) % USER_COLOURS.length];
}
