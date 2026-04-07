'use client';

import { motion } from 'framer-motion';
import { birthdayMessages } from '@/data/messages';

export function BirthdayMessages() {
  return (
    <div className="space-y-10 max-w-2xl mx-auto py-8">
      {birthdayMessages.map((msg, i) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12, duration: 0.6 }}
          className="relative group"
        >
          {/* Gold accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.12 + 0.2, duration: 0.6 }}
            className="h-px mb-6 origin-left"
            style={{
              background: 'linear-gradient(90deg, rgba(212,175,55,0.3), rgba(212,175,55,0.05))',
            }}
          />

          <div className="flex gap-6 items-start">
            {/* Number with gold */}
            <div className="flex-shrink-0 w-8 text-right">
              <p
                className="font-mono text-xs font-bold"
                style={{ color: 'rgba(212,175,55,0.7)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </p>
            </div>

            <div className="space-y-3 flex-1">
              {/* Quote mark */}
              <span className="font-serif text-3xl leading-none block -mb-2" style={{ color: 'rgba(212,175,55,0.35)' }}>
                &ldquo;
              </span>

              <p className="font-serif text-lg sm:text-xl text-white/80 leading-relaxed tracking-wide">
                {msg.message}
              </p>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-5 h-px" style={{ backgroundColor: 'rgba(212,175,55,0.25)' }} />
                <p className="font-sans text-[11px] tracking-[0.2em] uppercase" style={{ color: 'rgba(212,175,55,0.7)' }}>
                  {msg.from}
                </p>
                {msg.relationship && (
                  <>
                    <span className="text-white/30 text-[8px]">·</span>
                    <p className="font-sans text-[10px] text-white/50 tracking-wider">
                      {msg.relationship}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Final flourish */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: birthdayMessages.length * 0.12 + 0.5 }}
        className="text-center pt-6"
      >
        <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.3))', color: '#d4af37' }}>♛</span>
      </motion.div>
    </div>
  );
}
