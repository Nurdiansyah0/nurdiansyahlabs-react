/**
 * RecommendationApp.jsx (Refactored to Smart Vision AI)
 * ─────────────────────────────────────────────────────────────────────────────
 * Real-time Object Detection using TensorFlow.js & COCO-SSD
 * Runs 100% Client-Side. No backend needed.
 */
import { useState, useEffect, useRef, useCallback } from 'react'

export default function SmartVisionApp() {
    const [isModelLoading, setIsModelLoading] = useState(true)
    const [isModelReady, setIsModelReady] = useState(false)
    const [isCameraActive, setIsCameraActive] = useState(false)
    const [detections, setDetections] = useState([])
    
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const modelRef = useRef(null)
    const requestRef = useRef(null)
    
    // Load TF.js and COCO-SSD from CDN
    useEffect(() => {
        const loadScript = (src) => new Promise(resolve => {
            if (document.querySelector(`script[src="${src}"]`)) return resolve()
            const s = document.createElement('script')
            s.src = src
            s.crossOrigin = "anonymous"
            s.onload = resolve
            document.head.appendChild(s)
        })

        const initModel = async () => {
            try {
                await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.20.0/dist/tf.min.js')
                await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js')
                
                // Load model
                modelRef.current = await window.cocoSsd.load()
                setIsModelLoading(false)
                setIsModelReady(true)
            } catch (err) {
                console.error("Failed to load TFJS", err)
                setIsModelLoading(false)
            }
        }
        initModel()
        
        return () => {
            stopCamera()
        }
    }, [])

    const detectFrame = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current || !modelRef.current || !isCameraActive) return
        
        const video = videoRef.current
        if (video.readyState !== 4) {
            requestRef.current = requestAnimationFrame(detectFrame)
            return
        }

        try {
            const predictions = await modelRef.current.detect(video)
            setDetections(predictions)
            
            const ctx = canvasRef.current.getContext('2d')
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            
            predictions.forEach(prediction => {
                const [x, y, width, height] = prediction.bbox
                const label = `${prediction.class.toUpperCase()} (${(prediction.score * 100).toFixed(1)}%)`
                
                // Draw Box
                ctx.strokeStyle = '#00ffcc'
                ctx.lineWidth = 3
                ctx.strokeRect(x, y, width, height)
                
                // Draw Label Background
                ctx.fillStyle = 'rgba(0, 255, 204, 0.9)'
                const textWidth = ctx.measureText(label).width
                ctx.fillRect(x, y - 24, textWidth + 16, 24)
                
                // Draw Label Text
                ctx.fillStyle = '#000000'
                ctx.font = 'bold 13px "Inter", sans-serif'
                ctx.fillText(label, x + 8, y - 7)
            })
        } catch (e) {
            console.error(e)
        }
        
        requestRef.current = requestAnimationFrame(detectFrame)
    }, [isCameraActive])

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play()
                    // Match canvas size to video size
                    canvasRef.current.width = videoRef.current.videoWidth
                    canvasRef.current.height = videoRef.current.videoHeight
                    setIsCameraActive(true)
                    requestRef.current = requestAnimationFrame(detectFrame)
                }
            }
        } catch (err) {
            alert("Camera access denied. Please allow camera permissions in your browser. " + err.message)
        }
    }

    const stopCamera = () => {
        setIsCameraActive(false)
        if (requestRef.current) cancelAnimationFrame(requestRef.current)
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(t => t.stop())
            videoRef.current.srcObject = null
        }
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d')
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        }
        setDetections([])
    }

    return (
        <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
            <style>{`
                @keyframes pulse-neon { 0%,100%{box-shadow: 0 0 10px #00ffcc, 0 0 20px #00ffcc; opacity: 1} 50%{box-shadow: 0 0 5px #00ffcc; opacity: 0.7} }
                .glass-panel { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; }
            `}</style>

            {/* ── Header ── */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '0.68rem', color: '#00ffcc', letterSpacing: '0.15em', fontWeight: 800, marginBottom: 4 }}>DATA SCIENCE / COMPUTER VISION</div>
                        <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #00ffcc, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Smart Vision AI
                        </h1>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['TensorFlow.js', 'COCO-SSD', 'WebRTC', 'Client-Side ML'].map(tag => (
                            <div key={tag} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)' }}>
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
                
                {/* ── Main Camera View ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden', minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        
                        {/* Video Layer */}
                        <video 
                            ref={videoRef} 
                            style={{ width: '100%', height: 'auto', borderRadius: '8px', display: isCameraActive ? 'block' : 'none', transform: 'scaleX(-1)' }} 
                            playsInline 
                            muted 
                        />
                        
                        {/* Canvas Layer (Overlays the video) */}
                        <canvas 
                            ref={canvasRef} 
                            style={{ position: 'absolute', top: '1rem', left: '1rem', width: 'calc(100% - 2rem)', height: 'calc(100% - 2rem)', zIndex: 10, pointerEvents: 'none', transform: 'scaleX(-1)' }}
                        />

                        {/* Offline / Loading State */}
                        {!isCameraActive && (
                            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👁️</div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>Camera Offline</h3>
                                <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Click start below to initialize real-time object detection.</p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>MODEL STATUS</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 4 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: isModelReady ? '#00ffcc' : '#f59e0b', animation: isModelLoading ? 'pulse-neon 1s infinite' : 'none' }} />
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isModelReady ? '#00ffcc' : '#f59e0b' }}>
                                    {isModelLoading ? 'Downloading Neural Network (5MB)...' : 'COCO-SSD Ready (90 Classes)'}
                                </span>
                            </div>
                        </div>

                        <button 
                            disabled={!isModelReady}
                            onClick={isCameraActive ? stopCamera : startCamera}
                            style={{
                                padding: '10px 24px', borderRadius: '8px', fontWeight: 800, cursor: isModelReady ? 'pointer' : 'not-allowed',
                                background: isCameraActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 255, 204, 0.1)',
                                color: isCameraActive ? '#ef4444' : '#00ffcc',
                                border: `1px solid ${isCameraActive ? '#ef4444' : '#00ffcc'}`,
                                transition: 'all 0.2s',
                                boxShadow: isCameraActive ? 'none' : '0 0 15px rgba(0,255,204,0.15)'
                            }}
                        >
                            {isCameraActive ? '⏹ Stop Detection' : '▶ Start Detection'}
                        </button>
                    </div>
                </div>

                {/* ── Sidebar (Analytics & Detections) ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1rem' }}>📡 LIVE TELEMETRY</div>
                        
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#00ffcc', lineHeight: 1 }}>
                            {detections.length}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4, marginBottom: '1.5rem' }}>Objects Detected in Frame</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: 300, overflowY: 'auto' }}>
                            {detections.length === 0 ? (
                                <div style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic', padding: '1rem 0', textAlign: 'center' }}>No objects in sight...</div>
                            ) : (
                                detections.map((det, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '1rem' }}>🎯</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'capitalize' }}>{det.class}</span>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: '#00ffcc', fontWeight: 800 }}>
                                            {(det.score * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '1rem' }}>🧠 HOW IT WORKS</div>
                        <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                            This application uses <strong>TensorFlow.js</strong> to run a pre-trained Deep Learning model (COCO-SSD) directly in your browser.
                            <br /><br />
                            <strong>Privacy First:</strong> The video feed never leaves your device. All matrix multiplications and bounding box predictions happen strictly using your device's CPU/GPU via WebGL.
                        </p>
                    </div>

                </div>
            </div>
            
            {/* Responsive adjustment for Mobile */}
            <style>{`
                @media (max-width: 1024px) {
                    div[style*="grid-template-columns: 1fr 320px"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    )
}
