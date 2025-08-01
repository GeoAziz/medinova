

"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Cinematic Preloader: iris scan + boot-up text
export default function SplashPreloader({ onFinish }: { onFinish: () => void }) {
  const [show, setShow] = useState(true);
  const [bootText, setBootText] = useState('');
  const bootSequence = [
    'Initializing Zizo_MediVerse...',
    'Authenticating User...',
    'Loading Neural Interface...',
    'SCANNING IDENTITY...'
  ];

  useEffect(() => {
    let idx = 0;
    let textIdx = 0;
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    function typeNext() {
      if (idx >= bootSequence.length) return;
      setBootText('');
      textIdx = 0;
      interval = setInterval(() => {
        setBootText((prev) => prev + bootSequence[idx][textIdx]);
        textIdx++;
        if (textIdx >= bootSequence[idx].length) {
          clearInterval(interval);
          timeout = setTimeout(() => {
            idx++;
            if (idx < bootSequence.length) {
              typeNext();
            } else {
              setTimeout(() => {
                setShow(false);
                setTimeout(onFinish, 600);
              }, 600);
            }
          }, 600);
        }
      }, 24);
    }
    typeNext();
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Iris scan animation */}
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
          >
            <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center animate-pulse-glow bg-gradient-to-br from-primary/30 to-accent/20">
              <div className="w-16 h-16 rounded-full bg-primary/80 animate-pulse" />
            </div>
            <div className="mt-6 text-lg font-mono text-primary-foreground/80 tracking-widest animate-fade-in-up">
              <span>{bootText}<span className="animate-pulse">_</span></span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
