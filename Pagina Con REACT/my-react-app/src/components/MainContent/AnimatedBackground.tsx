import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  color?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ color = 'rgba(255, 255, 255, 0.2)' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full size of its container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
      }
    };

    // Initialize canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Line configuration - Aumentando la cantidad de líneas
    const lines: { x: number; y: number; length: number; angle: number; speed: number }[] = [];
    const lineCount = Math.floor(canvas.width / 20); // Reducido para tener más líneas

    // Create initial lines - Con longitudes mayores
    for (let i = 0; i < lineCount; i++) {
      lines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 100 + Math.random() * 200, // Líneas más largas
        angle: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.3,
      });
    }

    // Animation loop
    const animate = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5; // Líneas ligeramente más gruesas

      // Draw and update each line
      lines.forEach((line) => {
        // Draw the line
        ctx.beginPath();
        const endX = line.x + Math.cos(line.angle) * line.length;
        const endY = line.y + Math.sin(line.angle) * line.length;
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Update position
        line.x += Math.cos(line.angle) * line.speed;
        line.y += Math.sin(line.angle) * line.speed;

        // If line goes off screen, reset it
        if (
          line.x < -line.length ||
          line.x > canvas.width + line.length ||
          line.y < -line.length ||
          line.y > canvas.height + line.length
        ) {
          line.x = Math.random() * canvas.width;
          line.y = Math.random() * canvas.height;
          line.angle = Math.random() * Math.PI * 2;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    />
  );
};

export default AnimatedBackground;