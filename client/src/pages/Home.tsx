/**
 * Design Philosophy: "Đêm Hội Phố Cổ" - Vintage Hội An Aesthetic
 * Updated: Pháo hoa, nút nhận giải với nhạc xổ số, bảng số đã quay to hơn
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Sound effects using Web Audio API
const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const prizeAudioRef = useRef<OscillatorNode[]>([]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playClickSound = useCallback(() => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }, [getAudioContext]);

  const playFireworkSound = useCallback(() => {
    const ctx = getAudioContext();
    
    // Multiple explosion sounds
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const noise = ctx.createOscillator();
        const noiseGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        noise.type = 'sawtooth';
        noise.frequency.setValueAtTime(100 + Math.random() * 200, ctx.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        
        noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        noise.start(ctx.currentTime);
        noise.stop(ctx.currentTime + 0.5);
        
        // Sparkle sounds
        const sparkle = ctx.createOscillator();
        const sparkleGain = ctx.createGain();
        sparkle.type = 'sine';
        sparkle.frequency.setValueAtTime(2000 + Math.random() * 1000, ctx.currentTime);
        sparkle.connect(sparkleGain);
        sparkleGain.connect(ctx.destination);
        sparkleGain.gain.setValueAtTime(0.1, ctx.currentTime);
        sparkleGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        sparkle.start(ctx.currentTime);
        sparkle.stop(ctx.currentTime + 0.3);
      }, i * 300);
    }
  }, [getAudioContext]);

  const playPrizeMusic = useCallback(() => {
    const ctx = getAudioContext();
    
    // Stop any existing prize music
    prizeAudioRef.current.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    prizeAudioRef.current = [];
    
    // Lottery/Prize announcement melody (similar to Vietnamese lottery music)
    // Using a dramatic ascending pattern
    const melody = [
      // Intro fanfare
      { freq: 392, duration: 0.2, delay: 0 },      // G4
      { freq: 440, duration: 0.2, delay: 0.2 },    // A4
      { freq: 494, duration: 0.2, delay: 0.4 },    // B4
      { freq: 523, duration: 0.4, delay: 0.6 },    // C5
      
      // Main theme - dramatic build
      { freq: 523, duration: 0.3, delay: 1.2 },    // C5
      { freq: 587, duration: 0.3, delay: 1.5 },    // D5
      { freq: 659, duration: 0.3, delay: 1.8 },    // E5
      { freq: 698, duration: 0.5, delay: 2.1 },    // F5
      
      // Climax
      { freq: 784, duration: 0.3, delay: 2.8 },    // G5
      { freq: 880, duration: 0.3, delay: 3.1 },    // A5
      { freq: 988, duration: 0.3, delay: 3.4 },    // B5
      { freq: 1047, duration: 0.8, delay: 3.7 },   // C6
      
      // Resolution with tremolo effect
      { freq: 784, duration: 0.2, delay: 4.7 },    // G5
      { freq: 1047, duration: 0.2, delay: 4.9 },   // C6
      { freq: 784, duration: 0.2, delay: 5.1 },    // G5
      { freq: 1047, duration: 0.2, delay: 5.3 },   // C6
      { freq: 784, duration: 0.2, delay: 5.5 },    // G5
      { freq: 1047, duration: 1.0, delay: 5.7 },   // C6 (final hold)
    ];
    
    melody.forEach(note => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.delay);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + note.delay);
      gainNode.gain.linearRampToValueAtTime(0.35, ctx.currentTime + note.delay + 0.05);
      gainNode.gain.setValueAtTime(0.35, ctx.currentTime + note.delay + note.duration - 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.delay + note.duration);
      
      oscillator.start(ctx.currentTime + note.delay);
      oscillator.stop(ctx.currentTime + note.delay + note.duration + 0.1);
      
      prizeAudioRef.current.push(oscillator);
    });
    
    // Add bass accompaniment
    const bassNotes = [
      { freq: 131, duration: 0.8, delay: 0 },      // C3
      { freq: 147, duration: 0.8, delay: 1.2 },    // D3
      { freq: 165, duration: 0.8, delay: 2.1 },    // E3
      { freq: 196, duration: 1.5, delay: 3.7 },    // G3
      { freq: 262, duration: 1.2, delay: 5.5 },    // C4
    ];
    
    bassNotes.forEach(note => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.delay);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime + note.delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.delay + note.duration);
      
      oscillator.start(ctx.currentTime + note.delay);
      oscillator.stop(ctx.currentTime + note.delay + note.duration + 0.1);
      
      prizeAudioRef.current.push(oscillator);
    });
  }, [getAudioContext]);

  return { playClickSound, playFireworkSound, playPrizeMusic };
};

// Firework component
const Fireworks = ({ show }: { show: boolean }) => {
  if (!show) return null;
  
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF69B4', '#FFA500', '#00FF00', '#FF4500', '#FFFF00'];
  
  // Create multiple firework bursts
  const fireworks = Array.from({ length: 8 }).map((_, i) => ({
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 40,
    delay: i * 0.3,
    color: colors[i % colors.length],
  }));
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {fireworks.map((fw, fwIndex) => (
        <div key={fwIndex} className="absolute" style={{ left: `${fw.x}%`, top: `${fw.y}%` }}>
          {/* Firework particles */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const distance = 80 + Math.random() * 60;
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: fw.color,
                  boxShadow: `0 0 6px ${fw.color}, 0 0 12px ${fw.color}`,
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: fw.delay,
                  ease: "easeOut",
                }}
              />
            );
          })}
          {/* Center flash */}
          <motion.div
            className="absolute w-8 h-8 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{
              background: `radial-gradient(circle, white 0%, ${fw.color} 50%, transparent 70%)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 3, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.5,
              delay: fw.delay,
            }}
          />
        </div>
      ))}
      {/* Trailing sparks */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`spark-${i}`}
          className="absolute w-1 h-1 rounded-full bg-yellow-300"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            boxShadow: '0 0 4px #FFD700',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, 100],
          }}
          transition={{
            duration: 2,
            delay: 0.5 + Math.random() * 1.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// Prize announcement overlay
const PrizeOverlay = ({ show }: { show: boolean }) => {
  if (!show) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 10 }}
      >
        <motion.div
          className="text-6xl md:text-8xl font-bold mb-4"
          style={{
            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 40px rgba(255, 215, 0, 0.5)",
            fontFamily: "var(--font-display)",
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: 6,
          }}
        >
          🏆 TRÚNG GIẢI! 🏆
        </motion.div>
        <motion.div
          className="text-2xl md:text-4xl text-yellow-300"
          style={{ fontFamily: "var(--font-display)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ✨ CHÚC MỪNG ✨
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [flyingNumber, setFlyingNumber] = useState<number | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const { playClickSound, playFireworkSound, playPrizeMusic } = useSound();

  const handleNumberClick = useCallback((num: number) => {
    if (selectedNumbers.includes(num)) return;
    
    playClickSound();
    setFlyingNumber(num);
    
    setTimeout(() => {
      setSelectedNumbers(prev => [...prev, num]);
      setFlyingNumber(null);
    }, 500);
  }, [selectedNumbers, playClickSound]);

  const handleReset = useCallback(() => {
    setSelectedNumbers([]);
    setFlyingNumber(null);
    setShowFireworks(false);
    setShowPrize(false);
  }, []);

  const handleFireworks = useCallback(() => {
    playFireworkSound();
    setShowFireworks(true);
    setTimeout(() => setShowFireworks(false), 4000);
  }, [playFireworkSound]);

  const handlePrize = useCallback(() => {
    playPrizeMusic();
    setShowPrize(true);
    setShowFireworks(true);
    setTimeout(() => {
      setShowPrize(false);
      setShowFireworks(false);
    }, 7000);
  }, [playPrizeMusic]);

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/background-red.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Fireworks effect */}
      <Fireworks show={showFireworks} />
      
      {/* Prize overlay */}
      <AnimatePresence>
        {showPrize && <PrizeOverlay show={showPrize} />}
      </AnimatePresence>
      
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      
      {/* Chùa Cầu Hội An - Left side */}
      <img 
        src="/images/chua-cau.png" 
        alt="Chùa Cầu Hội An" 
        className="absolute bottom-0 left-0 w-40 md:w-56 lg:w-72 opacity-90 z-10 pointer-events-none"
      />
      
      {/* Cầu Rồng Đà Nẵng - Right side */}
      <img 
        src="/images/cau-rong.png" 
        alt="Cầu Rồng Đà Nẵng" 
        className="absolute bottom-0 right-0 w-40 md:w-56 lg:w-72 opacity-90 z-10 pointer-events-none"
      />
      
      {/* Decorative lanterns */}
      <img 
        src="/images/longden.png" 
        alt="Đèn lồng" 
        className="absolute top-0 left-4 w-14 md:w-20 lg:w-24 float-animation opacity-90 z-10"
        style={{ animationDelay: "0s" }}
      />
      <img 
        src="/images/longden.png" 
        alt="Đèn lồng" 
        className="absolute top-0 right-4 w-14 md:w-20 lg:w-24 float-animation opacity-90 z-10"
        style={{ animationDelay: "1.5s" }}
      />
      
      {/* Main content */}
      <div className="relative z-20 container mx-auto py-3 px-4 min-h-screen flex flex-col">
        {/* Header with logos */}
        <header className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <img 
            src="/images/logo.png" 
            alt="Hội An Hoa & Organic" 
            className="h-8 md:h-12 lg:h-14 object-contain"
          />
          <img 
            src="/images/chu.png" 
            alt="Year End Party" 
            className="h-6 md:h-10 lg:h-12 object-contain"
          />
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={handleFireworks}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold shadow-lg text-xs md:text-sm"
              size="sm"
            >
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Pháo Hoa
            </Button>
            <Button 
              onClick={handlePrize}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white font-bold shadow-lg text-xs md:text-sm"
              size="sm"
            >
              <Trophy className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Nhận Giải
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/20 border-white/50 hover:bg-white/30 text-white text-xs md:text-sm"
                >
                  <RotateCcw className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gradient-to-b from-red-900 to-red-950 border-yellow-500/50">
                <AlertDialogHeader>
                  <AlertDialogTitle className="golden-text text-xl">Xác nhận Reset</AlertDialogTitle>
                  <AlertDialogDescription className="text-yellow-100/80">
                    Bạn có chắc muốn reset lại trò chơi? Tất cả số đã quay sẽ bị xóa.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-yellow-500/30 text-yellow-100 hover:bg-yellow-500/10">
                    Hủy
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-500 text-white"
                  >
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        {/* Winner Board - Numbers that have been drawn - LARGER */}
        <section className="mb-3 flex-1">
          <div className="winner-board rounded-xl p-4 md:p-6 bg-gradient-to-b from-red-900/95 to-red-950/98 border-2 border-yellow-500/60 shadow-2xl h-full min-h-[200px] md:min-h-[280px]">
            <h2 className="golden-text text-xl md:text-3xl lg:text-4xl font-bold text-center mb-4" style={{ fontFamily: "var(--font-display)" }}>
              SỐ ĐÃ QUAY ({selectedNumbers.length}/60)
            </h2>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4 p-2">
              <AnimatePresence mode="popLayout">
                {selectedNumbers.map((num, index) => (
                  <motion.div
                    key={num}
                    initial={{ scale: 0, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      delay: index * 0.02 
                    }}
                    className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, #ffd700 0%, #d4a574 50%, #a67c4a 100%)",
                      boxShadow: "0 0 20px rgba(255, 215, 0, 0.6), inset 0 -4px 12px rgba(0,0,0,0.3), inset 0 4px 12px rgba(255,255,255,0.3)"
                    }}
                  >
                    <span 
                      className="text-red-900 font-bold text-lg md:text-2xl lg:text-3xl"
                      style={{ fontFamily: "var(--font-display)", textShadow: "0 1px 2px rgba(255,255,255,0.3)" }}
                    >
                      {num}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {selectedNumbers.length === 0 && (
                <p className="text-yellow-100/60 text-center w-full py-8 text-base md:text-lg" style={{ fontFamily: "var(--font-body)" }}>
                  Chưa có số nào được quay. Bấm vào các viên bi bên dưới để chọn số.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Loto Ball Grid - 60 numbers - SMALLER */}
        <section>
          <div className="rounded-lg p-2 md:p-3 bg-black/30 backdrop-blur-sm border border-yellow-500/40">
            <h2 className="golden-text text-sm md:text-base lg:text-lg font-bold text-center mb-2" style={{ fontFamily: "var(--font-display)" }}>
              BẢNG SỐ LÔ TÔ
            </h2>
            <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 lg:grid-cols-20 gap-1 md:gap-1.5 justify-items-center"
                 style={{ gridTemplateColumns: "repeat(auto-fit, minmax(32px, 1fr))" }}>
              {Array.from({ length: 60 }, (_, i) => i + 1).map((num) => {
                const isSelected = selectedNumbers.includes(num);
                const isFlying = flyingNumber === num;
                
                return (
                  <motion.button
                    key={num}
                    onClick={() => handleNumberClick(num)}
                    disabled={isSelected}
                    className={`
                      loto-ball w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9
                      ${isSelected ? 'selected' : ''}
                      ${isFlying ? 'fly-animation' : ''}
                    `}
                    whileHover={!isSelected ? { scale: 1.15 } : {}}
                    whileTap={!isSelected ? { scale: 0.95 } : {}}
                  >
                    <span className="loto-ball-number text-red-900 text-xs md:text-sm">
                      {num}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-2 text-center">
          <p className="text-yellow-100/70 text-xs" style={{ fontFamily: "var(--font-body)" }}>
            Year End Party 2026 - Tết Nguyên Đán Bính Ngọ 🧧
          </p>
        </footer>
      </div>
    </div>
  );
}
