import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  phase: number;
}

export default function OilCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const blobsRef = useRef<Blob[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Reinitialize blobs when canvas resizes
      initializeBlobs();
    };

    const initializeBlobs = () => {
      const { width, height } = canvas.getBoundingClientRect();
      blobsRef.current = [];
      
      for (let i = 0; i < 8; i++) {
        blobsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 50 + Math.random() * 100,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const animate = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      // Update and draw blobs
      blobsRef.current.forEach((blob) => {
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.phase += 0.02;

        // Bounce off edges
        if (blob.x < 0 || blob.x > width) blob.vx *= -1;
        if (blob.y < 0 || blob.y > height) blob.vy *= -1;

        // Keep blobs within bounds
        blob.x = Math.max(0, Math.min(width, blob.x));
        blob.y = Math.max(0, Math.min(height, blob.y));

        // Add sine wave motion
        const sineOffset = Math.sin(blob.phase) * 20;

        // Draw blob with gradient
        const gradient = ctx.createRadialGradient(
          blob.x + sineOffset,
          blob.y + sineOffset,
          0,
          blob.x + sineOffset,
          blob.y + sineOffset,
          blob.radius
        );
        gradient.addColorStop(0, "rgba(245, 158, 11, 0.8)"); // secondary color
        gradient.addColorStop(1, "rgba(245, 158, 11, 0.1)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x + sineOffset, blob.y + sineOffset, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (!prefersReducedMotion) {
      resizeCanvas();
      animate();

      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      // Static fallback for reduced motion
      resizeCanvas();
      const { width, height } = canvas.getBoundingClientRect();
      
      // Draw static gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(245, 158, 11, 0.3)");
      gradient.addColorStop(1, "rgba(245, 158, 11, 0.1)");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30"
      style={{ mixBlendMode: "multiply" }}
    />
  );
}
