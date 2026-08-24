@extends('layouts.app')

@section('title', 'Prism Engine | High-Fidelity Web Design Case Study')

@section('content')
<main class="pt-32 pb-20">
    <!-- Hero -->
    <section class="max-w-7xl mx-auto px-8">
        <div class="space-y-6 max-w-4xl">
            <nav class="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-12">
                <a href="/portfolio" class="hover:text-primary transition-colors">Portfolio</a>
                <span class="material-symbols-outlined text-xs">chevron_right</span>
                <span class="text-on-surface">Prism Engine Showcase</span>
            </nav>
            <h1 class="text-6xl lg:text-8xl font-extrabold font-headline tracking-tighter leading-tight text-on-surface">
                Prism <br/>
                <span class="text-transparent bg-clip-text bg-linear-to-r from-tertiary via-secondary to-primary">Engine.</span>
            </h1>
            <p class="text-xl text-on-surface-variant font-light leading-relaxed max-w-2xl">
                Redefining the boundaries of web fidelity. Prism is a proprietary design system and rendering engine that delivers cinematic experiences directly in the browser.
            </p>
        </div>
    </section>

    <!-- Visual Showcase -->
    <section class="max-w-7xl mx-auto px-8 mt-24">
        <div class="relative group cursor-crosshair">
            <div class="glass-panel p-1 rounded-3xl border border-white/10 shadow-[0_0_80px_0_rgba(200,80,192,0.1)] overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ2ZYd4uks63lXs5pYq7Z9mWnOJDIyV0cx4yBNsQKPogRcD4koW2UcnF9-CxHJUSQfvsPUDAQgTCwf1Dbk-9zt_MKXwc1Vfx1kNvcLB31uCceJa3mKc-IU-WDE0LPbh-1ghuY8F6vv17bKSC5yHVC0iU8TlBbyA4w7FRm0cgqQ06lLSlIcnLE2yS3ImpDghMK2CU4x-u_GdADEkiEyui6xRgi8jThSRAFkQdKQ9B9YlysBYCF2uZpg2CP2p_a3IT-U3xGFbCPK5jA" alt="Prism Engine Interface" class="w-full object-cover transition-transform duration-1000 group-hover:scale-[1.02] rounded-2xl"/>
            </div>
            <!-- Floating Data Points -->
            <div class="absolute top-12 left-12 p-6 glass-panel rounded-2xl border border-white/20 backdrop-blur-3xl space-y-2 pointer-events-none group-hover:translate-x-4 transition-transform duration-500">
                <p class="text-[10px] uppercase tracking-widest text-on-surface-variant font-black">Fidelity Score</p>
                <p class="text-3xl font-black text-on-surface">99.8%</p>
            </div>
        </div>
    </section>

    <!-- Case Details -->
    <section class="max-w-7xl mx-auto px-8 mt-32 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div class="lg:col-span-7 space-y-12">
            <div class="space-y-6">
                <h2 class="text-3xl font-bold font-headline text-on-surface">Conceptual Core</h2>
                <p class="text-on-surface-variant font-light text-lg leading-relaxed">
                    Most web experiences are constrained by standard box-model thinking. With Prism, we wanted to break the grid. We developed a custom shader-based layout engine that allows for non-linear transitions and dynamic lighting effects that respond to scroll velocity and cursor proximity.
                </p>
            </div>
            <div class="space-y-6">
                <h2 class="text-3xl font-bold font-headline text-on-surface">Aesthetically Driven Performance</h2>
                <p class="text-on-surface-variant font-light text-lg leading-relaxed">
                    Visual complexity usually comes at a performance cost. Through aggressive asset-pipelining and off-thread execution of visual logic via Web Workers, we maintained a consistent 60FPS even with complex glassmorphism and real-time reflections.
                </p>
            </div>
        </div>
        <div class="lg:col-span-5">
            <div class="glass-panel p-10 rounded-3xl border border-white/10 space-y-8 bg-linear-to-b from-surface/50 to-transparent">
                <h4 class="text-sm font-bold text-on-surface uppercase tracking-widest border-b border-white/5 pb-4">Key Features</h4>
                <div class="space-y-6">
                    <div class="flex gap-4">
                        <span class="material-symbols-outlined text-tertiary">blur_on</span>
                        <div>
                            <p class="text-on-surface font-bold">Dynamic Occlusion</p>
                            <p class="text-xs text-on-surface-variant">Real-time depth calculation for layered glass elements.</p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <span class="material-symbols-outlined text-tertiary">motion_sensor_active</span>
                        <div>
                            <p class="text-on-surface font-bold">Kinetic Typography</p>
                            <p class="text-xs text-on-surface-variant">Text elements that warp and flow based on user interaction speeds.</p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <span class="material-symbols-outlined text-tertiary">palette</span>
                        <div>
                            <p class="text-on-surface font-bold">Spectral Theming</p>
                            <p class="text-xs text-on-surface-variant">Automated color harmony generation based on current page context.</p>
                        </div>
                    </div>
                </div>
                <div class="pt-8 flex flex-col items-center">
                    <button class="w-full py-4 rounded-xl bg-tertiary text-on-tertiary font-bold hover:shadow-[0_0_30px_rgba(200,80,192,0.3)] transition-all">Launch Live Preview</button>
                    <p class="text-[10px] text-on-surface-variant mt-4 font-label">Optimized for high-refresh rate displays.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Next / Prev Project -->
    <section class="max-w-7xl mx-auto px-8 mt-40 pt-20 border-t border-white/5 flex justify-between items-center">
        <a href="/case-studies/nebula" class="group text-left">
            <p class="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Previous</p>
            <h4 class="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">Nebula Core</h4>
        </a>
        <a href="/case-studies/vertex" class="group text-right">
            <p class="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Next</p>
            <h4 class="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">Vertex Indexer</h4>
        </a>
    </section>
</main>
@endsection
