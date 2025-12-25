"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface GameState {
  hits: number
  misses: number
  gameActive: boolean
  elfX: number
  elfY: number
  totalAttempts: number
  gameOver: boolean
  result: "win" | "loss" | null
}

export default function ChristmasGame() {
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const elfTimeoutRef = useRef<NodeJS.Timeout>()

  const [gameState, setGameState] = useState<GameState>({
    hits: 0,
    misses: 0,
    gameActive: false,
    elfX: 50,
    elfY: 50,
    totalAttempts: 0,
    gameOver: false,
    result: null,
  })

  const [elfSize, setElfSize] = useState(60)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setElfSize(50)
      } else if (window.innerWidth < 1024) {
        setElfSize(60)
      } else {
        setElfSize(80)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Move elf to random position
  const moveElf = () => {
    if (!gameAreaRef.current) return

    const maxX = gameAreaRef.current.clientWidth
    const maxY = gameAreaRef.current.clientHeight

    const randomX = Math.random() * (maxX - elfSize)
    const randomY = Math.random() * (maxY - elfSize)

    setGameState((prev) => ({
      ...prev,
      elfX: randomX,
      elfY: randomY,
    }))
  }

  // Start game
  const startGame = () => {
    setGameState({
      hits: 0,
      misses: 0,
      gameActive: true,
      elfX: 50,
      elfY: 50,
      totalAttempts: 0,
      gameOver: false,
      result: null,
    })

    moveElf()
  }

  // Reset game
  const resetGame = () => {
    if (elfTimeoutRef.current) clearTimeout(elfTimeoutRef.current)

    setGameState({
      hits: 0,
      misses: 0,
      gameActive: false,
      elfX: 50,
      elfY: 50,
      totalAttempts: 0,
      gameOver: false,
      result: null,
    })
  }

  // Handle elf tap - HIT
  const handleElfTap = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!gameState.gameActive || gameState.gameOver) return

    const newHits = gameState.hits + 1
    const newTotal = gameState.totalAttempts + 1

    if (newTotal >= 100) {
      const finalResult = newHits > gameState.misses ? "win" : "loss"
      setGameState((prev) => ({
        ...prev,
        hits: newHits,
        totalAttempts: newTotal,
        gameActive: false,
        gameOver: true,
        result: finalResult,
      }))
      if (elfTimeoutRef.current) clearTimeout(elfTimeoutRef.current)
      return
    }

    setGameState((prev) => ({
      ...prev,
      hits: newHits,
      totalAttempts: newTotal,
    }))

    moveElf()
  }

  // Handle game area tap - MISS
  const handleAreaTap = (e: React.MouseEvent) => {
    if (!gameState.gameActive || gameState.gameOver) return

    const rect = gameAreaRef.current?.getBoundingClientRect()
    if (!rect) return

    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Check if click is on elf
    const isOnElf =
      clickX >= gameState.elfX &&
      clickX <= gameState.elfX + elfSize &&
      clickY >= gameState.elfY &&
      clickY <= gameState.elfY + elfSize

    if (isOnElf) return

    // Miss
    const newMisses = gameState.misses + 1
    const newTotal = gameState.totalAttempts + 1

    if (newTotal >= 100) {
      const finalResult = gameState.hits > newMisses ? "win" : "loss"
      setGameState((prev) => ({
        ...prev,
        misses: newMisses,
        totalAttempts: newTotal,
        gameActive: false,
        gameOver: true,
        result: finalResult,
      }))
      if (elfTimeoutRef.current) clearTimeout(elfTimeoutRef.current)
      return
    }

    setGameState((prev) => ({
      ...prev,
      misses: newMisses,
      totalAttempts: newTotal,
    }))

    moveElf()
  }

  // Move elf automatically every 400-800ms
  useEffect(() => {
    if (!gameState.gameActive || gameState.gameOver) return

    const moveInterval = () => {
      if (gameState.gameActive && !gameState.gameOver) {
        moveElf()
        elfTimeoutRef.current = setTimeout(moveInterval, Math.random() * 400 + 400)
      }
    }

    elfTimeoutRef.current = setTimeout(moveInterval, Math.random() * 400 + 400)

    return () => {
      if (elfTimeoutRef.current) clearTimeout(elfTimeoutRef.current)
    }
  }, [gameState.gameActive, gameState.gameOver])

  const remainingAttempts = 100 - gameState.totalAttempts
  const currentHits = gameState.hits
  const currentMisses = gameState.misses

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false }}
      className="w-full max-w-4xl mx-auto bg-black/50 backdrop-blur border-2 border-pink-400 rounded-xl p-4 sm:p-6 md:p-8"
    >
      {/* Instructions */}
      {!gameState.gameActive && !gameState.gameOver && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-400 mb-4">Tap the Elf!</h3>
          <p className="text-pink-300 text-xs sm:text-sm md:text-base mb-4 max-w-md mx-auto leading-relaxed">
            The elf moves around quickly! Tap it as many times as you can. You get 100 attempts total.
          </p>
          <p className="text-cyan-400 font-mono text-xs">Win if Hits &gt; Misses | Lose if Misses ≥ Hits</p>
        </motion.div>
      )}

      {/* Game Over Screen */}
      {gameState.gameOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-6"
        >
          <h3
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${
              gameState.result === "win" ? "text-green-400" : "text-red-400"
            }`}
          >
            {gameState.result === "win" ? "YOU WIN!" : "GAME OVER"}
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6">
            <div className="bg-green-400/10 rounded-lg p-2 sm:p-3 md:p-4 border border-green-400/30">
              <p className="text-green-300 text-xs uppercase mb-1">Hits</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">{currentHits}</p>
            </div>
            <div className="bg-red-400/10 rounded-lg p-2 sm:p-3 md:p-4 border border-red-400/30">
              <p className="text-red-300 text-xs uppercase mb-1">Misses</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-400">{currentMisses}</p>
            </div>
            <div className="bg-purple-400/10 rounded-lg p-2 sm:p-3 md:p-4 border border-purple-400/30">
              <p className="text-purple-300 text-xs uppercase mb-1">Total</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-400">100</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Game Area */}
      <motion.div
        ref={gameAreaRef}
        onClick={(e) => handleAreaTap(e)}
        className={`relative w-full aspect-video bg-gradient-to-b from-purple-900/30 to-black border-2 rounded-lg mb-6 cursor-crosshair overflow-hidden ${
          gameState.gameActive ? "ring-2 ring-pink-400" : "border-pink-400/50"
        }`}
      >
        {gameState.gameActive && (
          <motion.div
            animate={{ x: gameState.elfX, y: gameState.elfY }}
            transition={{ type: "tween", duration: 0.05 }}
            className="absolute"
            style={{ width: elfSize, height: elfSize }}
            onClick={(e) => handleElfTap(e)}
          >
            <Image
              src="/images/elf.jpeg"
              alt="Elf"
              width={elfSize}
              height={elfSize}
              className="w-full h-full object-cover rounded-lg cursor-pointer hover:scale-110 transition-transform drop-shadow-lg"
              draggable={false}
              priority
            />
          </motion.div>
        )}

        {/* Game Instructions Overlay */}
        {!gameState.gameActive && gameState.totalAttempts === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-pink-400/50 text-xs sm:text-sm md:text-base text-center px-4">Click below to start!</p>
          </div>
        )}

        {/* Active Game Stats */}
        {gameState.gameActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4 flex justify-between text-xs sm:text-sm gap-2"
          >
            <div className="bg-green-500/20 px-2 sm:px-3 py-1 sm:py-2 rounded border border-green-400/50 whitespace-nowrap">
              <span className="text-green-400 font-bold">{currentHits}</span>
              <span className="text-green-300 ml-1 hidden sm:inline">hits</span>
            </div>
            <div className="bg-red-500/20 px-2 sm:px-3 py-1 sm:py-2 rounded border border-red-400/50 whitespace-nowrap">
              <span className="text-red-400 font-bold">{currentMisses}</span>
              <span className="text-red-300 ml-1 hidden sm:inline">misses</span>
            </div>
            <div className="bg-cyan-500/20 px-2 sm:px-3 py-1 sm:py-2 rounded border border-cyan-400/50 whitespace-nowrap">
              <span className="text-cyan-400 font-bold">{remainingAttempts}</span>
              <span className="text-cyan-300 ml-1 hidden sm:inline">left</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Start/Reset Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={gameState.gameActive ? resetGame : startGame}
        className="w-full py-2 sm:py-3 md:py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 text-sm sm:text-base"
      >
        {gameState.gameActive ? "Stop Game" : gameState.gameOver ? "Play Again" : "Start Game"}
      </motion.button>
    </motion.div>
  )
}
