import React from 'react';

const useClipboard = () => {
  async function readText() {
    try {
      // @ts-expect-error
      const permission = await navigator.permissions.query({ name: 'clipboard-read', allowWithoutGesture: false });
      if (permission.state === 'denied') {
        throw new Error('Not allowed to read clipboard.');
      }
      const clipboardContent = await navigator.clipboard.readText();
      return clipboardContent;
    }
    catch (error: any) {
      console.error(error.message);
    }
  };

  return { readText };
};

export default useClipboard;