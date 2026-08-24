@extends('layouts.app')

@section('title', 'Data Analyst & Scientist Services | Celestial Digital')

@section('content')
<main class="pt-32 pb-20">
    <!-- Hero -->
    <section class="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div class="lg:col-span-7 space-y-8">
            <span class="inline-block py-1 px-3 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-widest uppercase">
                Intelligence & Telemetry
            </span>
            <h1 class="text-5xl lg:text-7xl font-extrabold font-headline tracking-tighter leading-[1.1] text-on-surface">
                Deciphering <br/>
                <span class="text-transparent bg-clip-text bg-linear-to-r from-secondary via-tertiary to-primary">Digital Signal.</span>
            </h1>
            <p class="text-lg text-on-surface-variant font-light max-w-2xl leading-relaxed">
                Transform raw telemetry into strategic dominance. Our data analysts and scientists architect custom models that reveal hidden patterns, predict market shifts, and automate decision-making at cosmic scale.
            </p>
            <div class="flex gap-4">
                <a href="#intel" class="bg-secondary text-on-secondary px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">Explore Intel</a>
                <a href="/contact" class="border border-outline-variant/30 text-on-surface px-8 py-4 rounded-full font-bold hover:bg-surface-container-high transition-colors">Request Audit</a>
            </div>
        </div>
        <div class="lg:col-span-5">
            <div class="glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <!-- Simulated Data Visualization -->
                <div class="h-64 flex items-end gap-2 mb-8">
                    @foreach([40, 70, 55, 90, 65, 80, 45, 95] as $height)
                        <div class="grow bg-linear-to-t from-secondary/40 to-secondary rounded-t-lg transition-all duration-1000 group-hover:h-[{{ $height + 5 }}%]" style="height: {{ $height }}%"></div>
                    @endforeach
                </div>
                <div class="space-y-4">
                    <div class="flex justify-between items-center text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                        <span>Real-time Streams</span>
                        <span class="text-secondary">Active</span>
                    </div>
                    <div class="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                        <div class="h-full bg-secondary w-3/4 animate-pulse"></div>
                    </div>
                    <p class="text-[10px] text-on-surface-variant/60 leading-relaxed italic">
                        Processing 1.2M events/sec across global node clusters.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Professional Services -->
    <section id="intel" class="max-w-7xl mx-auto px-8 mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Analyst Card -->
        <div class="glass-panel p-12 rounded-3xl border border-white/10 space-y-8 hover:border-secondary/30 transition-all duration-500">
            <div class="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <span class="material-symbols-outlined text-4xl">analytics</span>
            </div>
            <h3 class="text-3xl font-bold font-headline text-on-surface">Data Analyst Services</h3>
            <p class="text-on-surface-variant font-light leading-relaxed">
                We bridge the gap between complex datasets and actionable business intelligence. Our analysts distill noise into clarity, providing the dashboards and reports you need to lead your market.
            </p>
            <ul class="space-y-4 pt-4 border-t border-white/5">
                <li class="flex gap-4">
                    <span class="material-symbols-outlined text-secondary">monitoring</span>
                    <div>
                        <p class="text-on-surface font-bold">Visual Telemetry</p>
                        <p class="text-sm text-on-surface-variant">Real-time interactive dashboards (Tableau, PowerBI, Custom React).</p>
                    </div>
                </li>
                <li class="flex gap-4">
                    <span class="material-symbols-outlined text-secondary">query_stats</span>
                    <div>
                        <p class="text-on-surface font-bold">SQL & ETL Pipelines</p>
                        <p class="text-sm text-on-surface-variant">Automated data extraction and cleaning protocols.</p>
                    </div>
                </li>
            </ul>
        </div>

        <!-- Scientist Card -->
        <div class="glass-panel p-12 rounded-3xl border border-white/10 space-y-8 hover:border-primary/30 transition-all duration-500">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-4xl">psychology</span>
            </div>
            <h3 class="text-3xl font-bold font-headline text-on-surface">Data Scientist Services</h3>
            <p class="text-on-surface-variant font-light leading-relaxed">
                Going beyond what happened to predict what will happen next. We deploy machine learning models and deep-learning architectures to automate complex forecasting and system optimization.
            </p>
            <ul class="space-y-4 pt-4 border-t border-white/5">
                <li class="flex gap-4">
                    <span class="material-symbols-outlined text-primary">model_training</span>
                    <div>
                        <p class="text-on-surface font-bold">Predictive Modeling</p>
                        <p class="text-sm text-on-surface-variant">Regression, classification, and time-series forecasting for revenue growth.</p>
                    </div>
                </li>
                <li class="flex gap-4">
                    <span class="material-symbols-outlined text-primary">hub</span>
                    <div>
                        <p class="text-on-surface font-bold">NLP & LLM Integration</p>
                        <p class="text-sm text-on-surface-variant">Customizing AI language models for specialized business domains.</p>
                    </div>
                </li>
            </ul>
        </div>
    </section>

    <!-- Technical Stack -->
    <section class="mt-40 bg-surface-container-low py-24">
        <div class="max-w-7xl mx-auto px-8">
            <h2 class="text-4xl font-headline font-black text-on-surface mb-16 text-center">Architectural Intel Stack</h2>
            <div class="flex flex-wrap justify-center gap-12">
                @foreach(['Python', 'PyTorch', 'TensorFlow', 'PostgreSQL', 'Snowflake', 'D3.js', 'Pandas'] as $tech)
                <div class="flex flex-col items-center gap-4 group">
                    <div class="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center bg-indigo-950/20 group-hover:border-secondary transition-all">
                        <span class="text-xs font-bold font-label text-on-surface-variant group-hover:text-secondary group-hover:scale-110 transition-all">{{ $tech }}</span>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="max-w-5xl mx-auto px-8 mt-40">
        <div class="glass-panel p-16 rounded-[3rem] border border-white/10 relative overflow-hidden text-center">
            <div class="absolute inset-0 bg-linear-to-tr from-secondary/10 via-transparent to-primary/10 -z-10"></div>
            <h2 class="text-4xl md:text-6xl font-black font-headline mb-8 text-on-surface">Unlock Your Data's <br/> Full Potential.</h2>
            <p class="text-on-surface-variant mb-12 max-w-xl mx-auto">Start with a 360-degree technical data audit to find your hidden performance gaps.</p>
            <a href="/contact" class="inline-block bg-secondary text-on-secondary px-12 py-6 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform">Initiate Technical Audit</a>
        </div>
    </section>
</main>
@endsection
