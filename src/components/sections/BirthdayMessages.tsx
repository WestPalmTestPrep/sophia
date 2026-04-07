'use client';

import { motion } from 'framer-motion';
import { birthdayMessages } from '@/data/messages';

export function BirthdayMessages() {
  return (
    <div className="space-y-12 max-w-2xl mx-auto py-8">
      {birthdayMessages.map((msg, i) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.15, duration: 0.8 }}
          className="relative"
        >
          {/* Move number */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.15 + 0.2, duration: 0.6 }}
            className="h-px bg-white/[0.06] mb-6 origin-left"
          />

          <div className="flex gap-6 items-start">
            {/* Number */}
            <p className="font-mono text-[10px] text-white/10 mt-1 flex-shrink-0 w-6 text-right">
              {String(i + 1).padStart(2, '0')}
            </p>

            <div className="space-y-3 flex-1">
              <p className="font-serif text-lg sm:text-xl text-white/70 leading-relaxed tracking-wide">
                {msg.message}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-4 h-px bg-white/10" />
                <p className="font-sans text-[10px] text-white/25 tracking-[0.3em] uppercase">
                  {msg.from}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Final line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: birthdayMessages.length * 0.15 + 0.5, duration: 0.8 }}
        className="h-px bg-white/[0.04] origin-left"
      />
    </div>
  );
}
