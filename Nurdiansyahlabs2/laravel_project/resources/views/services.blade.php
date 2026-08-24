@extends('layouts.app')

@section('title', 'Precision Engineered Solutions | Celestial Digital')

@section('content')
<main class="pt-20">
    <!-- Hero Section -->
    <section class="relative py-24 overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-7 z-10">
                <span class="inline-block py-1 px-3 mb-6 rounded-full bg-secondary-container/20 text-secondary font-label text-xs font-bold uppercase tracking-widest border border-secondary/20">
                    Technical Sophistication
                </span>
                <h1 class="text-5xl md:text-7xl font-headline font-extrabold text-on-surface text-tight leading-[1.1] mb-8">
                    Precision Engineered <span class="text-transparent bg-clip-text bg-linear-to-r from-primary via-tertiary to-secondary italic">Digital Identity</span>
                </h1>
                <p class="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-2xl mb-10">
                    We blend full-stack architectural integrity with aggressive SEO-driven performance. Our systems are not just built; they are engineered for dominance.
                </p>
                <div class="flex flex-wrap gap-4">
                    <button class="bg-linear-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-3xl font-headline font-bold text-md shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
                        Explore Technical Core
                    </button>
                    <button class="border border-outline-variant/20 text-on-surface px-8 py-4 rounded-3xl font-headline font-bold text-md hover:bg-surface-container-high transition-colors">
                        View Case Studies
                    </button>
                </div>
            </div>
            <div class="lg:col-span-5 relative">
                <div class="aspect-square rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
                    <img class="w-full h-full object-cover opacity-80" alt="Modern server room architecture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn2PmFC1Iu-Z9d003dIm_pasW-p1kKcO_4VqtGbZE8W7D9UnbSv2pGpqI1Hx_yUYPHFYMQMIaxzRyoxQ-rcuPvM3H-ffEWSWp2vtNwkUI-eBscNfNrsmyF_HaEF9XB17W0IMScWtOf7SowA9pnK4bUwhxkKgMQuHOymDwExC_avuZ_fFPcfqj_yUgHKrRgt8N_zT6Thv8usDhusKUScVpDjBmitKAiDlGY5UPzAhpcuGNdORIwwSJ7GtryRIMZlrnrACqLwlO1i7s"/>
                </div>
                <!-- Asymmetrical floating element -->
                <div class="absolute -bottom-6 -left-12 p-8 glass-panel rounded-xl shadow-2xl max-w-xs border border-white/10 hidden md:block">
                    <div class="flex items-center gap-3 mb-2">
                        <span class="material-symbols-outlined text-primary">speed</span>
                        <span class="font-headline font-bold text-on-surface">99/100 Core Web Vitals</span>
                    </div>
                    <p class="text-xs text-on-surface-variant leading-relaxed">Optimization at the source. We prioritize low-level performance to secure high-level rankings.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Technical Stack / Bento Grid -->
    <section class="py-24 bg-surface-container-low">
        <div class="max-w-7xl mx-auto px-6">
            <div class="mb-16">
                <h2 class="text-3xl md:text-4xl font-headline font-bold text-on-surface text-tight">Technical Stack & Strategy</h2>
                <p class="mt-4 text-on-surface-variant max-w-xl">Our architecture leverages modern runtimes and edge delivery to ensure zero-latency user experiences.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
                <!-- React & Node Card -->
                <div class="md:col-span-2 md:row-span-2 glass-panel p-10 rounded-2xl shadow-xl flex flex-col justify-between group hover:border-primary/40 transition-all duration-500">
                    <div>
                        <div class="flex gap-4 mb-8">
                            <span class="material-symbols-outlined text-4xl text-primary">layers</span>
                            <span class="material-symbols-outlined text-4xl text-secondary">database</span>
                        </div>
                        <h3 class="text-2xl font-headline font-bold mb-4 text-on-surface">React & Node.js Core</h3>
                        <p class="text-on-surface-variant leading-relaxed">High-concurrency systems built with TypeScript for type-safety and robust scalability. We utilize SSR (Server-Side Rendering) for instant indexing and dynamic content delivery.</p>
                    </div>
                    <div class="mt-8 flex flex-wrap gap-2">
                        <span class="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full font-label tracking-wider">NEXT.JS</span>
                        <span class="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full font-label tracking-wider">TYPESCRIPT</span>
                        <span class="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full font-label tracking-wider">POSTGRES</span>
                    </div>
                </div>
                <!-- SEO Strategy Card -->
                <div class="md:col-span-2 glass-panel p-8 rounded-2xl shadow-xl flex items-start gap-6 border-l-4 border-primary">
                    <div class="shrink-0">
                        <span class="material-symbols-outlined text-3xl text-primary">query_stats</span>
                    </div>
                    <div>
                        <h3 class="text-xl font-headline font-bold mb-2 text-on-surface">Algorithmic SEO Dominance</h3>
                        <p class="text-sm text-on-surface-variant">Semantic HTML structure, schema markup, and automated internal linking protocols to align with Search Generative Experience (SGE).</p>
                    </div>
                </div>
                <!-- Cloud Infrastructure Card -->
                <div class="md:col-span-1 glass-panel p-8 rounded-2xl shadow-xl flex flex-col justify-center text-center">
                    <span class="material-symbols-outlined text-4xl text-primary mb-4">cloud_done</span>
                    <h3 class="text-lg font-headline font-bold text-on-surface">Edge Delivery</h3>
                    <p class="text-xs text-on-surface-variant mt-2">Global distribution & CI/CD automation.</p>
                </div>
                <!-- Security Card -->
                <div class="md:col-span-1 bg-primary-container p-8 rounded-2xl shadow-xl flex flex-col justify-center text-center">
                    <span class="material-symbols-outlined text-4xl mb-4 text-white">shield_lock</span>
                    <h3 class="text-lg font-headline font-bold text-white">Hardened Core</h3>
                    <p class="text-xs text-white/80 mt-2">End-to-end encryption & SOC2 compliance.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- The Process Section (Asymmetric Timeline) -->
    <section class="py-32 bg-surface">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-24">
                <h2 class="text-4xl font-headline font-extrabold text-on-surface">Methodical Execution</h2>
                <p class="text-on-surface-variant mt-4">The lifecycle of a precision digital asset.</p>
            </div>
            <div class="space-y-32 relative">
                <!-- Vertical Line (Decorative) -->
                <div class="absolute left-1/2 top-0 bottom-0 w-px bg-outline-variant/20 hidden md:block -translate-x-1/2"></div>
                <!-- Step 1 -->
                <div class="flex flex-col md:flex-row items-center gap-12 md:gap-0">
                    <div class="md:w-1/2 md:pr-24 text-right">
                        <h3 class="text-2xl font-headline font-bold text-primary mb-4">01. Discovery</h3>
                        <p class="text-on-surface-variant leading-relaxed">Deep-dive technical auditing and competitor keyword gap analysis. We define the architectural requirements before a single line of code is written.</p>
                    </div>
                    <div class="relative z-10 w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary-container flex items-center justify-center text-on-primary font-bold shadow-xl shadow-primary/20">1</div>
                    <div class="md:w-1/2 md:pl-24">
                        <div class="rounded-xl overflow-hidden glass-panel border border-white/10 shadow-2xl max-w-sm">
                            <img class="w-full h-48 object-cover opacity-80" alt="Discovery phase" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmSnXdGJD3qO_y4El8MFO-bX8_fTyLNpiVgJpH3ryzYPWCv7JEkEbVlGrCkAkCagybs48Vr8z6LZquMiB64wMUTwMaFXLVjQj8obDgDWDSINonpuogc-Vlu9F80GdmcAr8CSX3GHDjWYbZnFgKrpVTbdg16R0AF5KKaMptb-NMAqAz7jB2xdA5dTCmhJCGIEDJ9CCIUMFFltD4GNIAEOsK4PV09j_qpn3rAFrM_6S3MgrJqXuRy97FPzI6UImj3fzd-jUDBVkV_10"/>
                        </div>
                    </div>
                </div>
                <!-- Step 2 -->
                <div class="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-0">
                    <div class="md:w-1/2 md:pl-24 text-left">
                        <h3 class="text-2xl font-headline font-bold text-primary mb-4">02. Design</h3>
                        <p class="text-on-surface-variant leading-relaxed">High-fidelity UI systems built on accessibility and conversion science. Every design decision is backed by user-behavior data.</p>
                    </div>
                    <div class="relative z-10 w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary-container flex items-center justify-center text-on-primary font-bold shadow-xl shadow-primary/20">2</div>
                    <div class="md:w-1/2 md:pr-24 flex justify-end">
                        <div class="rounded-xl overflow-hidden glass-panel border border-white/10 shadow-2xl max-w-sm">
                            <img class="w-full h-48 object-cover opacity-80" alt="Design phase" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG2CXbx34QzLzrQCgnUM2R78aauUHgK86meXwnEZMkgmTGxDnBHOkQnN27hwXOwpBruMfSsAq-5kjn4IHfBzUKYu1gHgjgm2Ss6PJH_6azTPnHJ1P_sXPQGgNGEiBV-cjn7f8vWd3uJTdE5NkUxBTpzPe1nCheNAmE4na9N6Dsv6L4H1f5CAmUx74MrfAjR7FWqmHS5DvC7dmw6-B6o3PEUz3kmqHnxklmicn21a5KVXS6ibUcGeysnb9lEewJoYtuXpuCjNyy-mI"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Impact Section / Statistics -->
    <section class="py-24 bg-surface-container-high relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="p-8 glass-panel rounded-xl shadow-xl border border-white/10">
                    <div class="text-4xl font-headline font-black text-primary mb-2">+240%</div>
                    <div class="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">Organic Traffic Inc.</div>
                    <p class="text-sm mt-4 text-on-surface-variant">Average client growth within the first 6 months of architectural deployment.</p>
                </div>
                <div class="p-8 glass-panel rounded-xl shadow-xl border border-white/10">
                    <div class="text-4xl font-headline font-black text-primary mb-2">0.8s</div>
                    <div class="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">LCP Performance</div>
                    <p class="text-sm mt-4 text-on-surface-variant">Largest Contentful Paint benchmark across all our technical builds.</p>
                </div>
                <div class="p-8 glass-panel rounded-xl shadow-xl border border-white/10">
                    <div class="text-4xl font-headline font-black text-primary mb-2">Top 3</div>
                    <div class="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">SERP Ranking</div>
                    <p class="text-sm mt-4 text-on-surface-variant">Primary keyword placement target for high-intent business terms.</p>
                </div>
                <div class="p-8 glass-panel rounded-xl shadow-xl border border-white/10">
                    <div class="text-4xl font-headline font-black text-primary mb-2">100%</div>
                    <div class="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">Clean Code Index</div>
                    <p class="text-sm mt-4 text-on-surface-variant">Validated WCAG accessibility and technical SEO schema standards.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-surface">
        <div class="max-w-4xl mx-auto px-6 text-center">
            <div class="inline-block p-4 rounded-2xl bg-primary/10 mb-8">
                <span class="material-symbols-outlined text-5xl text-primary">rocket_launch</span>
            </div>
            <h2 class="text-4xl md:text-5xl font-headline font-bold mb-6 text-on-surface text-tight">Ready to Engineer Your Success?</h2>
            <p class="text-lg text-on-surface-variant mb-12">Connect with our architectural team to audit your current digital core and map out a path to technical dominance.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button class="bg-linear-to-r from-primary to-primary-container text-on-primary px-10 py-5 rounded-3xl font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
                    Schedule Technical Audit
                </button>
                <button class="bg-surface-container-high text-on-surface px-10 py-5 rounded-3xl font-headline font-bold text-lg hover:bg-surface-container-highest transition-colors">
                    Our Case Studies
                </button>
            </div>
        </div>
    </section>
</main>
@endsection
