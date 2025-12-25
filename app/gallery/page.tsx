"use client"

import { motion } from "framer-motion"
import { ImageCarousel } from "@/components/image-carousel"

export default function GalleryPage() {
  const images = ["/images/ch1.avif", "/images/ch2.avif"]

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
          Holiday Gallery
        </h1>

        <p className="text-center text-cyan-300/80 mb-12 text-lg">Experience the magic of festive moments</p>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-4xl mb-16"
        >
          <div className="aspect-video rounded-2xl overflow-hidden border border-cyan-500/50 shadow-2xl shadow-cyan-500/20">
            <ImageCarousel images={images} autoPlay={true} interval={4000} />
          </div>
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {images.map((image, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
              className="relative group overflow-hidden rounded-xl border border-purple-500/50 hover:border-cyan-400/50 transition-colors"
            >
              <motion.img
                src={image}
                alt={`Gallery image ${idx + 1}`}
                className="w-full h-80 object-cover"
                whileHover={{ scale: 1.05 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white font-semibold">Festive Moment #{idx + 1}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  )
}
