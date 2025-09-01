import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, Maximize, Minimize } from 'lucide-react';
import { useState } from 'react';

interface ImageViewerProps {
  src: string;
  alt: string;
  aiHint?: string;
  className?: string;
  width?: number;
  height?: number;
  controls?: boolean;
}

export function ImageViewer({
  src,
  alt,
  aiHint,
  className,
  width = 800,
  height = 450,
  controls = true,
}: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleRotateRight = () => setRotation(prev => (prev + 90) % 360);
  const handleRotateLeft = () => setRotation(prev => (prev - 90 + 360) % 360);
  
  const handleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative aspect-video bg-black rounded-lg flex items-center justify-center p-2 border border-secondary overflow-hidden">
        <div
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease',
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            data-ai-hint={aiHint}
            className="object-contain rounded-md"
            priority
          />
        </div>
      </div>
      {controls && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleRotateLeft}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleRotateRight}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleFullscreen}>
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
