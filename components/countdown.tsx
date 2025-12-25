"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Nigerian Time (UTC+1)
      const nigeriaTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" }))

      // Target: January 1, 2026 00:00:00 Nigerian Time
      const target = new Date(new Date("2026-01-01").toLocaleString("en-US", { timeZone: "Africa/Lagos" }))

      const difference = target.getTime() - nigeriaTime.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const TimeUnit = ({
    value,
    label,
    index,
  }: {
    value: number
    label: string
    index: number
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg border-2 border-cyan-400 bg-black/50 backdrop-blur flex items-center justify-center">
          <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-cyan-400 font-mono">
            {String(value).padStart(2, "0")}
          </span>
        </div>
        <div className="absolute inset-0 rounded-lg bg-cyan-400/10 blur-lg pointer-events-none" />
      </motion.div>
      <p className="mt-3 text-cyan-300 text-xs sm:text-sm md:text-base uppercase tracking-widest">{label}</p>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 justify-center w-full"
    >
      <TimeUnit value={timeLeft.days} label="Days" index={0} />
      <TimeUnit value={timeLeft.hours} label="Hours" index={1} />
      <TimeUnit value={timeLeft.minutes} label="Minutes" index={2} />
      <TimeUnit value={timeLeft.seconds} label="Seconds" index={3} />
    </motion.div>
  )
}
