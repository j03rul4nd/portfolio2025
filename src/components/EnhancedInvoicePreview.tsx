"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"
import gsap from "gsap"
import { Zap, Sparkles } from "lucide-react"

interface InvoiceStep {
  title: string
  content: React.ReactNode
}

export function EnhancedInvoicePreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Three.js scene setup
  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })

    renderer.setSize(600, 600)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.position.z = 5

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1000
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Create geometric shapes
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.3, 16, 100)
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    })
    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    scene.add(torus)

    // Animation loop
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      // Animate particles
      particlesMesh.rotation.y = elapsedTime * 0.05
      particlesMesh.rotation.x = elapsedTime * 0.03

      // Animate torus
      torus.rotation.x = elapsedTime * 0.2
      torus.rotation.y = elapsedTime * 0.3
      torus.position.y = Math.sin(elapsedTime * 0.5) * 0.5

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      renderer.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      torusGeometry.dispose()
      torusMaterial.dispose()
    }
  }, [])

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            // GSAP animation for container
            gsap.from(containerRef.current, {
              y: 50,
              opacity: 0,
              duration: 1,
              ease: "power3.out",
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Step cycling with GSAP
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % invoiceSteps.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const invoiceSteps: InvoiceStep[] = [
    {
      title: "Type your prompt...",
      content: <StepInput />,
    },
    {
      title: "AI Processing...",
      content: <StepProcessing />,
    },
    {
      title: "Generating Invoice...",
      content: <StepGenerating />,
    },
    {
      title: "Ready to Send!",
      content: <StepReady />,
    },
    {
      title: "✓ Payment Received",
      content: <StepPaid />,
    },
  ]

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Three.js Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        className="relative p-8 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-black/40 to-purple-500/10 backdrop-blur-xl overflow-hidden"
      >
        {/* Animated shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-shimmer" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Zap className="w-6 h-6 text-blue-400" />
            <AnimatePresence mode="wait">
              <motion.h4
                key={currentStep}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold text-white"
              >
                {invoiceSteps[currentStep].title}
              </motion.h4>
            </AnimatePresence>
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              {invoiceSteps[currentStep].content}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <motion.p
            className="text-xs text-white/50 mt-6 text-center leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Sparkles className="inline w-3 h-3 mr-1" />
            AI-generated • Shareable link • Auto-taxes • 17 currencies
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}

// Step Components
function StepInput() {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textRef.current) {
      gsap.from(textRef.current, {
        width: 0,
        duration: 1.5,
        ease: "steps(40)",
      })
    }
  }, [])

  return (
    <motion.div
      className="bg-black/60 backdrop-blur-md rounded-lg border border-white/10 p-6"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <div className="text-sm text-blue-400 mb-2 font-medium">💬 User Input</div>
      <div
        ref={textRef}
        className="text-base font-mono text-white overflow-hidden whitespace-nowrap border-r-2 border-white"
      >
        &quot;Invoice for web design, $5k&quot;
      </div>
    </motion.div>
  )
}

function StepProcessing() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: "70%",
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })
    }
  }, [])

  return (
    <motion.div
      className="bg-black/60 backdrop-blur-md rounded-lg border border-blue-500/30 p-6"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold"
          animate={{
            boxShadow: [
              "0 0 20px rgba(96, 165, 250, 0.4)",
              "0 0 40px rgba(96, 165, 250, 0.7)",
              "0 0 20px rgba(96, 165, 250, 0.4)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          AI
        </motion.div>
        <div>
          <div className="text-sm text-blue-400 font-medium">🤖 Analyzing...</div>
          <div className="text-xs text-white/50">Parsing details • Calculating taxes • Formatting</div>
        </div>
      </div>
      <div className="h-1 bg-blue-500/20 rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ width: "0%" }}
        />
      </div>
    </motion.div>
  )
}

function StepGenerating() {
  return (
    <motion.div
      className="bg-black/70 backdrop-blur-md rounded-lg border border-white/15 p-6 shadow-2xl"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 150 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-white/50 mb-1">INVOICE</p>
          <p className="text-2xl font-bold text-white">#INV-2024-001</p>
        </div>
      </div>
      <div className="border-t border-white/10 pt-4 mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/50">Client:</span>
          <span className="font-medium text-white">Acme Corp</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Date:</span>
          <span className="text-white/80">Jan 15, 2024</span>
        </div>
      </div>
    </motion.div>
  )
}

function StepReady() {
  return (
    <motion.div
      className="bg-black/70 backdrop-blur-md rounded-lg border border-white/15 p-6 shadow-2xl"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-white/50 mb-1">INVOICE</p>
          <p className="text-2xl font-bold text-white">#INV-2024-001</p>
        </div>
      </div>
      <div className="border-t border-white/10 pt-4 mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/50">Client:</span>
          <span className="font-medium text-white">Acme Corp</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Date:</span>
          <span className="text-white/80">Jan 15, 2024</span>
        </div>
      </div>
      <motion.div
        className="border-t border-white/10 pt-4 mb-4"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/50">Web Development</span>
          <span className="text-white">$5,000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">UI/UX Design</span>
          <span className="text-white">$2,500</span>
        </div>
      </motion.div>
      <motion.div
        className="border-t border-white/10 pt-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-white">Total</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            $7,500
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

function StepPaid() {
  return (
    <motion.div
      className="bg-black/70 backdrop-blur-md rounded-lg border border-white/15 p-6 shadow-2xl"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-white/50 mb-1">INVOICE</p>
          <p className="text-2xl font-bold text-white">#INV-2024-001</p>
        </div>
        <motion.span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          Paid
        </motion.span>
      </div>
      <div className="border-t border-white/10 pt-4 mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/50">Client:</span>
          <span className="font-medium text-white">Acme Corp</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Date:</span>
          <span className="text-white/80">Jan 15, 2024</span>
        </div>
      </div>
      <div className="border-t border-white/10 pt-4 mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/50">Web Development</span>
          <span className="text-white">$5,000</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">UI/UX Design</span>
          <span className="text-white">$2,500</span>
        </div>
      </div>
      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-white">Total</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            $7,500
          </span>
        </div>
      </div>
    </motion.div>
  )
}