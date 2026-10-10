import React, { useEffect, useRef } from 'react';

export default function GlobeCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let angle = 0;

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.008 + 0.002,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drawStars = (t) => {
      stars.forEach(s => {
        const twinkle = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed * 60 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${twinkle})`;
        ctx.fill();
      });
    };

    const drawGlobe = (cx, cy, R, angle) => {
      // Glow
      const grd = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 1.4);
      grd.addColorStop(0,   'rgba(196,211,0,0.06)');
      grd.addColorStop(0.5, 'rgba(0,201,167,0.04)');
      grd.addColorStop(1,   'rgba(5,13,26,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Clip to sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // Sphere fill
      const sphereGrd = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
      sphereGrd.addColorStop(0,   'rgba(15,35,68,0.95)');
      sphereGrd.addColorStop(0.6, 'rgba(8,20,45,0.97)');
      sphereGrd.addColorStop(1,   'rgba(3,10,28,0.99)');
      ctx.fillStyle = sphereGrd;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      // Latitude lines
      const latCount = 8;
      for (let i = 1; i < latCount; i++) {
        const lat = (i / latCount) * Math.PI - Math.PI / 2;
        const ry = R * Math.cos(lat);
        const yPos = cy + R * Math.sin(lat);
        ctx.beginPath();
        ctx.ellipse(cx, yPos, ry, ry * 0.18, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(196,211,0,0.12)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Longitude lines (rotating)
      const lngCount = 10;
      for (let i = 0; i < lngCount; i++) {
        const lngAngle = angle + (i / lngCount) * Math.PI * 2;
        const rx = R * Math.abs(Math.cos(lngAngle));
        const alpha = 0.05 + 0.1 * (0.5 + 0.5 * Math.cos(lngAngle));
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, R, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(196,211,0,${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Equator highlight
      ctx.beginPath();
      ctx.ellipse(cx, cy, R, R * 0.18, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,201,167,0.22)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();

      // Globe outline
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(196,211,0,0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Specular highlight
      const specGrd = ctx.createRadialGradient(cx - R * 0.38, cy - R * 0.38, 0, cx - R * 0.38, cy - R * 0.38, R * 0.55);
      specGrd.addColorStop(0,   'rgba(255,255,255,0.07)');
      specGrd.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = specGrd;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.restore();
    };

    let last = 0;
    const draw = (t) => {
      const dt = t - last;
      last = t;
      angle += 0.0015;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space bg
      ctx.fillStyle = '#050d1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawStars(t / 1000);

      const cx = canvas.width  * 0.5;
      const cy = canvas.height * 0.5;
      const R  = Math.min(canvas.width, canvas.height) * 0.3;
      drawGlobe(cx, cy, R, angle);

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="globe-canvas" />;
}
