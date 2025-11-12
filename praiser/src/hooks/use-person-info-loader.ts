"use client";

import { useEffect } from "react";
import { useAppStore } from "@/state/app-store";

export const usePersonInfoLoader = () => {
  const setPersonInfo = useAppStore((state) => state.setPersonInfo);
  const personInfo = useAppStore((state) => state.personInfo);

  useEffect(() => {
    // Only load if personInfo is not already set
    if (personInfo) return;

    const loadPersonInfo = async () => {
      try {
        const response = await fetch("/api/person-info");
        const data = await response.json();
        if (data.personInfo) {
          setPersonInfo(data.personInfo);
        }
      } catch (error) {
        console.error("Error loading person info:", error);
      }
    };

    loadPersonInfo();
  }, [setPersonInfo, personInfo]);
};

