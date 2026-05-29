import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CLIENT_VAULT: Record<string, { name: string; driveUrl: string }> = {
  "CODE123": { name: "Vogue Editorial", driveUrl: "https://drive.google.com/" },
  "ANURAG2026": { name: "Jack Watkins", driveUrl: "https://drive.google.com/" },
};

export function ClientVault() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [clientData, setClientData] = useState<{ name: string; driveUrl: string } | null>(null);

  const handleUnlock = () => {
    if (CLIENT_VAULT[code]) {
      setError(false);
      setClientData(CLIENT_VAULT[code]);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="w-[calc(100%-2rem)] max-w-md mx-auto rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden mt-4 md:mt-0">
      {/* Subtle gold glow effects */}
      <div className="absolute -top-24 -left-24 md:-top-32 md:-left-32 w-48 h-48 md:w-64 md:h-64 bg-[#D4AF37]/10 rounded-full blur-[60px] md:blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 md:-bottom-32 md:-right-32 w-48 h-48 md:w-64 md:h-64 bg-[#D4AF37]/10 rounded-full blur-[60px] md:blur-[80px] pointer-events-none" />
      
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!clientData ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 10 }}
              animate={error ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } } : { opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center"
            >
              {/* SVG Animated Lock Icon */}
              <motion.svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 md:w-12 md:h-12 mb-5 md:mb-6 opacity-80"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0110 0v4"></path>
              </motion.svg>

              <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 md:mb-3">Client Vault</h2>
              <p className="text-xs md:text-sm text-white/50 mb-8 md:mb-10 font-light leading-relaxed px-2">
                Enter your unique access code to retrieve your curated deliverables.
              </p>

              <div className="w-full space-y-3 md:space-y-4">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    if (error) setError(false);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  placeholder="ACCESS CODE"
                  className={`w-full bg-white/5 border ${
                    error ? 'border-red-500/50 text-red-200' : 'border-white/10 text-white'
                  } rounded-lg px-4 py-3 md:py-4 outline-none focus:border-[#D4AF37]/50 transition-colors tracking-[0.2em] text-center font-mono text-xs md:text-sm`}
                />
                
                <button
                  onClick={handleUnlock}
                  className="w-full bg-white text-black hover:bg-[#D4AF37] transition-colors duration-300 font-bold rounded-lg px-4 py-3 md:py-4 tracking-widest uppercase text-[0.6rem] md:text-[0.65rem]"
                >
                  Unlock Folder
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center text-center"
            >
              {/* Animated Unlocked Icon */}
              <motion.svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 md:w-12 md:h-12 mb-5 md:mb-6"
              >
                <motion.rect 
                  x="3" y="11" width="18" height="11" rx="2" ry="2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }}
                />
                <motion.path 
                  d="M7 11V7a5 5 0 019.9-1"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }}
                />
              </motion.svg>

              <h2 className="font-serif text-2xl md:text-3xl text-white mb-2 md:mb-3">Welcome, {clientData.name}</h2>
              <p className="text-xs md:text-sm text-white/50 mb-8 md:mb-10 font-light leading-relaxed px-2">
                Your deliverables have been successfully decrypted and are ready for review.
              </p>

              <a
                href={clientData.driveUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#D4AF37] text-black hover:bg-white transition-colors duration-300 font-bold rounded-lg px-4 py-3 md:py-4 tracking-widest uppercase text-[0.6rem] md:text-[0.65rem] inline-block"
              >
                Open Your Folder
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
