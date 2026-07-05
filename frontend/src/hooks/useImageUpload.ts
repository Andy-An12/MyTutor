import { useCallback, useState } from "react";

export function useImageUpload() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) {
      setImageDataUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageDataUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  return { imageDataUrl, handleFileChange };
}
