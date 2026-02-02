/**
 * Design Philosophy: "Đêm Hội Phố Cổ" - Vintage Hội An Aesthetic
 * Updated: Bố cục đẹp hơn, Year End Party to hơn, nút chỉ icon
 */

import { useState, useCallback, useRef } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    
    prizeAudioRef.current.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    prizeAudioRef.current = [];
    
    const melody = [
      { freq: 392, duration: 0.2, delay: 0 },
      { freq: 440, duration: 0.2, delay: 0.2 },
      { freq: 494, duration: 0.2, delay: 0.4 },
      { freq: 523, duration: 0.4, delay: 0.6 },
      { freq: 523, duration: 0.3, delay: 1.2 },
      { freq: 587, duration: 0.3, delay: 1.5 },
      { freq: 659, duration: 0.3, delay: 1.8 },
      { freq: 698, duration: 0.5, delay: 2.1 },
      { freq: 784, duration: 0.3, delay: 2.8 },
      { freq: 880, duration: 0.3, delay: 3.1 },
      { freq: 988, duration: 0.3, delay: 3.4 },
      { freq: 1047, duration: 0.8, delay: 3.7 },
      { freq: 784, duration: 0.2, delay: 4.7 },
      { freq: 1047, duration: 0.2, delay: 4.9 },
      { freq: 784, duration: 0.2, delay: 5.1 },
      { freq: 1047, duration: 0.2, delay: 5.3 },
      { freq: 784, duration: 0.2, delay: 5.5 },
      { freq: 1047, duration: 1.0, delay: 5.7 },
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
    
    const bassNotes = [
      { freq: 131, duration: 0.8, delay: 0 },
      { freq: 147, duration: 0.8, delay: 1.2 },
      { freq: 165, duration: 0.8, delay: 2.1 },
      { freq: 196, duration: 1.5, delay: 3.7 },
      { freq: 262, duration: 1.2, delay: 5.5 },
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
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4"
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
          className="text-xl md:text-3xl lg:text-4xl text-yellow-300"
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
      className="h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/background-red.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Fireworks effect */}
      <Fireworks show={showFireworks} />
      
      {/* Prize overlay */}
      <AnimatePresence>
        {showPrize && <PrizeOverlay show={showPrize} />}
      </AnimatePresence>
      
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      
      {/* Chùa Cầu Hội An - Left side */}
      <img 
        src="/images/chua-cau.png" 
        alt="Chùa Cầu Hội An" 
        className="absolute bottom-0 left-0 h-[45%] opacity-85 z-10 pointer-events-none object-contain"
      />
      
      {/* Cầu Rồng Đà Nẵng - Right side */}
      <img 
        src="/images/cau-rong.png" 
        alt="Cầu Rồng Đà Nẵng" 
        className="absolute bottom-0 right-0 h-[45%] opacity-85 z-10 pointer-events-none object-contain"
      />
      
      {/* Decorative lanterns */}
      <img 
        src="/images/longden.png" 
        alt="Đèn lồng" 
        className="absolute top-0 left-2 w-12 md:w-16 float-animation opacity-90 z-10"
        style={{ animationDelay: "0s" }}
      />
      <img 
        src="/images/longden.png" 
        alt="Đèn lồng" 
        className="absolute top-0 right-2 w-12 md:w-16 float-animation opacity-90 z-10"
        style={{ animationDelay: "1.5s" }}
      />
      
      {/* Main content */}
      <div className="relative z-20 h-full flex flex-col px-3 py-2">
        {/* Header with logos and Year End Party */}
        <header className="flex items-center justify-between gap-2">
          {/* Left: Logo */}
          <img 
            src="/images/logo.png" 
            alt="Hội An Hoa & Organic" 
            className="h-12 md:h-16 lg:h-20 object-contain"
          />
          
          {/* Center: Year End Party - LARGE */}
          <img 
            src="/images/chu.png" 
            alt="Year End Party" 
            className="h-16 md:h-24 lg:h-32 object-contain flex-shrink-0"
          />
          
          {/* Right: Action buttons - ICON ONLY */}
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleFireworks}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-lg w-10 h-10 md:w-12 md:h-12 p-0"
                  size="icon"
                >
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pháo Hoa</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handlePrize}
                  className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white shadow-lg w-10 h-10 md:w-12 md:h-12 p-0"
                  size="icon"
                >
                  <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Nhận Giải</TooltipContent>
            </Tooltip>
            
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="bg-white/20 border-white/50 hover:bg-white/30 text-white w-10 h-10 md:w-12 md:h-12 p-0"
                    >
                      <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Reset</TooltipContent>
              </Tooltip>
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

        {/* Main Game Area */}
        <div className="flex-1 flex flex-col gap-2 mt-2 min-h-0">
          {/* Winner Board - Numbers that have been drawn */}
          <section className="flex-[2]">
            <div className="winner-board rounded-xl p-3 md:p-4 bg-gradient-to-b from-red-900/95 to-red-950/98 border-2 border-yellow-500/60 shadow-2xl h-full flex flex-col">
              <h2 className="golden-text text-lg md:text-2xl lg:text-3xl font-bold text-center mb-2" style={{ fontFamily: "var(--font-display)" }}>
                SỐ ĐÃ QUAY ({selectedNumbers.length}/60)
              </h2>
              <div className="flex-1 flex flex-wrap content-start justify-center gap-2 md:gap-3 overflow-y-auto">
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
                      className="w-11 h-11 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "linear-gradient(145deg, #ffd700 0%, #d4a574 50%, #a67c4a 100%)",
                        boxShadow: "0 0 15px rgba(255, 215, 0, 0.5), inset 0 -3px 10px rgba(0,0,0,0.3), inset 0 3px 10px rgba(255,255,255,0.3)"
                      }}
                    >
                      <span 
                        className="text-red-900 font-bold text-base md:text-xl lg:text-2xl"
                        style={{ fontFamily: "var(--font-display)", textShadow: "0 1px 2px rgba(255,255,255,0.3)" }}
                      >
                        {num}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {selectedNumbers.length === 0 && (
                  <p className="text-yellow-100/50 text-center w-full text-sm md:text-base self-center" style={{ fontFamily: "var(--font-body)" }}>
                    Bấm vào các viên bi bên dưới để chọn số
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Loto Ball Grid - 60 numbers */}
          <section className="flex-[1.2]">
            <div className="rounded-lg p-2 md:p-3 bg-black/40 backdrop-blur-sm border border-yellow-500/40 h-full">
              <div className="grid grid-cols-12 md:grid-cols-15 lg:grid-cols-20 gap-1 md:gap-1.5 h-full content-center"
                   style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
                {Array.from({ length: 60 }, (_, i) => i + 1).map((num) => {
                  const isSelected = selectedNumbers.includes(num);
                  const isFlying = flyingNumber === num;
                  
                  return (
                    <motion.button
                      key={num}
                      onClick={() => handleNumberClick(num)}
                      disabled={isSelected}
                      className={`
                        loto-ball aspect-square w-full max-w-[40px] mx-auto
                        ${isSelected ? 'selected' : ''}
                        ${isFlying ? 'fly-animation' : ''}
                      `}
                      whileHover={!isSelected ? { scale: 1.15 } : {}}
                      whileTap={!isSelected ? { scale: 0.95 } : {}}
                    >
                      <span className="loto-ball-number text-red-900 text-xs md:text-sm font-bold">
                        {num}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
