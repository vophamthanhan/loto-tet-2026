/**
 * Design Philosophy: "Đêm Hội Phố Cổ" - Vintage Hội An Aesthetic
 * Updated: Nền đỏ tươi, Chùa Cầu Hội An (trái), Cầu Rồng Đà Nẵng (phải)
 * Thêm: Nút Chúc Mừng, Âm thanh khi bấm số
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, PartyPopper } from "lucide-react";
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

  const playCelebrationSound = useCallback(() => {
    const ctx = getAudioContext();
    
    // Play a celebratory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.15);
      oscillator.type = 'triangle';
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + index * 0.15);
      gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + index * 0.15 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.15 + 0.4);
      
      oscillator.start(ctx.currentTime + index * 0.15);
      oscillator.stop(ctx.currentTime + index * 0.15 + 0.4);
    });
  }, [getAudioContext]);

  return { playClickSound, playCelebrationSound };
};

// Confetti component
const Confetti = ({ show }: { show: boolean }) => {
  if (!show) return null;
  
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF69B4', '#FFA500', '#00FF00'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: Math.random() * 720 - 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [flyingNumber, setFlyingNumber] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { playClickSound, playCelebrationSound } = useSound();

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
    setShowConfetti(false);
  }, []);

  const handleCelebration = useCallback(() => {
    playCelebrationSound();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  }, [playCelebrationSound]);

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
      {/* Confetti effect */}
      <Confetti show={showConfetti} />
      
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      
      {/* Chùa Cầu Hội An - Left side */}
      <img 
        src="/images/chua-cau.png" 
        alt="Chùa Cầu Hội An" 
        className="absolute bottom-0 left-0 w-48 md:w-64 lg:w-80 opacity-90 z-10 pointer-events-none"
      />
      
      {/* Cầu Rồng Đà Nẵng - Right side */}
      <img 
        src="/images/cau-rong.png" 
        alt="Cầu Rồng Đà Nẵng" 
        className="absolute bottom-0 right-0 w-48 md:w-64 lg:w-80 opacity-90 z-10 pointer-events-none"
      />
      
      {/* Decorative lanterns */}
      <img 
        src="/images/longden.png" 
        alt="Đèn lồng" 
        className="absolute top-0 left-4 w-16 md:w-24 lg:w-28 float-animation opacity-90 z-10"
        style={{ animationDelay: "0s" }}
      />
      <img 
        src="/images/longden.png" 
        alt="Đèn lồng" 
        className="absolute top-0 right-4 w-16 md:w-24 lg:w-28 float-animation opacity-90 z-10"
        style={{ animationDelay: "1.5s" }}
      />
      
      {/* Main content */}
      <div className="relative z-20 container mx-auto py-4 px-4 min-h-screen flex flex-col">
        {/* Header with logos */}
        <header className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <img 
            src="/images/logo.png" 
            alt="Hội An Hoa & Organic" 
            className="h-10 md:h-14 lg:h-16 object-contain"
          />
          <img 
            src="/images/chu.png" 
            alt="Year End Party" 
            className="h-8 md:h-12 lg:h-14 object-contain"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleCelebration}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold shadow-lg"
              size="sm"
            >
              <PartyPopper className="w-4 h-4 mr-2" />
              Chúc Mừng!
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/20 border-white/50 hover:bg-white/30 text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
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

        {/* Winner Board - Numbers that have been drawn */}
        <section className="mb-4">
          <div className="winner-board rounded-xl p-3 md:p-5 bg-gradient-to-b from-red-900/95 to-red-950/98 border-2 border-yellow-500/60 shadow-2xl">
            <h2 className="golden-text text-lg md:text-2xl lg:text-3xl font-bold text-center mb-3" style={{ fontFamily: "var(--font-display)" }}>
              SỐ ĐÃ QUAY ({selectedNumbers.length}/60)
            </h2>
            <div className="min-h-[80px] md:min-h-[100px] flex flex-wrap justify-center gap-2 md:gap-3 p-2">
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
                    className="w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, #ffd700 0%, #d4a574 50%, #a67c4a 100%)",
                      boxShadow: "0 0 15px rgba(255, 215, 0, 0.5), inset 0 -3px 10px rgba(0,0,0,0.3), inset 0 3px 10px rgba(255,255,255,0.3)"
                    }}
                  >
                    <span 
                      className="text-red-900 font-bold text-sm md:text-base lg:text-lg"
                      style={{ fontFamily: "var(--font-display)", textShadow: "0 1px 2px rgba(255,255,255,0.3)" }}
                    >
                      {num}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {selectedNumbers.length === 0 && (
                <p className="text-yellow-100/60 text-center w-full py-6 text-sm md:text-base" style={{ fontFamily: "var(--font-body)" }}>
                  Chưa có số nào được quay. Bấm vào các viên bi bên dưới để chọn số.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Loto Ball Grid - 60 numbers */}
        <section className="flex-1">
          <div className="rounded-xl p-3 md:p-5 bg-black/30 backdrop-blur-sm border-2 border-yellow-500/40">
            <h2 className="golden-text text-base md:text-xl lg:text-2xl font-bold text-center mb-3" style={{ fontFamily: "var(--font-display)" }}>
              BẢNG SỐ LÔ TÔ
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 md:gap-3 justify-items-center">
              {Array.from({ length: 60 }, (_, i) => i + 1).map((num) => {
                const isSelected = selectedNumbers.includes(num);
                const isFlying = flyingNumber === num;
                
                return (
                  <motion.button
                    key={num}
                    onClick={() => handleNumberClick(num)}
                    disabled={isSelected}
                    className={`
                      loto-ball w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12
                      ${isSelected ? 'selected' : ''}
                      ${isFlying ? 'fly-animation' : ''}
                    `}
                    whileHover={!isSelected ? { scale: 1.15 } : {}}
                    whileTap={!isSelected ? { scale: 0.95 } : {}}
                  >
                    <span className="loto-ball-number text-red-900 text-xs sm:text-sm md:text-base lg:text-lg">
                      {num}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-3 text-center">
          <p className="text-yellow-100/70 text-xs md:text-sm" style={{ fontFamily: "var(--font-body)" }}>
            Year End Party 2026 - Tết Nguyên Đán Bính Ngọ 🧧
          </p>
        </footer>
      </div>
    </div>
  );
}
