@extends('layouts.app')

@section('title', 'Launch Your Next Venture | Celestial Digital')

@section('content')
<main class="relative min-h-screen pt-32 pb-20 overflow-hidden">
    <!-- Atmospheric Background Elements -->
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/10 rounded-full blur-[100px] -z-10"></div>
    
    <div class="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <!-- Left Side: Content & Identity -->
        <div class="lg:col-span-5 space-y-12">
            <div class="space-y-6">
                <span class="inline-block py-1 px-3 rounded-full bg-primary-container/20 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
                    Mission Control
                </span>
                <h1 class="text-5xl lg:text-7xl font-extrabold font-headline tracking-tighter leading-[1.1] text-on-surface">
                    Let's Launch Your <br/>
                    <span class="text-transparent bg-clip-text bg-linear-to-r from-primary via-tertiary to-secondary">Next Venture.</span>
                </h1>
                <p class="text-lg text-on-surface-variant font-light max-w-md leading-relaxed">
                    Connect with our architects to bridge the gap between imagination and digital reality. Your journey to the stars begins with a single conversation.
                </p>
            </div>
            <!-- Contact Details Card -->
            <div class="space-y-8">
                <div class="flex items-start gap-6 group">
                    <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary border border-outline-variant/30 group-hover:border-primary/50 transition-colors">
                        <span class="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-on-surface tracking-wide uppercase mb-1">Office Location</h4>
                        <p class="text-on-surface-variant font-light">
                            Jakarta, Indonesia<br/>
                            (Remote-friendly)
                        </p>
                    </div>
                </div>
                <div class="flex items-start gap-6 group">
                    <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary border border-outline-variant/30 group-hover:border-primary/50 transition-colors">
                        <span class="material-symbols-outlined">alternate_email</span>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-on-surface tracking-wide uppercase mb-1">Transmission Channel</h4>
                        <p class="text-on-surface-variant font-light">
                            hello@nurdiansyahlabs.com<br/>
                            +62 812-3456-7890
                        </p>
                    </div>
                </div>
            </div>
            <!-- Social Drift -->
            <div class="flex gap-4 pt-4">
                <a class="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300" href="#">
                    <span class="material-symbols-outlined">public</span>
                </a>
                <a class="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300" href="#">
                    <span class="material-symbols-outlined">groups</span>
                </a>
                <a class="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300" href="#">
                    <span class="material-symbols-outlined">share</span>
                </a>
            </div>
        </div>
        
        <!-- Right Side: Floating Form -->
        <div class="lg:col-span-7 relative">
            <!-- Decorative element behind form -->
            <div class="absolute -top-10 -right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
            <div class="glass-panel p-8 lg:p-12 rounded-xl ethereal-glow relative overflow-hidden">
                <!-- Subtle pattern overlay -->
                <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, #fff 1px, transparent 0); background-size: 24px 24px;"></div>
                <form method="POST" action="{{ route('contact.send') }}" class="space-y-8 relative z-10">
                    @csrf
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-2">
                            <label class="block text-xs font-bold tracking-widest text-primary uppercase ml-1">Nama Anda</label>
                            <input name="name" required class="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 focus:border-primary transition-all px-1 py-3" placeholder="Nama lengkap" type="text"/>
                        </div>
                        <div class="space-y-2">
                            <label class="block text-xs font-bold tracking-widest text-primary uppercase ml-1">Email</label>
                            <input name="email" required class="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 focus:border-primary transition-all px-1 py-3" placeholder="nama@domain.com" type="email"/>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-xs font-bold tracking-widest text-primary uppercase ml-1">Tujuan</label>
                        <select name="subject" class="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/30 text-on-surface focus:ring-0 focus:border-primary transition-all px-1 py-3 appearance-none">
                            <option value="New Project">Peluncuran proyek baru</option>
                            <option value="Upgrade">Peningkatan sistem</option>
                            <option value="Partnership">Kemitraan strategis</option>
                            <option value="Other">Lainnya / General</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-xs font-bold tracking-widest text-primary uppercase ml-1">Pesan</label>
                        <textarea name="message" required class="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 focus:border-primary transition-all px-1 py-3 resize-none" placeholder="Ceritakan masalah atau kebutuhan Anda secara singkat" rows="4"></textarea>
                    </div>
                    <div class="pt-4">
                        <button class="w-full group relative overflow-hidden bg-linear-to-r from-primary to-primary-container p-px rounded-xl" type="submit">
                            <span class="px-8 py-4 bg-background group-hover:bg-transparent transition-colors rounded-[23px] font-bold text-primary group-hover:text-on-primary flex items-center justify-center gap-3">
                                Kirim Pesan
                            </span>
                        </button>
                    </div>
                </form>
            </div>
            <!-- Floating Abstract Map/UI Element -->
            <div class="mt-12 glass-panel p-4 rounded-xl flex items-center gap-6 border-l-4 border-l-primary">
                <div class="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img class="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700" alt="Global Network" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPwMvnvWy2R0vsBmiYt5s6oa-gxbQWZ9aCKl8Sznu223dOZfKRNMpuY-4OTLQMQLEdYdRL5RpPsQ1Pfvj8r0vy7W46Rljx72RtDpJjpI7IcxdL58vRKywQC1KsKH8bd-cZHC_bD4CM196JjuwF_BEHsvECAit9i59r_n40GjgQsz8Sg6_0TSt3EQg-S54AkK20Pylvh_as2N5Qnfs5Ze66aGEd2I1G3IBbPKafZhUkykn9FsoUNDepHF1pF6ecgSefxe5I77EhwvY"/>
                </div>
                <div>
                    <p class="text-xs font-bold text-primary tracking-widest uppercase">Global Network</p>
                    <p class="text-sm text-on-surface-variant font-light">Operating across 14 planetary hubs with seamless synchronization.</p>
                </div>
            </div>
        </div>
    </div>
</main>
@endsection

<style>
    .ethereal-glow {
        box-shadow: 0 0 40px 0 rgba(123, 44, 191, 0.15);
    }
</style>
