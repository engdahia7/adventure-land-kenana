import React, { useEffect, useRef } from 'react';
import { WeatherType } from '../types';

interface WeatherParticleCanvasProps {
  weather: WeatherType;
  density?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  vRot: number;
  life: number;
  maxLife: number;
  char?: string;
}

const HIEROGLYPH_RUNES = ['𓂀', '𓋹', '𓊹', '𓏏', '𓍹', '𓆣', '𓇳', '𓊃', '𓊪'];

export const WeatherParticleCanvas: React.FC<WeatherParticleCanvasProps> = ({
  weather,
  density = 60,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate initial particles based on weather type
    const particles: Particle[] = [];
    const count = weather === 'sandstorm' ? density * 2 : density;

    const createParticle = (randomY = true): Particle => {
      const pLife = 80 + Math.random() * 120;
      let pColor = 'rgba(212, 175, 55, ';
      let vx = (Math.random() - 0.5) * 0.8;
      let vy = (Math.random() - 0.5) * 0.8;
      let size = 1.5 + Math.random() * 3;
      let char: string | undefined = undefined;

      switch (weather) {
        case 'sandstorm':
          // Fast diagonal desert sand rushing across screen
          vx = 3.5 + Math.random() * 5.5;
          vy = 1.0 + Math.random() * 2.2;
          size = 1.2 + Math.random() * 2.8;
          pColor = Math.random() > 0.4 ? 'rgba(224, 169, 109, ' : 'rgba(180, 120, 50, ';
          break;

        case 'blazing_sun':
          // Heat shimmer rising upwards with golden glare
          vx = (Math.random() - 0.5) * 0.7;
          vy = -(0.8 + Math.random() * 1.5);
          size = 2.0 + Math.random() * 4.5;
          pColor = Math.random() > 0.5 ? 'rgba(255, 220, 130, ' : 'rgba(255, 190, 80, ';
          break;

        case 'golden_dusk':
          // Gentle ambient twilight golden motes
          vx = 0.4 + Math.random() * 0.8;
          vy = (Math.random() - 0.5) * 0.5;
          size = 2.0 + Math.random() * 3.5;
          pColor = 'rgba(243, 229, 171, ';
          break;

        case 'nile_breeze':
          // Floating river mist motes and turquoise sparkles
          vx = 0.8 + Math.random() * 1.4;
          vy = -0.3 + Math.random() * 0.6;
          size = 1.8 + Math.random() * 3.2;
          pColor = Math.random() > 0.5 ? 'rgba(125, 211, 252, ' : 'rgba(147, 197, 253, ';
          break;

        case 'night_stars':
          // Subtle lantern embers and twinkling stars
          vx = (Math.random() - 0.5) * 0.5;
          vy = -(0.5 + Math.random() * 1.0);
          size = 1.5 + Math.random() * 3.0;
          pColor = Math.random() > 0.4 ? 'rgba(251, 191, 36, ' : 'rgba(243, 244, 246, ';
          break;

        case 'mystic_glow':
          // Ethereal ancient floating hieroglyphic runes & arcane sparks
          vx = (Math.random() - 0.5) * 0.6;
          vy = -(0.4 + Math.random() * 0.9);
          size = 12 + Math.random() * 10;
          pColor = Math.random() > 0.5 ? 'rgba(56, 189, 248, ' : 'rgba(212, 175, 55, ';
          char = HIEROGLYPH_RUNES[Math.floor(Math.random() * HIEROGLYPH_RUNES.length)];
          break;
      }

      return {
        x: weather === 'sandstorm' ? -20 : Math.random() * width,
        y: randomY ? Math.random() * height : weather === 'blazing_sun' || weather === 'night_stars' || weather === 'mystic_glow' ? height + 20 : Math.random() * height,
        vx,
        vy,
        size,
        alpha: 0.15 + Math.random() * 0.65,
        color: pColor,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.05,
        life: pLife,
        maxLife: pLife,
        char,
      };
    };

    for (let i = 0; i < count; i++) {
      particles.push(createParticle(true));
    }

    let windPulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      windPulse += 0.02;

      // Special overlay layers for sandstorm gusts or sunbeams
      if (weather === 'sandstorm') {
        const gust = Math.sin(windPulse) * 0.08 + 0.12;
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, `rgba(180, 110, 45, ${gust})`);
        grad.addColorStop(0.5, `rgba(210, 150, 75, ${gust * 0.8})`);
        grad.addColorStop(1, `rgba(140, 85, 30, ${gust * 1.2})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (weather === 'blazing_sun') {
        // Subtle sunbeam rays from top-left
        const sunRayGrad = ctx.createRadialGradient(width * 0.15, 0, 10, width * 0.3, height * 0.5, width * 0.8);
        sunRayGrad.addColorStop(0, 'rgba(255, 235, 170, 0.14)');
        sunRayGrad.addColorStop(0.5, 'rgba(255, 215, 120, 0.05)');
        sunRayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sunRayGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (weather === 'mystic_glow') {
        // Mystic indigo-gold center vignette
        const mysticGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, 50, width * 0.5, height * 0.5, width * 0.7);
        mysticGrad.addColorStop(0, 'rgba(56, 189, 248, 0.06)');
        mysticGrad.addColorStop(0.6, 'rgba(147, 51, 234, 0.04)');
        mysticGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = mysticGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw and update each particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life -= 1;

        // Reset if out of bounds or dead
        if (
          p.life <= 0 ||
          p.x > width + 40 ||
          p.x < -40 ||
          p.y > height + 40 ||
          p.y < -40
        ) {
          particles[i] = createParticle(false);
          continue;
        }

        p.x += p.vx + (weather === 'sandstorm' ? Math.sin(windPulse + p.y * 0.01) * 0.8 : 0);
        p.y += p.vy;
        p.rotation += p.vRot;

        const lifeRatio = p.life / p.maxLife;
        const currentAlpha = p.alpha * Math.sin(lifeRatio * Math.PI);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.char) {
          // Render glowing hieroglyph rune
          ctx.font = `${Math.round(p.size)}px "Cairo", serif`;
          ctx.fillStyle = `${p.color}${currentAlpha})`;
          ctx.shadowColor = p.color === 'rgba(56, 189, 248, ' ? '#38bdf8' : '#d4af37';
          ctx.shadowBlur = 8;
          ctx.fillText(p.char, -p.size / 2, p.size / 2);
        } else {
          // Render soft particle / dust speck / ember
          ctx.beginPath();
          if (weather === 'sandstorm') {
            // Elongated streak for blowing sand
            ctx.ellipse(0, 0, p.size * 2.2, p.size * 0.8, p.rotation, 0, Math.PI * 2);
          } else {
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          }
          ctx.fillStyle = `${p.color}${currentAlpha})`;

          if (weather === 'night_stars' || weather === 'blazing_sun') {
            ctx.shadowColor = '#d4af37';
            ctx.shadowBlur = 4;
          }

          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [weather, density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 mix-blend-screen transition-opacity duration-700"
    />
  );
};
