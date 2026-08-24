<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>@yield('title', 'Celestial Digital')</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-background selection:bg-primary/30">

    <!-- Top Navigation Shell -->
    <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 rounded-full mt-6 mx-auto w-[90%] max-w-7xl bg-indigo-950/40 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_0_rgba(123,44,191,0.1)] font-['Plus_Jakarta_Sans'] tracking-tight">
        <div class="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-purple-200 to-purple-500">
            <a href="/">Nurdiansyahlabs</a>
        </div>
        <nav class="hidden md:flex items-center space-x-8">
            <a class="text-indigo-200/70 hover:text-white transition-all hover:scale-105 duration-300 {{ request()->is('/') ? 'text-purple-200 font-semibold border-b-2 border-purple-400/50 pb-1' : '' }}" href="/">Home</a>
            
            <!-- Services Dropdown -->
            <div class="relative group">
                <button class="flex items-center gap-1 text-indigo-200/70 hover:text-white transition-colors hover:scale-105 transition-transform duration-300 {{ request()->is('services*') ? 'text-purple-200 font-semibold border-b-2 border-purple-400/50 pb-1' : '' }}">
                    Services
                    <span class="material-symbols-outlined text-sm transition-transform group-hover:rotate-180">expand_more</span>
                </button>
                <div class="absolute top-full left-0 mt-4 w-64 p-2 bg-indigo-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                    <a class="block p-4 rounded-xl hover:bg-white/5 transition-colors group/item" href="/services/web-development">
                        <div class="text-purple-200 font-bold mb-1 flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">code</span>
                            Web & SEO
                        </div>
                        <p class="text-[10px] text-indigo-300/50 leading-relaxed">High-performance architecture & organic growth.</p>
                    </a>
                    <a class="block p-4 rounded-xl hover:bg-white/5 transition-colors group/item" href="/services/data-analytics">
                        <div class="text-purple-200 font-bold mb-1 flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm">insights</span>
                            Data & Analytics
                        </div>
                        <p class="text-[10px] text-indigo-300/50 leading-relaxed">Real-time telemetry & algorithmic insights.</p>
                    </a>
                </div>
            </div>

            <a class="text-indigo-200/70 hover:text-white transition-colors hover:scale-105 transition-transform duration-300 {{ request()->is('portfolio') ? 'text-purple-200 font-semibold border-b-2 border-purple-400/50 pb-1' : '' }}" href="/portfolio">Portfolio</a>
            <a class="text-indigo-200/70 hover:text-white transition-all hover:scale-105 duration-300 {{ request()->is('contact') ? 'text-purple-200 font-semibold border-b-2 border-purple-400/50 pb-1' : '' }}" href="/contact">Contact</a>
        </nav>
        <button class="bg-linear-to-br from-primary to-primary-container text-on-primary font-bold px-6 py-2 rounded-full hover:scale-105 transition-all active:scale-95 duration-200">
            Get Started
        </button>
    </header>

    <div class="max-w-7xl mx-auto px-8 pt-28">
        @if(session('status'))
            <div class="mb-6 p-4 rounded-lg bg-green-50 text-green-800 border border-green-100">
                {{ session('status') }}
            </div>
        @endif
        @if($errors->any())
            <div class="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-100">
                {{ $errors->first() }}
            </div>
        @endif
    </div>

    @yield('content')

    <!-- Footer Shell -->
    <footer class="bg-indigo-950 font-['Inter'] text-sm tracking-wide full-width pt-20 pb-10">
        <div class="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            <div class="flex flex-col items-center md:items-start space-y-4">
                <div class="text-lg font-bold text-purple-200">Nurdiansyahlabs</div>
                <p class="text-indigo-300/50 text-center md:text-left max-w-sm">
                    Designing weightless digital experiences that transcend the boundaries of modern technology.
                </p>
            </div>
            <div class="flex flex-col items-center md:items-end space-y-6">
                <nav class="flex space-x-6">
                    <a class="text-indigo-300/50 hover:text-purple-200 transition-colors" href="#">Privacy Policy</a>
                    <a class="text-indigo-300/50 hover:text-purple-200 transition-colors" href="#">Terms of Service</a>
                    <a class="text-indigo-300/50 hover:text-purple-200 transition-colors" href="#">LinkedIn</a>
                    <a class="text-indigo-300/50 hover:text-purple-200 transition-colors" href="#">GitHub</a>
                </nav>
                <div class="text-indigo-300/50">© {{ date('Y') }} Nurdiansyahlabs. All rights reserved.</div>
            </div>
        </div>
    </footer>
</body>
</html>
