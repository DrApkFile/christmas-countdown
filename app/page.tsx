"use client"

import { Suspense, useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import Countdown from "@/components/countdown"
import ChristmasGame from "@/components/christmas-game"

const Scene3D = dynamic(() => import("@/components/scene-3d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="text-cyan-400 text-2xl animate-pulse">Loading experience...</div>
    </div>
  ),
})

export default function Home() {
  const [showGame, setShowGame] = useState(false)

  return (
    <main className="w-full bg-black overflow-x-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* 3D Scene Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <Suspense
          fallback={
            <div className="w-full h-screen flex items-center justify-center">
              <div className="text-cyan-400 text-xl animate-pulse">Initializing...</div>
            </div>
          }
        >
          <Scene3D />
        </Suspense>

        {/* Overlay Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-4"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          >
            CHRISTMAS 2025
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-base sm:text-lg md:text-2xl text-cyan-300 text-center max-w-2xl mb-8"
          >
            Countdown to New Year 2026
          </motion.p>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute bottom-8 text-cyan-400"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="relative z-10 text-center w-full max-w-4xl"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-400 mb-12 text-balance">
            Time Until 2026
          </h2>
          <Countdown />
        </motion.div>
      </section>

      {/* Festive Images Gallery Section */}
      <section className="relative w-full min-h-auto flex flex-col items-center justify-center py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-900/20 to-black pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="relative z-10 text-center w-full max-w-6xl"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-400 mb-12 text-balance">
            Festive Moments
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Image 1 - Christmas Flat Lay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: false }}
              className="relative group overflow-hidden rounded-lg shadow-2xl"
            >
              <img
                src="/images/jeshoots-com-7voyz0-io0o-unsplash.jpg"
                alt="Christmas decorations with candy canes and ornaments"
                className="w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <p className="text-cyan-300 font-semibold">Festive Decorations</p>
              </div>
            </motion.div>

            {/* Image 2 - Christmas Scene 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: false }}
              className="relative group overflow-hidden rounded-lg shadow-2xl"
            >
              <img
                src="/images/ch1.avif"
                alt="Christmas scene one"
                className="w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <p className="text-pink-300 font-semibold">Holiday Magic</p>
              </div>
            </motion.div>

            {/* Image 3 - Christmas Scene 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: false }}
              className="relative group overflow-hidden rounded-lg shadow-2xl"
            >
              <img
                src="/images/ch2.avif"
                alt="Christmas scene two"
                className="w-full h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <p className="text-purple-300 font-semibold">Winter Wonderland</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Game Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-pink-900/20 to-black pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="relative z-10 w-full max-w-4xl"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-400 mb-12 text-center text-balance">
            Tap The Elf Game
          </h2>
          <ChristmasGame />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative w-full py-12 px-4 text-center border-t border-cyan-400/30">
        <div className="relative z-10">
          <p className="text-cyan-300 text-sm md:text-base">
            Merry Christmas! Celebrating the season with 3D magic and games
          </p>
          <p className="text-cyan-400 font-mono text-xs mt-2">Nigerian Time (WAT)</p>
        </div>
      </footer>
    </main>
  )
}
