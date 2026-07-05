import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import "./ImageUpload.css";

interface ImageUploadProps {
  imageDataUrl: string | null;
  onFileChange: (file: File | null) => void;
}

// Mobile user agents are the ones with a camera worth offering, so only they
// get the take-photo-vs-choose-file menu; desktop clicks go straight to the
// file picker.
const isMobileDevice = () =>
  typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

export function ImageUpload({ imageDataUrl, onFileChange }: ImageUploadProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];
    onFileChange(file ?? null);
    // Reset the value so selecting the same file again still fires onChange.
    event.target.value = "";
  };

  const handleUploadClick = () => {
    if (isMobileDevice()) {
      setShowOptions(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="image-upload">
      <span className="field-label">Upload a photo of the problem</span>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        hidden
      />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} hidden />

      <div className="upload-control">
        <button type="button" className="upload-btn" onClick={handleUploadClick}>
          📷 Upload Photo
        </button>

        {showOptions && (
          <>
            <div className="upload-options-backdrop" onClick={() => setShowOptions(false)} />
            <div className="upload-options">
              <button
                type="button"
                onClick={() => {
                  setShowOptions(false);
                  cameraInputRef.current?.click();
                }}
              >
                📷 Take Photo
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOptions(false);
                  fileInputRef.current?.click();
                }}
              >
                🖼️ Choose File
              </button>
            </div>
          </>
        )}
      </div>

      <div className="preview-box">
        {imageDataUrl ? (
          <img src={imageDataUrl} alt="Uploaded problem" />
        ) : (
          <p>Your photo preview will appear here.</p>
        )}
      </div>
    </div>
  );
}
