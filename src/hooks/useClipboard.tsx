import React from "react";

const useClipboard = () => {
  async function readText() {
    try {
      const clipboardContent = await navigator.clipboard.readText();
      return clipboardContent;
    } catch (error: any) {
      console.error(error.message);
    }
  }

  return { readText };
};

export default useClipboard;
