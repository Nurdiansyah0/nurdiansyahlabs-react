import { useEffect, useRef } from 'react'
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useResponsive } from '../hooks/useResponsive'

const pillars = [
    { id: 'landing', type: 'web', label: 'Landing Pages', color: '#047857', x: '15%', y: '25%', z: 50, delay: 0 },
    { id: 'fullstack', type: 'database', label: 'Fullstack Apps', color: '#1d4ed8', x: '85%', y: '25%', z: 150, delay: 0.5 },
    { id: 'data_science', type: 'ai', label: 'Data Science', color: '#6d28d9', x: '20%', y: '75%', z: 250, delay: 1.0 },
    { id: 'data_analyst', type: 'chart', label: 'Data Analytics', color: '#b45309', x: '80%', y: '80%', z: 350, delay: 1.5 }
]

export default function TechStack3D() {
    const { isMobile } = useResponsive()
    const containerRef = useRef(null)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 50, stiffness: 100, mass: 1 }
    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    // Make the camera tilt dramatic to show off the giant scale
    const rotateX = useTransform(y, [-1, 1], [15, -15])
    const rotateY = useTransform(x, [-1, 1], [-25, 25])

    useEffect(() => {
        if (isMobile) return
        const handleMouseMove = (e) => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const normalizedX = (e.clientX - centerX) / (rect.width / 2)
            const normalizedY = (e.clientY - centerY) / (rect.height / 2)
            mouseX.set(Math.max(-1, Math.min(1, normalizedX)))
            mouseY.set(Math.max(-1, Math.min(1, normalizedY)))
        }
        const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0) }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [isMobile, mouseX, mouseY])

    if (isMobile) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute', inset: 0, zIndex: 0,
                perspective: '1200px', overflow: 'hidden',
                background: '#020308', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
        >
            {/* Massive Cinematic Light radiating from center */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '200vw', height: '200vh', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 50%)'
            }} />

            {/* Global 3D World */}
            <m.div style={{
                position: 'absolute', width: '100%', height: '100%',
                transformStyle: 'preserve-3d', rotateX, rotateY
            }}>

                {/* Cyber Floor Grid - HUGE size and pronounced glow */}
                <m.div
                    style={{
                        position: 'absolute', bottom: '-200%', left: '-100%', width: '300%', height: '300%',
                        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.4) 2px, transparent 2px), linear-gradient(90deg, rgba(59, 130, 246, 0.4) 2px, transparent 2px)`,
                        backgroundSize: '150px 150px', transformOrigin: 'top center',
                        boxShadow: 'inset 0 0 400px 200px #020308'
                    }}
                    animate={{ transform: ['rotateX(82deg) translateZ(-600px) translateY(0px)', 'rotateX(82deg) translateZ(-600px) translateY(150px)'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />

                {/* Central AI Brain / Core - A giant glowing sun of data */}
                <m.div
                    style={{
                        position: 'absolute', top: '50%', left: '50%', x: '-50%', y: '-50%',
                        transformStyle: 'preserve-3d', transform: 'translateZ(0px)'
                    }}
                >
                    <m.div
                        style={{
                            width: '300px', height: '300px', borderRadius: '50%',
                            background: 'radial-gradient(circle, #ffffff, #1d4ed8 40%, transparent 70%)',
                            boxShadow: '0 0 200px 100px rgba(59, 130, 246, 0.5)',
                            mixBlendMode: 'screen', opacity: 0.9
                        }}
                        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </m.div>

                {/* 4 Massive Server Monoliths */}
                {pillars.map((pillar, idx) => (
                    <m.div
                        key={pillar.id}
                        style={{
                            position: 'absolute', top: pillar.y, left: pillar.x,
                            transformStyle: 'preserve-3d', x: '-50%', y: '-50%'
                        }}
                    >
                        {/* Energy Ground Beam continuously pushing data up */}
                        <m.div
                            style={{
                                position: 'absolute', top: '50%', left: '50%',
                                width: '6px', height: '1000px', background: `linear-gradient(to top, transparent, ${pillar.color}, transparent)`,
                                transform: 'rotateX(90deg) translateZ(0px)', opacity: 0.8,
                                filter: `drop-shadow(0 0 20px ${pillar.color})`
                            }}
                            animate={{ y: [0, -1000] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: pillar.delay }}
                        />

                        {/* Glassmorphism Monolith Container */}
                        <m.div
                            style={{
                                position: 'absolute', top: 0, left: 0,
                                transformStyle: 'preserve-3d', transform: `translateZ(${pillar.z}px)`,
                            }}
                            animate={{ y: [-30, 30, -30], rotateY: [0, -360] }}
                            transition={{
                                y: { duration: 8 + idx, repeat: Infinity, ease: 'easeInOut', delay: pillar.delay },
                                rotateY: { duration: 40 + (idx * 5), repeat: Infinity, ease: 'linear' }
                            }}
                        >
                            {/* Inner Core Light of Monolith */}
                            <div style={{
                                position: 'absolute', top: '-50px', left: '-50px',
                                width: '100px', height: '100px', background: pillar.color,
                                borderRadius: '50%', boxShadow: `0 0 100px 60px ${pillar.color}`, opacity: 0.5
                            }} />

                            {/* Tower Faces - 120x120x400 Rectangular Prism */}
                            <div style={{ ...getFaceStyle(pillar.color, 'front'), transform: 'translateZ(60px)' }} />
                            <div style={{ ...getFaceStyle(pillar.color, 'back'), transform: 'rotateY(180deg) translateZ(60px)' }} />
                            <div style={{ ...getFaceStyle(pillar.color, 'left'), transform: 'rotateY(-90deg) translateZ(60px)' }} />
                            <div style={{ ...getFaceStyle(pillar.color, 'right'), transform: 'rotateY(90deg) translateZ(60px)' }} />
                            <div style={{ ...getFaceStyle(pillar.color, 'top'), transform: 'rotateX(90deg) translateZ(200px)' }} />
                            <div style={{ ...getFaceStyle(pillar.color, 'bottom'), transform: 'rotateX(-90deg) translateZ(200px)' }} />

                            {/* Massive Floating Holographic Screen in front of Monolith */}
                            <m.div
                                style={{
                                    position: 'absolute', top: '-125px', left: '-150px',
                                    width: '300px', height: '250px',
                                    background: `rgba(0,0,0,0.85)`,
                                    border: `3px solid ${pillar.color}`,
                                    borderRadius: '16px',
                                    padding: '24px',
                                    boxShadow: `0 0 80px ${pillar.color}80, inset 0 0 40px ${pillar.color}50`,
                                    transform: 'translateZ(200px)', // Floats way out in front
                                    display: 'flex', flexDirection: 'column', gap: '16px',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: pillar.color, textTransform: 'uppercase', letterSpacing: '3px', textShadow: `0 0 10px ${pillar.color}` }}>
                                    {pillar.label}
                                </div>
                                <div style={{ height: '3px', width: '100%', background: `linear-gradient(90deg, ${pillar.color}, transparent)` }} />

                                {/* Inner Graphic Panel (Chart, Node, Web, DB) */}
                                <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>

                                    {pillar.type === 'chart' && [1, 2, 3, 4, 5, 6].map(i => (
                                        <m.div key={i} animate={{ height: [`${Math.random() * 40 + 20}%`, `${Math.random() * 80 + 20}%`, `${Math.random() * 40 + 20}%`] }} transition={{ duration: 1.5 + Math.random(), repeat: Infinity }} style={{ flex: 1, background: pillar.color, opacity: 0.9, borderRadius: '4px 4px 0 0', boxShadow: `0 0 20px ${pillar.color}` }} />
                                    ))}

                                    {pillar.type === 'web' && (
                                        <div style={{ width: '100%', height: '100%', border: `3px solid ${pillar.color}`, borderRadius: '8px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ width: '100%', height: '30px', background: pillar.color, borderRadius: '4px', opacity: 0.6, boxShadow: `0 0 10px ${pillar.color}` }} />
                                            <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                                                <div style={{ flex: 1, background: pillar.color, borderRadius: '4px', opacity: 0.4 }} />
                                                <m.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ flex: 2, background: pillar.color, borderRadius: '4px', opacity: 0.9 }} />
                                            </div>
                                        </div>
                                    )}

                                    {pillar.type === 'database' && (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                                            {[1, 2, 3, 4].map(idx => (
                                                <m.div key={idx} animate={{ x: [0, 15, 0] }} transition={{ duration: 2, delay: idx * 0.3, repeat: Infinity }} style={{ width: '100%', height: '22%', background: pillar.color, borderRadius: '8px', opacity: 1 - (idx * 0.15), borderLeft: `6px solid #fff`, boxShadow: `0 5px 15px ${pillar.color}` }} />
                                            ))}
                                        </div>
                                    )}

                                    {pillar.type === 'ai' && (
                                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                            <m.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ position: 'absolute', top: '15%', left: '15%', width: '30px', height: '30px', borderRadius: '50%', background: pillar.color, boxShadow: `0 0 30px ${pillar.color}` }} />
                                            <m.div animate={{ scale: [1, 1.6, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', top: '75%', left: '50%', width: '25px', height: '25px', borderRadius: '50%', background: pillar.color, boxShadow: `0 0 30px ${pillar.color}` }} />
                                            <m.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} style={{ position: 'absolute', top: '35%', left: '80%', width: '35px', height: '35px', borderRadius: '50%', background: pillar.color, boxShadow: `0 0 30px ${pillar.color}` }} />
                                            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
                                                <line x1="15%" y1="15%" x2="50%" y2="75%" stroke={pillar.color} strokeWidth={4} strokeDasharray="5,5" />
                                                <line x1="50%" y1="75%" x2="80%" y2="35%" stroke={pillar.color} strokeWidth={4} strokeDasharray="5,5" />
                                                <line x1="15%" y1="15%" x2="80%" y2="35%" stroke={pillar.color} strokeWidth={4} opacity="0.4" />
                                            </svg>
                                        </div>
                                    )}

                                </div>
                            </m.div>

                        </m.div>
                    </m.div>
                ))}
            </m.div>

            {/* Overlays to blend edges */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #020308 0%, transparent 40%, #020308 100%)', pointerEvents: 'none' }} />
        </div>
    )
}

const getFaceStyle = (color, type) => {
    const isTopBottom = type === 'top' || type === 'bottom';
    return {
        position: 'absolute',
        top: isTopBottom ? '-60px' : '-200px',
        left: '-60px',
        width: '120px',
        height: isTopBottom ? '120px' : '400px',
        background: `${color}1A`, // Very transparent center 
        border: `2px solid ${color}`, // Solid glowing edges
        backdropFilter: 'blur(8px)', // Glassmorphism
        boxShadow: `inset 0 0 60px ${color}80, 0 0 30px ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    };
};
