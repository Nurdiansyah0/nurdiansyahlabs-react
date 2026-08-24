@extends('layouts.app')

@section('title', 'Our Engineering Masterpieces | Celestial Digital')

@section('content')
<main class="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
    <!-- Hero Section -->
    <section class="mb-20">
        <div class="flex flex-col md:flex-row items-end justify-between gap-8">
            <div class="max-w-2xl">
                <span class="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Engineered Precision</span>
                <h1 class="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter leading-tight mb-6">
                    Our Engineering <span class="text-transparent bg-clip-text bg-linear-to-r from-primary via-tertiary to-secondary">Masterpieces</span>
                </h1>
            </div>
            <div class="pb-2">
                <p class="text-on-surface-variant font-body text-lg leading-relaxed max-w-md text-right md:text-left border-l-2 border-primary-container pl-6">
                    Architecting digital infrastructures that defy gravity and define the next frontier of web performance.
                </p>
            </div>
        </div>
    </section>

    <!-- Filter Controls -->
    <section class="mb-16">
        <div class="flex flex-wrap items-center gap-4">
            <button class="px-6 py-2 rounded-full bg-primary-container text-on-primary-container font-semibold glass-panel border-none">All Projects</button>
            <button class="px-6 py-2 rounded-full text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-high">Web Dev</button>
            <button class="px-6 py-2 rounded-full text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-high">SEO</button>
            <button class="px-6 py-2 rounded-full text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-high">Data</button>
            <div class="ml-auto flex items-center space-x-2 text-on-surface-variant/50">
                <span class="text-sm font-label uppercase tracking-widest">Sort by Relevance</span>
                <span class="material-symbols-outlined text-sm">keyboard_arrow_down</span>
            </div>
        </div>
    </section>

    <!-- Project Grid (Asymmetric Bento Style) -->
    <section class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <!-- Large Featured Project -->
        <a href="/case-studies/nebula" class="md:col-span-8 group cursor-pointer drift-hover transition-all duration-500 rounded-xl overflow-hidden glass-panel">
            <div class="relative h-[400px] overflow-hidden">
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Nebula Core Architecture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe4gKizmPbF9XkHGCLbyqR4IxKodmiUqVssa8Aeh2wJtYugJW4dAaYuVmIY3gpDIdWC_TMLWybm8jNp6LN8mCXexgNqWWR5MbL60PdhSGz9Pc2zxDmb30gxZSD0yPGvIVZAzgiVvaKnK1zoa5gDABlV2TzqStQuIEXnHhIax4KU066mc6bHoUXjdhhzx2wus8tV9pUEiTSXku5KlDqZ5e4qDLS03GD6ZVa6rnvILJdiIgo1slcwS21SVhNaoV5v0OprkhFgvokcWc"/>
                <div class="absolute inset-0 bg-linear-to-t from-surface via-surface/40 to-transparent"></div>
                <div class="absolute bottom-8 left-8 right-8">
                    <div class="flex items-center space-x-3 mb-4">
                        <span class="px-3 py-1 bg-primary/20 text-primary text-[10px] uppercase font-bold tracking-widest rounded-full backdrop-blur-md">Data Solutions</span>
                        <span class="px-3 py-1 bg-secondary/20 text-secondary text-[10px] uppercase font-bold tracking-widest rounded-full backdrop-blur-md">Cloud</span>
                    </div>
                    <h3 class="text-3xl font-headline font-bold text-on-surface mb-2">Nebula Core Architecture</h3>
                    <p class="text-on-surface-variant max-w-lg">Scaleable microservices backend designed for real-time telemetry processing across global nodes.</p>
                </div>
            </div>
        </a>
        <!-- Small Project 1 -->
        <a href="/case-studies/prism" class="md:col-span-4 group cursor-pointer drift-hover transition-all duration-500 rounded-xl overflow-hidden glass-panel">
            <div class="relative h-[400px] overflow-hidden">
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Prism Engine" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJ2ZYd4uks63lXs5pYq7Z9mWnOJDIyV0cx4yBNsQKPogRcD4koW2UcnF9-CxHJUSQfvsPUDAQgTCwf1Dbk-9zt_MKXwc1Vfx1kNvcLB31uCceJa3mKc-IU-WDE0LPbh-1ghuY8F6vv17bKSC5yHVC0iU8TlBbyA4w7FRm0cgqQ06lLSlIcnLE2yS3ImpDghMK2CU4x-u_GdADEkiEyui6xRgi8jThSRAFkQdKQ9B9YlysBYCF2uZpg2CP2p_a3IT-U3xGFbCPK5jA"/>
                <div class="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent"></div>
                <div class="absolute bottom-8 left-8 right-8">
                    <span class="text-tertiary text-[10px] uppercase font-bold tracking-widest mb-2 block">Web Dev</span>
                    <h3 class="text-xl font-headline font-bold text-on-surface">Prism Engine</h3>
                </div>
            </div>
        </a>
        <!-- Small Project 2 -->
        <a href="/case-studies/vertex" class="md:col-span-4 group cursor-pointer drift-hover transition-all duration-500 rounded-xl overflow-hidden glass-panel">
            <div class="relative h-[300px] overflow-hidden">
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Vertex Indexer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOhtT_MoTfczoGMnfD1HuYJKpeUp_kfYwx7pTPsBcHJw9LdagQDGZE-wC6AukR7AcbsjienXKWRB-fhBUfK7RGpfJ3I8mNR3ikHieQ5z8al_zAX9lOnaV0NVWnbvs6jwj8fVoRWtUbhYAC1yo5_uQhifLp_KjlBCHpdJmJyvDrdYNjTKq9D9LG9WryRoYsLbMkjR-SRqQ1UIrTQeSK8FQb-QiRn3_6VBFuScgi6fE5ltxn4Lnf2rzTtQXLkiRXV5Wm3nLPsgJKaPc"/>
                <div class="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent"></div>
                <div class="absolute bottom-6 left-6">
                    <span class="text-secondary text-[10px] uppercase font-bold tracking-widest mb-1 block">SEO</span>
                    <h3 class="text-lg font-headline font-bold text-on-surface">Vertex Indexer</h3>
                </div>
            </div>
        </a>
        <!-- Large Project 2 -->
        <a href="/case-studies/nova" class="md:col-span-8 group cursor-pointer drift-hover transition-all duration-500 rounded-xl overflow-hidden glass-panel">
            <div class="relative h-[300px] overflow-hidden">
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Nova Edge Mesh" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKxEc5T0S0bqe8qgkWchN7Rg8Ub8h1hPqLrhl4R5bURsQfE7woThvq-VF2-RebWcBxdQRrP3-8QxGp4v3rIodeRFgddGxkr4rfEsF405SnfWRKSS20YxObl6R7Ty4_ozueeiymTJrh5Ke91WvzuGnEs5KX54oAJhoafN7RfDm8TLb4kRd_aBNcgXO_l3dJ55w8B42oGnfYYVfeXXW0h28-wH2yKil3DW8dPNzOP5NZXmqfyi8Ge1edqlotiY67DZPoO9dhRulY43w"/>
                <div class="absolute inset-0 bg-linear-to-t from-surface via-surface/20 to-transparent"></div>
                <div class="absolute bottom-8 left-8 flex justify-between items-end w-[calc(100%-64px)]">
                    <div>
                        <span class="text-primary text-[10px] uppercase font-bold tracking-widest mb-2 block">Infrastructure</span>
                        <h3 class="text-2xl font-headline font-bold text-on-surface">Nova Edge Mesh</h3>
                    </div>
                    <span class="material-symbols-outlined text-primary text-3xl">arrow_outward</span>
                </div>
            </div>
        </a>
        <!-- Small Project 3 -->
        <a href="/case-studies/signal" class="md:col-span-6 group cursor-pointer drift-hover transition-all duration-500 rounded-xl overflow-hidden glass-panel">
            <div class="p-8 h-full flex flex-col justify-between">
                <div>
                    <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                        <span class="material-symbols-outlined text-primary">analytics</span>
                    </div>
                    <h3 class="text-2xl font-headline font-bold mb-4">Signal Processor</h3>
                    <p class="text-on-surface-variant font-body leading-relaxed">Advanced analytics dashboard for interpreting massive datasets into actionable strategic intelligence with zero latency.</p>
                </div>
                <div class="mt-8 flex items-center space-x-4">
                    <span class="text-primary font-bold text-sm tracking-tight">Case Study</span>
                    <div class="h-px grow bg-outline-variant/30"></div>
                </div>
            </div>
        </div>
        <!-- Small Project 4 -->
        <div class="md:col-span-6 group cursor-pointer drift-hover transition-all duration-500 rounded-xl overflow-hidden glass-panel">
            <div class="relative h-[300px] overflow-hidden">
                <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Project Orion" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE1Wh943HgxRWv0N67bdut-mqFoByXH7hlCxb3r8dPYb0NOJ0DBGD33Fe40JGlvNek0IzS38kC9bJid0uJ2GY28jQBapFe1UxysgMlx7vdAD-wjyqdhht963AsFUEhEzNhEryx5j_nII1ZvxXd6nvsv5AVblwGqvmBUQC2PpzuZI3s7s_M6aFl40n2gMXXLgKiQGlq7pzQJ6XBtj6IpMsA4kGxV_d4IJrSdlu1RCx3YWEq7vdh6iqCcL2dYWDE4xVvcZwLE8emTLY"/>
                <div class="absolute inset-0 bg-surface/40 backdrop-blur-[2px] transition-all group-hover:backdrop-blur-0 group-hover:bg-transparent"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center p-6 bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <h4 class="font-headline font-bold text-xl mb-2">Project Orion</h4>
                        <p class="text-xs uppercase tracking-widest text-primary">Web Application</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section (Social Proof) -->
    <section class="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        <div>
            <h4 class="text-4xl font-headline font-extrabold text-primary mb-2">99.9%</h4>
            <p class="text-on-surface-variant/60 font-label text-xs uppercase tracking-widest">Uptime Precision</p>
        </div>
        <div>
            <h4 class="text-4xl font-headline font-extrabold text-tertiary mb-2">250+</h4>
            <p class="text-on-surface-variant/60 font-label text-xs uppercase tracking-widest">Cloud Deployments</p>
        </div>
        <div>
            <h4 class="text-4xl font-headline font-extrabold text-secondary mb-2">12ms</h4>
            <p class="text-on-surface-variant/60 font-label text-xs uppercase tracking-widest">Avg Query Speed</p>
        </div>
        <div>
            <h4 class="text-4xl font-headline font-extrabold text-primary mb-2">14</h4>
            <p class="text-on-surface-variant/60 font-label text-xs uppercase tracking-widest">Global Awards</p>
        </div>
    </section>
</main>
@endsection

<style>
    .drift-hover:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px -10px rgba(123, 44, 191, 0.3);
    }
</style>
