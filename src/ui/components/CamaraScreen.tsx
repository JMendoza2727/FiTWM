// ============================================================
// FiTWM - Camera Screen
// ============================================================

import { useAppContext } from '@ui/context/AppContext';
import { useCallback, useRef, useEffect } from 'react';
import { analyzeImageMock } from '@nutrition/analysis';

export function CamaraScreen() {
  const {
    cameraImage,
    setCameraImage,
    isAnalyzing,
    setIsAnalyzing,
    analysisError,
    setAnalysisError,
    setCurrentScreen,
  } = useAppContext();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera when screen is active
  useEffect(() => {
    let active = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (active && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch {
        if (active) {
          setAnalysisError('No se pudo acceder a la cámara. Usa la galería.');
        }
      }
    }

    startCamera();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [setAnalysisError]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCameraImage(dataUrl);
  }, [setCameraImage]);

  const analyzePhoto = useCallback(() => {
    if (!cameraImage) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    // Simulate analysis delay
    setTimeout(() => {
      try {
        analyzeImageMock(cameraImage);
        setCurrentScreen('resultado');
      } catch {
        setAnalysisError('Error al analizar la imagen');
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  }, [cameraImage, setIsAnalyzing, setAnalysisError, setCurrentScreen]);

  const cancelPhoto = useCallback(() => {
    setCameraImage(null);
  }, [setCameraImage]);

  // If we have an image, show preview mode
  if (cameraImage) {
    return (
      <div className="screen camara-screen camara-preview">
        <div className="camara-preview-header">
          <button className="camara-preview-back" onClick={cancelPhoto} aria-label="Cancelar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="camara-preview-title">Vista previa</span>
          <button className="camara-preview-cancel" onClick={cancelPhoto} aria-label="Cancelar">
            Cancelar
          </button>
        </div>

        <div className="camara-preview-image-container">
          <img src={cameraImage} alt="Foto capturada" className="camara-preview-image" />
        </div>

        <div className="camara-preview-actions">
          <button className="camara-preview-btn camara-preview-btn-gallery" onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment';
            (input as HTMLInputElement).onchange = (e: Event) => {
              const target = e.target as HTMLInputElement;
              const file = target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                setCameraImage(reader.result as string);
              };
              reader.readAsDataURL(file);
            };
            input.click();
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Galería</span>
          </button>

          {isAnalyzing ? (
            <div className="camara-preview-btn camara-preview-btn-analyze camara-preview-btn-analyzing">
              <div className="camara-preview-spinner" />
              <span>Analizando...</span>
            </div>
          ) : (
            <button className="camara-preview-btn camara-preview-btn-analyze" onClick={analyzePhoto}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1l6 6" /><path d="M23 1l-6 6" /><path d="M1 23l6-6" /><path d="M23 23l-6-6" />
                <rect x="7" y="7" width="10" height="10" rx="1" />
              </svg>
              <span>Analizar</span>
            </button>
          )}
        </div>

        {analysisError && (
          <div className="camara-preview-error">
            <span>{analysisError}</span>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  // Camera view
  return (
    <div className="screen camara-screen">
      <div className="camara-header">
        <h1 className="screen-title">Cámara</h1>
      </div>

      <div className="camara-viewfinder">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camara-video"
        />
        {/* Grid overlay */}
        <div className="camara-grid">
          <div className="camara-grid-line camara-grid-h1" />
          <div className="camara-grid-line camara-grid-h2" />
          <div className="camara-grid-line camara-grid-v1" />
          <div className="camara-grid-line camara-grid-v2" />
        </div>
        {/* Focus indicator */}
        <div className="camara-focus-ring" />
      </div>

      <div className="camara-controls">
        <button className="camara-btn camara-btn-gallery" onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          (input as HTMLInputElement).onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              setCameraImage(reader.result as string);
            };
            reader.readAsDataURL(file);
          };
          input.click();
        }} aria-label="Desde galería">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
          </svg>
        </button>

        <button className="camara-btn camara-btn-capture" onClick={capturePhoto} aria-label="Capturar foto">
          <div className="camara-btn-capture-inner" />
        </button>

        <button className="camara-btn camara-btn-flash" aria-label="Flash">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </button>
      </div>

      <div className="camara-hint">
        <span>Enfoca tu comida y captura</span>
      </div>
    </div>
  );
}
