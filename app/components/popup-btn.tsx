import React from "react";
import Image from "next/image";

import EmoraHealthLogo from "../icons/emora-health-logo.svg";

interface PopupButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

export const PopupButton: React.FC<PopupButtonProps> = ({
  isExpanded,
  onClick,
}) => {
  return (
    <button
      className="fixed bottom-[24px] right-[24px] w-[64px] h-[64px] rounded-full border-none box-border flex items-center justify-center transition-all duration-200 ease-in-out opacity-100 cursor-pointer hover:scale-105 active:scale-90 focus:outline-none"
      onClick={onClick}
    >
      <Image
        className="absolute h-full w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-100 ease-in-out"
        src={EmoraHealthLogo}
        alt="Emora Health Logo"
      />
    </button>
  );
};

export default PopupButton;
