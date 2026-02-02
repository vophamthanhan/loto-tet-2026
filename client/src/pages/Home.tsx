/**
 * Design Philosophy: "Đêm Hội Phố Cổ" - Vintage Hội An Aesthetic
 * - Warm amber glow like lantern light
 * - Deep crimson/burgundy background
 * - Golden accents and ornate borders
 * - Nostalgic, festive atmosphere
 */

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
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

export default function Home() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [flyingNumber, setFlyingNumber] = useState<number | null>(null);

  const handleNumberClick = useCallback((num: number) => {
    if (selectedNumbers.includes(num)) return;
    
    setFlyingNumber(num);
    
    setTimeout(() => {
      setSelectedNumbers(prev => [...prev, num]);
      setFlyingNumber(null);
    }, 500);
  }, [selectedNumbers]);

  const handleReset = useCallback(() => {
    setSelectedNumbers([]);
    setFlyingNumber(null);
  }, []);

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      
      {/* Decorative lanterns */}
      <img 
        src="/images/longden.png" 
        alt="Đèn lồng" 
        className="absolute top-0 left-4 w-20 md:w-28 lg:w-32 float-animation opacity-90 z-10"
        style={{ animationDelay: "0s" }}
      />
      <img 
        src="/images/longden.png" 
        alt="Đèn lồng" 
        className="absolute top-0 right-4 w-20 md:w-28 lg:w-32 float-animation opacity-90 z-10"
        style={{ animationDelay: "1.5s" }}
      />
      
      {/* Tet decoration */}
      <img 
        src="/images/tet_decoration_no_background.png" 
        alt="Trang trí Tết" 
        className="absolute bottom-0 left-0 w-64 md:w-80 lg:w-96 opacity-80 z-10 pointer-events-none"
      />
      
      {/* Main content */}
      <div className="relative z-20 container mx-auto py-4 px-4 min-h-screen flex flex-col">
        {/* Header with logos */}
        <header className="flex items-center justify-between mb-4">
          <img 
            src="/images/logo.png" 
            alt="Hội An Hoa & Organic" 
            className="h-12 md:h-16 lg:h-20 object-contain"
          />
          <img 
            src="/images/chu.png" 
            alt="Year End Party" 
            className="h-10 md:h-14 lg:h-16 object-contain"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-amber-gold/20 border-amber-gold/50 hover:bg-amber-gold/30 text-antique-cream"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-rich-burgundy border-amber-gold/50">
              <AlertDialogHeader>
                <AlertDialogTitle className="golden-text text-xl">Xác nhận Reset</AlertDialogTitle>
                <AlertDialogDescription className="text-antique-cream/80">
                  Bạn có chắc muốn reset lại trò chơi? Tất cả số đã quay sẽ bị xóa.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-amber-gold/30 text-antique-cream hover:bg-amber-gold/10">
                  Hủy
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleReset}
                  className="bg-lucky-red hover:bg-lucky-red/80 text-antique-cream"
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>

        {/* Winner Board - Numbers that have been drawn */}
        <section className="mb-6">
          <div className="winner-board rounded-xl p-4 md:p-6">
            <h2 className="golden-text text-xl md:text-2xl lg:text-3xl font-bold text-center mb-4" style={{ fontFamily: "var(--font-display)" }}>
              SỐ ĐÃ QUAY ({selectedNumbers.length}/60)
            </h2>
            <div className="min-h-[100px] md:min-h-[120px] flex flex-wrap justify-center gap-2 md:gap-3 p-2">
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
                    className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(145deg, #ffd700 0%, #d4a574 50%, #a67c4a 100%)",
                      boxShadow: "0 0 15px rgba(255, 215, 0, 0.4), inset 0 -3px 10px rgba(0,0,0,0.3), inset 0 3px 10px rgba(255,255,255,0.3)"
                    }}
                  >
                    <span 
                      className="text-deep-crimson font-bold text-sm md:text-base lg:text-lg"
                      style={{ fontFamily: "var(--font-display)", textShadow: "0 1px 2px rgba(255,255,255,0.3)" }}
                    >
                      {num}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {selectedNumbers.length === 0 && (
                <p className="text-antique-cream/50 text-center w-full py-8" style={{ fontFamily: "var(--font-body)" }}>
                  Chưa có số nào được quay. Bấm vào các viên bi bên dưới để chọn số.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Loto Ball Grid - 60 numbers */}
        <section className="flex-1">
          <div className="ornate-border rounded-xl p-4 md:p-6 bg-black/40 backdrop-blur-sm">
            <h2 className="golden-text text-lg md:text-xl lg:text-2xl font-bold text-center mb-4" style={{ fontFamily: "var(--font-display)" }}>
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
                      loto-ball w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14
                      ${isSelected ? 'selected' : ''}
                      ${isFlying ? 'fly-animation' : ''}
                    `}
                    whileHover={!isSelected ? { scale: 1.15 } : {}}
                    whileTap={!isSelected ? { scale: 0.95 } : {}}
                  >
                    <span className="loto-ball-number text-deep-crimson text-sm sm:text-base md:text-lg lg:text-xl">
                      {num}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-4 text-center">
          <p className="text-antique-cream/60 text-sm" style={{ fontFamily: "var(--font-body)" }}>
            Year End Party 2026 - Tết Nguyên Đán Bính Ngọ
          </p>
        </footer>
      </div>
    </div>
  );
}
