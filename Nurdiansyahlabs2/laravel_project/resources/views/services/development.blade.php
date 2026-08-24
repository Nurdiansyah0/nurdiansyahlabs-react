@extends('layouts.app')

@section('title', 'Web Development & SEO | Celestial Digital')

@section('content')
<main class="pt-32 pb-20">
    <!-- Hero -->
    <section class="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div class="lg:col-span-7 space-y-8">
            <span class="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
                Core Digital Architecture
            </span>
            <h1 class="text-5xl lg:text-7xl font-extrabold font-headline tracking-tighter leading-[1.1] text-on-surface">
                Engineering <br/>
                <span class="text-transparent bg-clip-text bg-linear-to-r from-primary via-tertiary to-secondary">Search Dominance.</span>
            </h1>
            <p class="text-lg text-on-surface-variant font-light max-w-2xl leading-relaxed">
                We don't just build websites; we engineer high-performance digital assets designed to scale. Our approach combines full-stack precision with aggressive algorithmic SEO to ensure your brand doesn't just exist—it dominates.
            </p>
            <div class="flex gap-4">
                <a href="#solutions" class="bg-primary text-on-primary px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">Explore Solutions</a>
                <a href="/contact" class="border border-outline-variant/30 text-on-surface px-8 py-4 rounded-full font-bold hover:bg-surface-container-high transition-colors">Start a Project</a>
            </div>
        </div>
        <div class="lg:col-span-5">
            <div class="glass-panel p-2 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn2PmFC1Iu-Z9d003dIm_pasW-p1kKcO_4VqtGbZE8W7D9UnbSv2pGpqI1Hx_yUYPHFYMQMIaxzRyoxQ-rcuPvM3H-ffEWSWp2vtNwkUI-eBscNfNrsmyF_HaEF9XB17W0IMScWtOf7SowA9pnK4bUwhxkKgMQuHOymDwExC_avuZ_fFPcfqj_yUgHKrRgt8N_zT6Thv8usDhusKUScVpDjBmitKAiDlGY5UPzAhpcuGNdORIwwSJ7GtryRIMZlrnrACqLwlO1i7s" alt="SEO Architecture" class="w-full h-full object-cover rounded-xl opacity-80 group-hover:scale-110 transition-transform duration-700"/>
                <div class="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent"></div>
                <div class="absolute bottom-6 left-6 right-6 p-4 glass-panel rounded-lg border border-white/5">
                    <div class="flex justify-between items-end">
                        <div>
                            <p class="text-[10px] uppercase tracking-widest text-primary font-bold">Performance Index</p>
                            <p class="text-2xl font-black text-on-surface font-headline">99/100</p>
                        </div>
                        <div class="h-8 w-24 bg-primary/20 rounded-md overflow-hidden flex items-end">
                            <div class="w-1/4 h-1/2 bg-primary mx-px"></div>
                            <div class="w-1/4 h-3/4 bg-primary mx-px"></div>
                            <div class="w-1/4 h-2/3 bg-primary mx-px"></div>
                            <div class="w-1/4 h-full bg-primary mx-px"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Detailed Solutions -->
    <section id="solutions" class="max-w-7xl mx-auto px-8 mt-32 space-y-24">
        <!-- Feature 1 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div class="space-y-6">
                <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span class="material-symbols-outlined">stack</span>
                </div>
                <h3 class="text-3xl font-bold font-headline text-on-surface">Full-Stack Precision</h3>
                <p class="text-on-surface-variant font-light leading-relaxed">
                    Utilizing modern runtimes like Next.js and robust backends in Node.js or Laravel, we build type-safe, scalable applications. Our code is optimized for TTFB (Time to First Byte) and smooth LCP (Largest Contentful Paint).
                </p>
                <ul class="space-y-3">
                    <li class="flex items-center gap-3 text-sm text-on-surface-variant">
                        <span class="material-symbols-outlined text-sm text-primary">check_circle</span>
                        Server-Side Rendering (SSR) for instant indexing.
                    </li>
                    <li class="flex items-center gap-3 text-sm text-on-surface-variant">
                        <span class="material-symbols-outlined text-sm text-primary">check_circle</span>
                        Component-driven architecture for rapid updates.
                    </li>
                    <li class="flex items-center gap-3 text-sm text-on-surface-variant">
                        <span class="material-symbols-outlined text-sm text-primary">check_circle</span>
                        Hardened security protocols.
                    </li>
                </ul>
            </div>
            <div class="glass-panel p-8 rounded-2xl border border-white/5 bg-linear-to-br from-indigo-950/20 to-transparent">
                <code class="text-xs text-secondary/70 block space-y-1">
                    <p>// Optimization Protocol v4.0</p>
                    <p>function <span class="text-primary">deployArchitecture</span>(site) {</p>
                    <p class="ml-4">site.optimize(<span class="text-tertiary">'core-vitals'</span>);</p>
                    <p class="ml-4">site.inject(<span class="text-tertiary">'semantic-schema'</span>);</p>
                    <p class="ml-4">return site.launch({ region: <span class="text-tertiary">'global'</span> });</p>
                    <p>}</p>
                </code>
            </div>
        </div>

        <!-- Feature 2 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
            <div class="order-2 md:order-1 glass-panel p-8 rounded-2xl border border-white/5 bg-linear-to-bl from-indigo-950/20 to-transparent">
                <div class="flex flex-col gap-4">
                    <div class="flex justify-between items-center p-3 rounded-lg bg-surface-container-high border border-white/5">
                        <span class="text-xs font-bold text-on-surface">Search visibility</span>
                        <span class="text-xs text-primary">+340%</span>
                    </div>
                    <div class="flex justify-between items-center p-3 rounded-lg bg-surface-container-high border border-white/5">
                        <span class="text-xs font-bold text-on-surface">Keyword rankings</span>
                        <span class="text-xs text-primary">Top 3 Avg</span>
                    </div>
                    <div class="flex justify-between items-center p-3 rounded-lg bg-surface-container-high border border-white/5">
                        <span class="text-xs font-bold text-on-surface">Organic conversion</span>
                        <span class="text-xs text-primary">+125%</span>
                    </div>
                </div>
            </div>
            <div class="order-1 md:order-2 space-y-6">
                <div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <span class="material-symbols-outlined">search_insights</span>
                </div>
                <h3 class="text-3xl font-bold font-headline text-on-surface">Algorithmic SEO</h3>
                <p class="text-on-surface-variant font-light leading-relaxed">
                    We align your content with Search Generative Experience (SGE). Our systems automatically generate structured data, manage internal linking paths, and optimize assets for lightning-fast retrieval by search crawlers.
                </p>
            </div>
        </div>
    </section>

    <!-- Service Modules -->
    <section class="max-w-7xl mx-auto px-8 mt-40">
        <div class="text-center mb-16 space-y-4">
            <h2 class="text-4xl font-headline font-black text-on-surface">Professional Service Modules</h2>
            <p class="text-on-surface-variant max-w-xl mx-auto">Tailored engineering for every stage of your digital journey.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-8 glass-panel rounded-2xl border border-white/5 hover:border-primary/30 transition-colors group">
                <h4 class="text-xl font-bold text-on-surface mb-2">Custom Web Apps</h4>
                <p class="text-sm text-on-surface-variant font-light mb-6">Complex SaaS platforms, internal tools, and client-facing portals built to your exact specifications.</p>
                <div class="h-1 w-0 group-hover:w-full bg-primary transition-all duration-500"></div>
            </div>
            <div class="p-8 glass-panel rounded-2xl border border-white/5 hover:border-primary/30 transition-colors group">
                <h4 class="text-xl font-bold text-on-surface mb-2">E-Commerce Engines</h4>
                <p class="text-sm text-on-surface-variant font-light mb-6">High-conversion storefronts integrated with headless CMS and secure payment gateways.</p>
                <div class="h-1 w-0 group-hover:w-full bg-primary transition-all duration-500"></div>
            </div>
            <div class="p-8 glass-panel rounded-2xl border border-white/5 hover:border-primary/30 transition-colors group">
                <h4 class="text-xl font-bold text-on-surface mb-2">SEO Audits & Strategy</h4>
                <p class="text-sm text-on-surface-variant font-light mb-6">Comprehensive technical audits and keyword strategies to recover and dominate search traffic.</p>
                <div class="h-1 w-0 group-hover:w-full bg-primary transition-all duration-500"></div>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="max-w-5xl mx-auto px-8 mt-40">
        <div class="bg-linear-to-r from-primary to-primary-container rounded-3xl p-12 text-center text-on-primary">
            <h2 class="text-3xl md:text-5xl font-black font-headline mb-6">Ready for Technical Dominance?</h2>
            <p class="text-on-primary/80 mb-10 max-w-2xl mx-auto">Join the ranks of high-performance brands architected by Celestial Digital.</p>
            <a href="/contact" class="inline-block bg-background text-primary px-10 py-5 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform">Get Started Today</a>
        </div>
    </section>
</main>
@endsection
