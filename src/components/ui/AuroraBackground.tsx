'use client';

import { motion } from 'framer-motion';

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Blob 1 - warm gold */}
      <motion.div
        className="absolute w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.8) 0%, rgba(212,175,55,0) 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: ['-10%', '30%', '10%', '50%', '-10%'],
          y: ['10%', '40%', '60%', '20%', '10%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Blob 2 - cool amber */}
      <motion.div
        className="absolute w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] rounded-full opacity-[0.025]"
        style={{
          background: 'radial-gradient(circle, rgba(255,140,50,0.6) 0%, rgba(255,140,50,0) 70%)',
          filter: 'blur(100px)',
          right: '0',
        }}
        animate={{
          x: ['20%', '-30%', '10%', '-20%', '20%'],
          y: ['60%', '20%', '40%', '70%', '60%'],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Blob 3 - subtle purple */}
      <motion.div
        className="absolute w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] rounded-full opacity-[0.02]"
        style={{
          background: 'radial-gradient(circle, rgba(150,100,255,0.5) 0%, rgba(150,100,255,0) 70%)',
          filter: 'blur(90px)',
          bottom: '0',
          left: '30%',
        }}
        animate={{
          x: ['0%', '40%', '-20%', '30%', '0%'],
          y: ['-20%', '-50%', '-30%', '-60%', '-20%'],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
