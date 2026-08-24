@extends('layouts.app')

@section('title', 'Vertex Indexer | SEO Dominance Case Study')

@section('content')
<main class="pt-32 pb-20">
    <!-- Hero -->
    <section class="max-w-7xl mx-auto px-8 relative">
        <div class="absolute -top-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10"></div>
        <div class="space-y-6 max-w-4xl">
            <nav class="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-12">
                <a href="/portfolio" class="hover:text-primary transition-colors">Portfolio</a>
                <span class="material-symbols-outlined text-xs">chevron_right</span>
                <span class="text-on-surface">Vertex Search Optimization</span>
            </nav>
            <h1 class="text-6xl lg:text-8xl font-extrabold font-headline tracking-tighter leading-tight text-on-surface">
                Vertex <br/>
                <span class="text-transparent bg-clip-text bg-linear-to-r from-secondary via-primary to-tertiary">Indexer.</span>
            </h1>
            <p class="text-xl text-on-surface-variant font-light leading-relaxed max-w-2xl">
                Algorithmic dominance at the source. Vertex is a technical SEO engine that aligns large-scale enterprise content with Google's Search Generative Experience.
            </p>
        </div>
    </section>

    <!-- Results Overview -->
    <section class="max-w-7xl mx-auto px-8 mt-24">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="glass-panel p-10 rounded-3xl border border-white/10 text-center space-y-2">
                <p class="text-5xl font-black text-secondary font-headline">+420%</p>
                <p class="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Organic Growth</p>
            </div>
            <div class="glass-panel p-10 rounded-3xl border border-white/10 text-center space-y-2">
                <p class="text-5xl font-black text-secondary font-headline">0.4s</p>
                <p class="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Crawler Response</p>
            </div>
            <div class="glass-panel p-10 rounded-3xl border border-white/10 text-center space-y-2">
                <p class="text-5xl font-black text-secondary font-headline">12k+</p>
                <p class="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Daily Indexed Pages</p>
            </div>
        </div>
    </section>

    <!-- Content -->
    <section class="max-w-7xl mx-auto px-8 mt-32 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div class="lg:col-span-8 space-y-12">
            <div class="space-y-6">
                <h2 class="text-3xl font-bold font-headline text-on-surface">The Intelligence Layer</h2>
                <p class="text-on-surface-variant font-light text-xl leading-relaxed">
                    Legacy SEO focuses on keywords. Vertex focuses on intent. By building a custom semantic middleware that sits between the CMS and the delivery layer, we're able to rewrite metadata and internal linking structures in real-time based on live search trends.
                </p>
            </div>
            <div class="rounded-3xl overflow-hidden glass-panel border border-white/10 aspect-video relative group">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOhtT_MoTfczoGMnfD1HuYJKpeUp_kfYwx7pTPsBcHJw9LdagQDGZE-wC6AukR7AcbsjienXKWRB-fhBUfK7RGpfJ3I8mNR3ikHieQ5z8al_zAX9lOnaV0NVWnbvs6jwj8fVoRWtUbhYAC1yo5_uQhifLp_KjlBCHpdJmJyvDrdYNjTKq9D9LG9WryRoYsLbMkjR-SRqQ1UIrTQeSK8FQb-QiRn3_6VBFuScgi6fE5ltxn4Lnf2rzTtQXLkiRXV5Wm3nLPsgJKaPc" alt="Vertex SEO Data" class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s]"/>
                <div class="absolute inset-0 bg-linear-to-tr from-indigo-950/80 to-transparent flex items-end p-12">
                    <div class="space-y-4">
                        <span class="px-3 py-1 bg-secondary/20 text-secondary text-[10px] font-bold uppercase rounded-full">Core Update Resilient</span>
                        <h4 class="text-2xl font-bold text-on-surface">Algorithmic Immunity</h4>
                        <p class="text-sm text-on-surface-variant max-w-sm">Designing systems that adapt to search engine shifts without manual intervention.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="lg:col-span-4">
            <div class="glass-panel p-8 rounded-3xl border border-white/10 sticky top-32">
                <h4 class="text-sm font-bold text-on-surface mb-6 border-b border-white/5 pb-4">Strategy Components</h4>
                <ul class="space-y-6">
                    <li class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-secondary">schema</span>
                        <p class="text-xs text-on-surface-variant leading-relaxed"><span class="block text-on-surface font-bold text-sm mb-1">Dynamic JSON-LD</span> Automated schema generation for every entity on the site.</p>
                    </li>
                    <li class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-secondary">link</span>
                        <p class="text-xs text-on-surface-variant leading-relaxed"><span class="block text-on-surface font-bold text-sm mb-1">Path Optimization</span> Heuristic internal linking to pass maximum authority to high-intent pages.</p>
                    </li>
                    <li class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-secondary">rocket_launch</span>
                        <p class="text-xs text-on-surface-variant leading-relaxed"><span class="block text-on-surface font-bold text-sm mb-1">Lighthouse Dominance</span> Ensuring 100/100 scores for SEO and Accessibility benchmarks.</p>
                    </li>
                </ul>
            </div>
        </div>
    </section>

    <!-- Next / Prev Project -->
    <section class="max-w-7xl mx-auto px-8 mt-40 pt-20 border-t border-white/5 flex justify-between items-center">
        <a href="/case-studies/prism" class="group text-left">
            <p class="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Previous</p>
            <h4 class="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">Prism Engine</h4>
        </a>
        <a href="/case-studies/nova" class="group text-right">
            <p class="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Next</p>
            <h4 class="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">Nova Edge Mesh</h4>
        </a>
    </section>
</main>
@endsection
