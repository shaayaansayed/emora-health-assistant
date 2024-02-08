"use client";

import React, { useState } from "react";
import PopupButton from "./components/popup-btn";
import Chat from "./components/chat";

export default function Home() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleToggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      <PopupButton onClick={handleToggleExpand} isExpanded={isExpanded} />
      {isExpanded && <Chat />}
    </main>
  );
}
