"use client";

import { useEffect } from "react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { Sidebar } from "@/components/sidebar/sidebar";
import { AdminPanel } from "@/components/admin/admin-panel";
import { useAppStore, loadStoredSettings } from "@/state/app-store";
import { usePersonInfoLoader } from "@/hooks/use-person-info-loader";
import { usePraiseMode } from "@/hooks/use-praise-mode";

export default function Home() {
  // Load stored settings from localStorage on client mount
  useEffect(() => {
    loadStoredSettings();
  }, []);
  
  // Load person info on app startup
  usePersonInfoLoader();
  // Handle praise mode logic
  usePraiseMode();

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <ChatPanel />
      </div>
      <AdminPanel />
    </main>
  );
}

