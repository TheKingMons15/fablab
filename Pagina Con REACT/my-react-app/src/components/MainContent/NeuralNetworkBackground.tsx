import React, { useEffect, useRef } from 'react';

interface NeuralNetworkBackgroundProps {
  color?: string;
  nodeDensity?: number;
}

const NeuralNetworkBackground: React.FC<NeuralNetworkBackgroundProps> = ({ 
  color = 'rgba(255, 255, 255, 0.5)', 
  nodeDensity = 20 
}) => {
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

    // Nodos (círculos) y conexiones (líneas)
    interface Node {
      x: number;
      y: number;
      radius: number;
      speed: number;
      directionX: number;
      directionY: number;
      connections: number[];
      pulses: Pulse[];
    }

    interface Pulse {
      connectionIndex: number;
      progress: number;
      speed: number;
    }

    const nodes: Node[] = [];
    
    // Crear nodos distribuidos por el canvas
    const nodeCount = Math.floor((canvas.width * canvas.height) / (nodeDensity * 1000));
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 2 + Math.random() * 3,
        speed: 0.1 + Math.random() * 0.2,
        directionX: Math.random() * 2 - 1,
        directionY: Math.random() * 2 - 1,
        connections: [],
        pulses: []
      });
    }

    // Determinar conexiones entre nodos cercanos
    const maxDistance = 200;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          nodes[i].connections.push(j);
          
          // Crear pulsos iniciales en algunas conexiones (30% de probabilidad)
          if (Math.random() < 0.3) {
            nodes[i].pulses.push({
              connectionIndex: nodes[i].connections.length - 1,
              progress: 0,
              speed: 0.005 + Math.random() * 0.01
            });
          }
        }
      }
    }

    // Animación
    const animate = () => {
      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar las conexiones y nodos
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Actualizar posición del nodo
        node.x += node.directionX * node.speed;
        node.y += node.directionY * node.speed;
        
        // Rebote en los bordes
        if (node.x <= node.radius || node.x >= canvas.width - node.radius) {
          node.directionX *= -1;
        }
        if (node.y <= node.radius || node.y >= canvas.height - node.radius) {
          node.directionY *= -1;
        }
        
        // Dibujar conexiones
        for (let j = 0; j < node.connections.length; j++) {
          const connectedNodeIndex = node.connections[j];
          const connectedNode = nodes[connectedNodeIndex];
          
          // Calcular la opacidad basada en la distancia
          const dx = node.x - connectedNode.x;
          const dy = node.y - connectedNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const opacity = 1 - distance / maxDistance;
          
          // Dibujar la línea de conexión
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.strokeStyle = color.replace(/[\d\.]+\)$/, `${opacity * 0.4})`);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        // Dibujar el nodo (círculo)
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Actualizar y dibujar pulsos
        for (let p = node.pulses.length - 1; p >= 0; p--) {
          const pulse = node.pulses[p];
          const connectedNodeIndex = node.connections[pulse.connectionIndex];
          
          if (connectedNodeIndex !== undefined) {
            const connectedNode = nodes[connectedNodeIndex];
            
            // Actualizar progreso del pulso
            pulse.progress += pulse.speed;
            
            // Eliminar pulso si completa su recorrido
            if (pulse.progress >= 1) {
              // Crear un nuevo pulso en el nodo conectado (simulando flujo de datos)
              if (Math.random() < 0.7) {
                const newConnection = connectedNode.connections.length > 0 
                  ? Math.floor(Math.random() * connectedNode.connections.length)
                  : -1;
                  
                if (newConnection >= 0) {
                  connectedNode.pulses.push({
                    connectionIndex: newConnection,
                    progress: 0,
                    speed: 0.005 + Math.random() * 0.01
                  });
                }
              }
              
              node.pulses.splice(p, 1);
              continue;
            }
            
            // Dibujar el pulso como un círculo que se mueve a lo largo de la conexión
            const pulseX = node.x + (connectedNode.x - node.x) * pulse.progress;
            const pulseY = node.y + (connectedNode.y - node.y) * pulse.progress;
            
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
          } else {
            node.pulses.splice(p, 1);
          }
        }
        
        // Generar nuevos pulsos aleatoriamente
        if (node.connections.length > 0 && Math.random() < 0.002) {
          const randomConnection = Math.floor(Math.random() * node.connections.length);
          node.pulses.push({
            connectionIndex: randomConnection,
            progress: 0,
            speed: 0.005 + Math.random() * 0.01
          });
        }
      }
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [color, nodeDensity]);

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
        pointerEvents: 'none',
      }}
    />
  );
};

export default NeuralNetworkBackground;