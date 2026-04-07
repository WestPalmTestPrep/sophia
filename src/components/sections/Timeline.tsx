'use client';

import { motion } from 'framer-motion';
import { timelineEvents } from '@/data/timeline';

export function Timeline() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Vertical timeline */}
      <div className="relative">
        {/* Center line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-8 sm:left-12 top-0 bottom-0 w-px bg-white/[0.06] origin-top"
        />

        <div className="space-y-12 sm:space-y-16">
          {timelineEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
              className="relative flex gap-6 sm:gap-10 items-start"
            >
              {/* Year */}
              <div className="flex-shrink-0 w-8 sm:w-12 text-right">
                <p className="font-mono text-[10px] sm:text-xs text-white/15">
                  {event.year}
                </p>
              </div>

              {/* Node */}
              <div className="relative flex-shrink-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 300 }}
                  className={`w-2 h-2 rounded-full mt-1.5 ${
                    event.category === 'achievement'
                      ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                      : event.category === 'career'
                      ? 'bg-white/60'
                      : 'bg-white/25 border border-white/20'
                  }`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <h3 className="font-serif text-base sm:text-lg text-white/75 tracking-wider">
                  {event.title}
                </h3>
                <p className="font-sans text-[11px] sm:text-xs text-white/25 mt-1.5 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
