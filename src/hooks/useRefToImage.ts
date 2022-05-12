import React, { MutableRefObject } from "react";
import { toPng } from "html-to-image";

const useRefToImage = (ref: MutableRefObject<HTMLElement | null>) => {
  const downloadImage = () => {
    if (ref.current === null) return;
    toPng(ref.current, { cacheBust: true }).then((data) => {
      const link = document.createElement("a");
      link.download = "Tellonym";
      link.href = data;
      link.click();
    });
  };
  return { downloadImage };
};

export default useRefToImage;
