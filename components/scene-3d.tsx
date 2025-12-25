"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import gsap from "gsap"

interface ParticleSystem {
  positions: Float32Array
  velocities: Float32Array
  mesh: THREE.Points
}

export default function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<ParticleSystem[]>([])
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene Setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.Fog(0x000000, 2000, 3500)

    // Camera Setup
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000)
    camera.position.z = 100
    cameraRef.current = camera

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create Group for animations
    const group = new THREE.Group()
    scene.add(group)
    groupRef.current = group

    // Lights
    const ambientLight = new THREE.AmbientLight(0x00ffff, 0.5)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0xff00ff, 1, 500)
    pointLight1.position.set(100, 100, 100)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x00ffff, 0.8, 500)
    pointLight2.position.set(-100, -50, 100)
    scene.add(pointLight2)

    // Create Christmas Tree
    const treeGroup = new THREE.Group()
    createChristmasTree(treeGroup)
    group.add(treeGroup)

    // Create Snowflakes (Particles)
    const snowflakes = createSnowflakes(1000)
    group.add(snowflakes)

    // Create Ornaments
    createOrnaments(group, 15)

    // Create Geometric Shapes
    createGeometricShapes(group)

    // Animate components with GSAP
    gsap.to(treeGroup.rotation, {
      y: Math.PI * 2,
      duration: 20,
      repeat: -1,
      ease: "none",
    })

    gsap.to(group.position, {
      y: Math.sin(Date.now() * 0.001) * 5,
      duration: 4,
      repeat: -1,
      yoyo: true,
    })

    // Particle animation
    const particleGeometry = snowflakes.geometry as THREE.BufferGeometry
    const positions = particleGeometry.getAttribute("position") as THREE.BufferAttribute
    const velocities = new Float32Array(positions.array.length)

    for (let i = 0; i < velocities.length; i += 3) {
      velocities[i] = (Math.random() - 0.5) * 0.5
      velocities[i + 1] = Math.random() * -0.5 - 0.2
      velocities[i + 2] = (Math.random() - 0.5) * 0.5
    }

    // Handle Resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width
      const newHeight = containerRef.current?.clientHeight || height

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Update particles
      if (positions && velocities) {
        const posArray = positions.array as Float32Array
        for (let i = 0; i < posArray.length; i += 3) {
          posArray[i] += velocities[i]
          posArray[i + 1] += velocities[i + 1]
          posArray[i + 2] += velocities[i + 2]

          if (posArray[i + 1] < -200) {
            posArray[i + 1] = 200
          }
        }
        positions.needsUpdate = true
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  function createChristmasTree(parent: THREE.Group) {
    // Tree body - cone shape
    for (let i = 0; i < 4; i++) {
      const geometry = new THREE.ConeGeometry(50 - i * 10, 40, 32)
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.33, 1, 0.3),
        emissive: new THREE.Color().setHSL(0.33, 1, 0.1),
        metalness: 0.3,
        roughness: 0.4,
      })
      const cone = new THREE.Mesh(geometry, material)
      cone.position.y = -i * 35
      parent.add(cone)
    }

    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(8, 12, 60)
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      metalness: 0,
      roughness: 0.8,
    })
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
    trunk.position.y = -100
    parent.add(trunk)

    // Star on top
    const starGeometry = new THREE.IcosahedronGeometry(15, 4)
    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      metalness: 0.8,
      roughness: 0.2,
    })
    const star = new THREE.Mesh(starGeometry, starMaterial)
    star.position.y = 60
    parent.add(star)

    gsap.to(star.rotation, {
      z: Math.PI * 2,
      duration: 4,
      repeat: -1,
      ease: "none",
    })
  }

  function createSnowflakes(count: number): THREE.Points {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400
      positions[i * 3 + 1] = Math.random() * 400 - 200
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400
      sizes[i] = Math.random() * 3 + 1
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    })

    return new THREE.Points(geometry, material)
  }

  function createOrnaments(parent: THREE.Group, count: number) {
    const colors = [0xff00ff, 0x00ffff, 0xff0080, 0x00ff80, 0xffff00]

    for (let i = 0; i < count; i++) {
      const geometry = new THREE.SphereGeometry(5, 32, 32)
      const material = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        emissive: colors[i % colors.length],
        metalness: 0.7,
        roughness: 0.2,
      })
      const ornament = new THREE.Mesh(geometry, material)

      const angle = (i / count) * Math.PI * 2
      const distance = 80
      ornament.position.x = Math.cos(angle) * distance
      ornament.position.y = (Math.random() - 0.5) * 100
      ornament.position.z = Math.sin(angle) * distance

      parent.add(ornament)

      gsap.to(ornament.position, {
        y: ornament.position.y + Math.random() * 20,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
      })
    }
  }

  function createGeometricShapes(parent: THREE.Group) {
    // Floating cubes
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.BoxGeometry(20, 20, 20)
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
        emissive: new THREE.Color().setHSL(Math.random(), 1, 0.3),
        wireframe: Math.random() > 0.5,
      })
      const cube = new THREE.Mesh(geometry, material)

      cube.position.x = (Math.random() - 0.5) * 300
      cube.position.y = (Math.random() - 0.5) * 300
      cube.position.z = (Math.random() - 0.5) * 300

      parent.add(cube)

      gsap.to(cube.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        z: Math.PI * 2,
        duration: 8 + Math.random() * 4,
        repeat: -1,
        ease: "none",
      })
    }
  }

  return <div ref={containerRef} className="w-full h-screen" />
}
