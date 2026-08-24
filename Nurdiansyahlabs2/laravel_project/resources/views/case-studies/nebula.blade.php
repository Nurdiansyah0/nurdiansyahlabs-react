@extends('layouts.app')

@section('title', 'Nebula Core Architecture | Case Study')

@section('content')
<main class="pt-32 pb-20 overflow-hidden">
    <!-- Hero / Case Identity -->
    <section class="max-w-7xl mx-auto px-8 relative">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10"></div>
        <div class="space-y-6 max-w-4xl">
            <nav class="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-12">
                <a href="/portfolio" class="hover:text-primary transition-colors">Portfolio</a>
                <span class="material-symbols-outlined text-xs">chevron_right</span>
                <span class="text-on-surface">Nebula Core Architecture</span>
            </nav>
            <h1 class="text-6xl lg:text-8xl font-extrabold font-headline tracking-tighter leading-tight text-on-surface">
                Nebula Core <br/>
                <span class="text-transparent bg-clip-text bg-linear-to-r from-primary via-tertiary to-secondary">Architecture.</span>
            </h1>
            <div class="flex flex-wrap gap-4 pt-4">
                <span class="px-4 py-2 border border-primary/20 rounded-full text-primary text-[10px] font-bold uppercase tracking-widest bg-primary/5">Microservices</span>
                <span class="px-4 py-2 border border-secondary/20 rounded-full text-secondary text-[10px] font-bold uppercase tracking-widest bg-secondary/5">Go/Rust Core</span>
                <span class="px-4 py-2 border border-tertiary/20 rounded-full text-tertiary text-[10px] font-bold uppercase tracking-widest bg-tertiary/5">Global Persistence</span>
            </div>
        </div>
    </section>

    <!-- Project Context -->
    <section class="max-w-7xl mx-auto px-8 mt-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div class="lg:col-span-8 space-y-12">
            <div class="space-y-6">
                <h2 class="text-3xl font-bold font-headline text-on-surface">The Challenge</h2>
                <p class="text-on-surface-variant font-light text-xl leading-relaxed">
                    Nebula required a real-time telemetry processing engine capable of handling over 2M events per second with sub-10ms latency across 14 global regions. Existing legacy systems were bottlenecked by synchronous database writes and monolithic scaling limits.
                </p>
            </div>
            
            <div class="rounded-3xl overflow-hidden glass-panel border border-white/10 aspect-video relative group">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe4gKizmPbF9XkHGCLbyqR4IxKodmiUqVssa8Aeh2wJtYugJW4dAaYuVmIY3gpDIdWC_TMLWybm8jNp6LN8mCXexgNqWWR5MbL60PdhSGz9Pc2zxDmb30gxZSD0yPGvIVZAzgiVvaKnK1zoa5gDABlV2TzqStQuIEXnHhIax4KU066mc6bHoUXjdhhzx2wus8tV9pUEiTSXku5KlDqZ5e4qDLS03GD6ZVa6rnvILJdiIgo1slcwS21SVhNaoV5v0OprkhFgvokcWc" alt="Nebula Logic" class="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"/>
                <!-- Interactive Overlay -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="p-8 glass-panel rounded-2xl border border-primary/30 max-w-sm text-center">
                        <p class="text-primary font-bold mb-2">Live Node Sync</p>
                        <p class="text-xs text-on-surface-variant">Real-time visualization of global state propagation.</p>
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <h2 class="text-3xl font-bold font-headline text-on-surface">The Solution</h2>
                <p class="text-on-surface-variant font-light leading-relaxed">
                    We architected a distributed event-driven mesh using Go for the ingest layer and Rust for the high-computation persistence layer. By utilizing an Actor-model architecture, we achieved linear scaling across distributed clusters.
                </p>
            </div>
        </div>

        <!-- Sidebar / Stats -->
        <div class="lg:col-span-4 space-y-8">
            <div class="glass-panel p-8 rounded-3xl border border-white/10 space-y-8">
                <div>
                    <h4 class="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-4">Performance Metrics</h4>
                    <div class="space-y-6">
                        <div>
                            <div class="flex justify-between text-xs mb-2">
                                <span class="text-on-surface-variant">Throughput</span>
                                <span class="text-secondary font-bold">2.4M msg/s</span>
                            </div>
                            <div class="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                <div class="h-full bg-secondary w-[95%]"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs mb-2">
                                <span class="text-on-surface-variant">P99 Latency</span>
                                <span class="text-primary font-bold">8.2ms</span>
                            </div>
                            <div class="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                <div class="h-full bg-primary w-[98%]"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-xs mb-2">
                                <span class="text-on-surface-variant">Availability</span>
                                <span class="text-tertiary font-bold">99.999%</span>
                            </div>
                            <div class="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                <div class="h-full bg-tertiary w-[99.9%]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pt-8 border-t border-white/5">
                    <h4 class="text-[10px] font-black text-on-surface uppercase tracking-[0.25em] mb-4">Technical Stack</h4>
                    <div class="flex flex-wrap gap-2">
                        @foreach(['Golang', 'Rust', 'Kafka', 'Redis', 'Kubernetes', 'GRPC'] as $t)
                            <span class="px-3 py-1 bg-surface-container-high rounded-md text-[10px] font-bold text-on-surface-variant border border-white/5">{{ $t }}</span>
                        @endforeach
                    </div>
                </div>
            </div>

            <!-- "Live" Demo link -->
            <div class="p-8 rounded-3xl bg-linear-to-br from-indigo-900/40 to-indigo-950 border border-primary/20 flex flex-col items-center text-center space-y-4">
                <span class="material-symbols-outlined text-4xl text-primary animate-pulse">monitoring</span>
                <h4 class="text-lg font-bold text-on-surface">Explore Live Interface</h4>
                <p class="text-xs text-on-surface-variant leading-relaxed">Access the actual dashboard used to monitor global node health.</p>
                <button class="w-full py-3 bg-primary text-on-primary rounded-xl font-bold hover:scale-[1.02] transition-transform">Enter System</button>
            </div>
        </div>
    </section>

    <!-- Technical Deep Dive -->
    <section class="max-w-7xl mx-auto px-8 mt-40">
        <h2 class="text-4xl font-headline font-black text-on-surface mb-16">Technical Deep Dive</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="glass-panel p-10 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group">
                <h3 class="text-2xl font-bold mb-4 text-on-surface">Event Mesh Architecture</h3>
                <p class="text-on-surface-variant font-light mb-8">
                    We implemented a zero-trust event mesh that ensures end-to-end encryption for every packet. The ingest layer is designed for extreme concurrency, utilizing lock-free data structures to prevent race conditions during high-volume surges.
                </p>
                <div class="aspect-square bg-indigo-950/40 rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden">
                    <!-- Symbolic Diagram -->
                    <div class="absolute w-32 h-32 border border-primary/20 rounded-full animate-[ping_4s_infinite]"></div>
                    <div class="absolute w-24 h-24 border border-secondary/20 rounded-full animate-[ping_3s_infinite]"></div>
                    <span class="material-symbols-outlined text-5xl text-primary z-10">hub</span>
                </div>
            </div>
            <div class="space-y-8">
                <div class="p-8 glass-panel rounded-2xl border border-white/5">
                    <h4 class="text-lg font-bold text-on-surface mb-2">Conflict-Free Replicated Data Types</h4>
                    <p class="text-sm text-on-surface-variant font-light">CRDTs allow for seamless global persistence without the need for a central master, ensuring eventual consistency even during network partitions.</p>
                </div>
                <div class="p-8 glass-panel rounded-2xl border border-white/5">
                    <h4 class="text-lg font-bold text-on-surface mb-2">Backpressure Management</h4>
                    <p class="text-sm text-on-surface-variant font-light">Adaptive backpressure protocols protect downstream consumers from being overwhelmed, maintaining system stability under peak loads.</p>
                </div>
                <div class="p-8 glass-panel rounded-2xl border border-white/5">
                    <h4 class="text-lg font-bold text-on-surface mb-2">Isolation of Concerns</h4>
                    <p class="text-sm text-on-surface-variant font-light">By decoupling the write and read paths (CQRS), we optimized each path independently for maximum performance.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Next / Prev Project -->
    <section class="max-w-7xl mx-auto px-8 mt-40 pt-20 border-t border-white/5 flex justify-between items-center">
        <a href="/case-studies/nova" class="group text-left">
            <p class="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Previous</p>
            <h4 class="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">Nova Edge Mesh</h4>
        </a>
        <a href="/case-studies/prism" class="group text-right">
            <p class="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Next</p>
            <h4 class="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">Prism Engine</h4>
        </a>
    </section>
</main>
@endsection
