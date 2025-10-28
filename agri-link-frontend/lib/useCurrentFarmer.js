"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "agriLinkFarmer";

function parseStoredFarmer(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch (error) {
    console.warn("Failed to parse stored farmer", error);
  }
  return null;
}

export function getStoredFarmer() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return parseStoredFarmer(raw);
}

export function setStoredFarmer(farmer) {
  if (typeof window === "undefined") return;
  if (!farmer) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(farmer));
  } catch (error) {
    console.warn("Failed to persist farmer", error);
  }
}

export default function useCurrentFarmer() {
  const [farmer, setFarmer] = useState(() => getStoredFarmer());

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        setFarmer(parseStoredFarmer(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return farmer;
}
