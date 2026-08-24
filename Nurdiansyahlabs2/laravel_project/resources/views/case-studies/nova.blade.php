@extends('layouts.app')

@section('title', 'Nova Edge Mesh | Infrastructure Case Study')

@section('content')
<main class="pt-32 pb-20">
    <!-- Hero -->
    <section class="max-w-7xl mx-auto px-8 relative">
        <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-tertiary/10 rounded-full blur-[120px] -z-10"></div>
        <div class="space-y-6 max-w-4xl">
            <nav class="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-12">
                <a href="/portfolio" class="hover:text-primary transition-colors">Portfolio</a>
                <span class="material-symbols-outlined text-xs">chevron_right</span>
                <span class="text-on-surface">Nova Infrastructure</span>
            </nav>
            <h1 class="text-6xl lg:text-8xl font-extrabold font-headline tracking-tighter leading-tight text-on-surface">
                Nova <br/>
                <span class="text-transparent bg-clip-text bg-linear-to-r from-tertiary via-primary to-secondary">Edge Mesh.</span>
            </h1>
            <p class="text-xl text-on-surface-variant font-light leading-relaxed max-w-2xl">
                Zero-latency global delivery. Nova is a distributed infrastructure layer that optimizes asset deployment across hundreds of edge nodes simultaneously.
            </p>
        </div>
    </section>

    <!-- Visual / Technical Visualization -->
    <section class="max-w-7xl mx-auto px-8 mt-24">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div class="lg:col-span-8 rounded-3xl overflow-hidden glass-panel border border-white/10 group bg-black">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKxEc5T0S0bqe8qgkWchN7Rg8Ub8h1hPqLrhl4R5bURsQfE7woThvq-VF2-RebWcBxdQRrP3-8QxGp4v3rIodeRFgddGxkr4rfEsF405SnfWRKSS20YxObl6R7Ty4_ozueeiymTJrh5Ke91WvzuGnEs5KX54oAJhoafN7RfDm8TLb4kRd_aBNcgXO_l3dJ55w8B42oGnfYYVfeXXW0h28-wH2yKil3DW8dPNzOP5NZXmqfyi8Ge1edqlotiY67DZPoO9dhRulY43w" alt="Nova Infrastructure Map" class="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity duration-1000"/>
                <div class="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                    <span class="material-symbols-outlined text-9xl text-tertiary/20 group-hover:text-tertiary/50 transition-colors">public</span>
                </div>
            </div>
            <div class="lg:col-span-4 space-y-8">
                <div class="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
                    <h4 class="text-sm font-bold text-on-surface uppercase tracking-widest text-tertiary">Global Distribution</h4>
                    <p class="text-xs text-on-surface-variant leading-relaxed">
                        Nova eliminates the "distance penalty" by serving static and dynamic assets from the physical node closest to the user, wherever they are on the planet.
                    </p>
                    <div class="pt-4 space-y-3">
                        <div class="flex justify-between items-center text-[10px] font-bold">
                            <span class="text-on-surface-variant">North America</span>
                            <span class="text-on-surface">12ms</span>
                        </div>
                        <div class="flex justify-between items-center text-[10px] font-bold">
                            <span class="text-on-surface-variant">Europe</span>
                            <span class="text-on-surface">18ms</span>
                        </div>
                        <div class="flex justify-between items-center text-[10px] font-bold">
                            <span class="text-on-surface-variant">Asia-Pacific</span>
                            <span class="text-on-surface">24ms</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Detailed content -->
    <section class="max-w-4xl mx-auto px-8 mt-32 space-y-12">
        <h2 class="text-4xl font-headline font-black text-on-surface">Hardened for Reliability</h2>
        <p class="text-xl text-on-surface-variant font-light leading-relaxed">
            Infrastructure is only as good as its failures aren't felt. We implemented a multi-layered failover protocol that reroutes traffic instantly if a node cluster goes offline.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="p-8 glass-panel rounded-2xl border border-white/5">
                <h4 class="text-lg font-bold text-on-surface mb-2">CI/CD Integration</h4>
                <p class="text-sm text-on-surface-variant font-light">Automated deployment pipelines that run comprehensive regression tests before any change is promoted to the edge.</p>
            </div>
            <div class="p-8 glass-panel rounded-2xl border border-white/5">
                <h4 class="text-lg font-bold text-on-surface mb-2">DDoS Protection</h4>
                <p class="text-sm text-on-surface-variant font-light">Built-in mitigation layers that scrub malicious traffic at the perimeter before it reaches the origin.</p>
            </div>
        </div>
    </section>

    <!-- Next / Prev Project -->
    <section class="max-w-7xl mx-auto px-8 mt-40 pt-20 border-t border-white/5 flex justify-between items-center">
        <a href="/case-studies/vertex" class="group text-left">
            <p class="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Previous</p>
            <h4 class="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">Vertex Indexer</h4>
        </a>
        <a href="/case-studies/nebula" class="group text-right">
            <p class="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Next</p>
            <h4 class="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">Nebula Core</h4>
        </a>
    </section>
</main>
@endsection
