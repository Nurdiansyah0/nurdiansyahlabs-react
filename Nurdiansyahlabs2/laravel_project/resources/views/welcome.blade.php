@extends('layouts.app')

@section('title', 'Nurdiansyahlabs — Solusi Digital Nyata')

@section('content')
<main>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center pt-24 overflow-hidden">
        <!-- Background Elements -->
        <div class="absolute top-0 left-0 w-full h-full -z-10 bg-surface">
            <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
            <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/10 rounded-full blur-[100px]"></div>
        </div>
        <div class="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div class="lg:col-span-7 space-y-8">
                <div class="inline-flex items-center px-4 py-2 rounded-full glass-card text-primary text-sm font-medium tracking-wide">
                    Solusi Nyata
                </div>
                <h1 class="text-6xl md:text-8xl font-extrabold font-headline leading-none tracking-tighter text-on-surface">
                    Nurdiansyahlabs<br/>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-primary-container">Membantu Bisnis Bergerak Maju.</span>
                </h1>
                <p class="text-xl md:text-2xl text-on-surface-variant font-body font-light leading-relaxed max-w-2xl">
                    Kami membangun situs, alat data, dan sistem yang menyelesaikan masalah nyata: konversi rendah, proses manual, dan data yang tersebar. Fokus kami adalah membuat solusi yang bisa dipakai dan memberi hasil.
                </p>
                <div class="flex flex-wrap gap-6 pt-4">
                    <a href="/services/web-development" class="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-3xl font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-primary/20">Lihat Layanan</a>
                    <a href="/portfolio" class="px-8 py-4 bg-surface-container-highest/30 backdrop-blur-md border border-outline-variant/30 text-on-surface rounded-3xl font-bold text-lg hover:bg-surface-container-highest transition-all duration-300">Portofolio</a>
                </div>
            </div>
            <div class="lg:col-span-5 relative flex justify-center items-center">
                <!-- Floating 3D Object Representation -->
                <div class="relative w-full aspect-square max-w-[500px]">
                    <div class="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
                    <div class="floating relative z-10 w-full h-full rounded-[4rem] glass-card overflow-hidden flex items-center justify-center p-8">
                        <img class="w-full h-full object-cover rounded-3xl opacity-80" alt="abstract iridescent 3D geometric shape floating in a dark cosmic void with glowing purple and blue highlights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaOtdh4HLts1w5gkDt03gc7K9EIC2w25ZfCrVIHh3_CH8lWmQs4mMM3kn1o1tvdzQiLH2rLpkdUFKslHDqdp6xNNRMV_oDy44NgQDNp1Q6l2oQJS9keLgJtxOSALceP2ogOM5KtwC0G1L65tPjDsM9ZkDkPDrDGz98bb43f2jN3Je98c-Ouzz12OYYWj3S1Fn7012-DAobFRJyT6xVxJS6G_K8hvpIFV5dNi26dKt8cQ2XjNynUKxESwWClHyFgwc7MTBk2RFb_LI"/>
                        <div class="absolute inset-0 bg-gradient-to-t from-surface-container/80 to-transparent"></div>
                        <div class="absolute bottom-8 left-8">
                            <p class="text-label text-xs uppercase tracking-widest text-primary mb-1">Current State</p>
                            <p class="text-headline text-2xl font-bold">Orbit v4.2.0</p>
                        </div>
                    </div>
                    <!-- Orbital Accent -->
                    <div class="absolute -top-10 -right-10 w-32 h-32 rounded-full glass-card border border-primary/20 flex items-center justify-center animate-spin [animation-duration:15s]">
                        <span class="material-symbols-outlined text-primary text-4xl">rocket_launch</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Core Services Section -->
    <section class="py-32 relative bg-surface-container-low">
        <div class="max-w-7xl mx-auto px-8">
            <div class="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                <div class="max-w-2xl">
                    <label class="text-label text-sm uppercase tracking-[0.2em] text-primary mb-4 block">Ecosystem</label>
                    <h2 class="text-4xl md:text-6xl font-headline font-bold text-on-surface">Precision Crafted <span class="text-outline">Solutions.</span></h2>
                </div>
                <div class="md:w-1/3 text-on-surface-variant font-light">
                    Leveraging astronomical data sets and celestial aesthetics to build high-performance digital environments.
                </div>
            </div>
            <!-- Bento Grid Layout -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
                <div class="md:col-span-8 group relative overflow-hidden rounded-3xl glass-card p-12 flex flex-col justify-between hover:border-primary/40 transition-all duration-500">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors duration-500"></div>
                    <div>
                        <span class="material-symbols-outlined text-primary text-5xl mb-6">desktop_cloud</span>
                        <h3 class="text-3xl font-headline font-bold text-on-surface mb-4">Web Architecture</h3>
                        <p class="text-on-surface-variant max-w-md text-lg leading-relaxed">We don't just build sites; we craft performant digital cathedrals using next-gen frameworks and fluid, weightless UI principles.</p>
                    </div>
                    <div class="flex items-center gap-4 text-primary font-bold tracking-wide">
                        LEARN MORE <span class="material-symbols-outlined">arrow_right_alt</span>
                    </div>
                </div>
                <div class="md:col-span-4 group relative overflow-hidden rounded-3xl bg-surface-container-highest p-10 flex flex-col justify-end hover:bg-surface-variant transition-all duration-500 border border-white/5">
                    <div class="absolute top-10 left-10 text-on-surface-variant/20">
                        <span class="material-symbols-outlined text-9xl">insights</span>
                    </div>
                    <div class="relative z-10">
                        <h3 class="text-2xl font-headline font-bold text-on-surface mb-3">SEO Intelligence</h3>
                        <p class="text-on-surface-variant text-sm mb-6">Algorithmic dominance through deep metadata optimization and semantic structure mapping.</p>
                        <span class="material-symbols-outlined text-primary">analytics</span>
                    </div>
                </div>
                <div class="md:col-span-4 group relative overflow-hidden rounded-3xl bg-primary-container p-10 flex flex-col justify-between hover:brightness-110 transition-all duration-500 shadow-xl shadow-primary-container/20">
                    <div class="flex justify-between items-start">
                        <span class="material-symbols-outlined text-white text-4xl">database</span>
                        <span class="text-white/50 text-xs font-bold uppercase tracking-widest">Real-time</span>
                    </div>
                    <div>
                        <h3 class="text-2xl font-headline font-bold text-white mb-2">Data Solutions</h3>
                        <p class="text-white/80 text-sm">Visualizing complex data constellations into actionable business insights.</p>
                    </div>
                </div>
                <div class="md:col-span-8 group relative overflow-hidden rounded-3xl glass-card p-10 flex items-center justify-between border border-outline-variant/20">
                    <div class="max-w-sm">
                        <h3 class="text-2xl font-headline font-bold text-on-surface mb-3">Product Strategy</h3>
                        <p class="text-on-surface-variant text-sm">Defining the roadmap for digital products that aim for escape velocity and market leadership.</p>
                    </div>
                    <div class="hidden sm:block">
                        <div class="flex -space-x-4">
                            <div class="w-12 h-12 rounded-full border-2 border-surface bg-surface-container flex items-center justify-center"><span class="material-symbols-outlined text-xs">auto_awesome</span></div>
                            <div class="w-12 h-12 rounded-full border-2 border-surface bg-surface-container flex items-center justify-center"><span class="material-symbols-outlined text-xs">star</span></div>
                            <div class="w-12 h-12 rounded-full border-2 border-surface bg-surface-container flex items-center justify-center"><span class="material-symbols-outlined text-xs">all_inclusive</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-32 relative bg-surface">
        <div class="max-w-7xl mx-auto px-8">
            <div class="text-center mb-24">
                <label class="text-label text-sm uppercase tracking-[0.2em] text-tertiary mb-4 block">Feedback</label>
                <h2 class="text-4xl md:text-6xl font-headline font-bold text-on-surface">Celestial <span class="text-primary">Accolades.</span></h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Testimonial Card 1 -->
                <div class="glass-card p-8 rounded-3xl flex flex-col gap-8 border border-white/5 shadow-2xl relative">
                    <div class="absolute -top-6 -left-2 text-primary/10 select-none">
                        <span class="material-symbols-outlined text-8xl" style="font-variation-settings: 'FILL' 1;">format_quote</span>
                    </div>
                    <p class="text-on-surface font-light leading-relaxed text-lg relative z-10 italic">
                        "The transition to Celestial Digital was like moving from a grounded station to a warp-capable ship. Our conversion rates reached escape velocity within weeks."
                    </p>
                    <div class="flex items-center gap-4 mt-auto">
                        <div class="w-12 h-12 rounded-full bg-surface-container overflow-hidden">
                            <img class="w-full h-full object-cover" alt="portrait of a tech executive" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-wbSO7ha7NT-HkUTdFXtnQQIbBxmvpo5fXo-Y3coQ2QALb0sJgqSnytM963xRYVc0Arn7EU6pTQ-2S-pS9WxcmLUB9G1-pY_ROdX0L_UymSl0cDfHDQKnDqYOBxCCGWCcFM1FMUJf1dLD3MA4JyTvUpF_be1e_HF9dvtlXwNidY6GeCpsdotZxCnGTEDxgKm9Kori5_G5kX8I0dkVso4WER4mZOy4pZIkYxVdJ6JMRCLovKftn5TfMPSRpTSOkLIW0COvnn8Q5mw"/>
                        </div>
                        <div>
                            <h4 class="font-bold text-on-surface">Aris Thorne</h4>
                            <p class="text-xs text-on-surface-variant uppercase tracking-widest">CTO, Nebula Systems</p>
                        </div>
                    </div>
                </div>
                <!-- Testimonial Card 2 -->
                <div class="glass-card p-8 rounded-3xl flex flex-col gap-8 border border-white/5 shadow-2xl relative md:-translate-y-12">
                    <div class="absolute -top-6 -left-2 text-tertiary/10 select-none">
                        <span class="material-symbols-outlined text-8xl" style="font-variation-settings: 'FILL' 1;">format_quote</span>
                    </div>
                    <p class="text-on-surface font-light leading-relaxed text-lg relative z-10 italic">
                        "Weightless UI isn't just a gimmick—it's a philosophy that has transformed how our users interact with complex data dashboards."
                    </p>
                    <div class="flex items-center gap-4 mt-auto">
                        <div class="w-12 h-12 rounded-full bg-surface-container overflow-hidden">
                            <img class="w-full h-full object-cover" alt="portrait of an entrepreneur" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADFxNWcmwIAYOGhhewDQ8e-OUKdbzJGyeEWHrdS692WXhJZvlIIgydo0sPFPlwCxNZQtp1_5JLO8bciTnAJqn4rsWDrubCjTWUyjLLU1FioBz4clA4yP8j4SxnG3UKSyGRYSVCxeVJlTN_TKR_dQqzzvxBxgNJpRSbVclyVpoEtKf03Xtb44xg4tlavMeKTizuvnIv8YewpZ6YTZAhDk2FsZYyu2hsr2zELLmT7VyxDNMegnUKLGWEwtd9LdWesbACEQMIDvsNUSc"/>
                        </div>
                        <div>
                            <h4 class="font-bold text-on-surface">Lyra Vance</h4>
                            <p class="text-xs text-on-surface-variant uppercase tracking-widest">Founder, Astra Flow</p>
                        </div>
                    </div>
                </div>
                <!-- Testimonial Card 3 -->
                <div class="glass-card p-8 rounded-3xl flex flex-col gap-8 border border-white/5 shadow-2xl relative">
                    <div class="absolute -top-6 -left-2 text-primary/10 select-none">
                        <span class="material-symbols-outlined text-8xl" style="font-variation-settings: 'FILL' 1;">format_quote</span>
                    </div>
                    <p class="text-on-surface font-light leading-relaxed text-lg relative z-10 italic">
                        "Their eye for ethereal precision is unmatched. They turned our outdated platform into a bespoke editorial experience that breathes luxury."
                    </p>
                    <div class="flex items-center gap-4 mt-auto">
                        <div class="w-12 h-12 rounded-full bg-surface-container overflow-hidden">
                            <img class="w-full h-full object-cover" alt="portrait of a creative director" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCregM77vT8RXl3wv6YDjFmoDk8OulDb-qFGWLNLThCn64DpbQk0b_fcLTD6ihhJSrgtSm5g4pL879Fg5zNgJh7SiXS3dm5z4G9sroJub7UglqcHishmjyg0Hvd3rp6wXWZDfCX7K7bwugMHgid1vLToOpk18Ls9TgfWgHwtvrrx3Krxso2WVVQHTTDf5FhI4W_d6RzoLKuWiAtAXxVB_PhPJ67z_4ZUJceTQReaY2_b28oH5u-9bt3bPv0M0FJvCoC10QqqTdXohs"/>
                        </div>
                        <div>
                            <h4 class="font-bold text-on-surface">Marcus Sol</h4>
                            <p class="text-xs text-on-surface-variant uppercase tracking-widest">Creative Director, Nova</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-40 relative overflow-hidden">
        <div class="absolute inset-0 -z-10 bg-gradient-to-b from-surface to-background"></div>
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[300px] bg-primary/10 rounded-[100%] blur-[120px]"></div>
        <div class="max-w-5xl mx-auto px-8 glass-card rounded-[3rem] p-16 text-center relative border border-primary/20 glow-shadow">
            <div class="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-8 animate-bounce">
                <span class="material-symbols-outlined text-4xl">rocket</span>
    <!-- Trust Core: Agency Partners -->
    <section class="max-w-7xl mx-auto px-8 mt-32">
        <div class="text-center space-y-4 mb-12">
            <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Trusted by Industry Leaders</h4>
        </div>
        <div class="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            @foreach(['Nebula Dynamics', 'Prism Labs', 'Vertex Solutions', 'Nova Systems', 'Signal Corp'] as $brand)
                <div class="text-xl font-bold font-headline text-on-surface select-none">{{ $brand }}</div>
            @endforeach
        </div>
    </section>

    <!-- Detailed Testimonials -->
    <section class="max-w-7xl mx-auto px-8 mt-48">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div class="space-y-8">
                <h2 class="text-4xl md:text-6xl font-black font-headline text-on-surface tracking-tighter">What Our <br/> Architects Say.</h2>
                <div class="glass-panel p-8 rounded-3xl border border-white/10 relative">
                    <span class="material-symbols-outlined text-6xl text-primary/20 absolute -top-4 -left-4">format_quote</span>
                    <p class="text-xl text-on-surface leading-relaxed font-light relative z-10">
                        "Celestial Digital didn't just rebuild our platform; they redefined our entire approach to performance. Our organic traffic surged by 340% within six months of their architectural overhaul."
                    </p>
                    <div class="mt-8 flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary"></div>
                        <div>
                            <p class="font-bold text-on-surface">Elena Vance</p>
                            <p class="text-xs text-on-surface-variant">CTO, Nebula Dynamics</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-8">
                <div class="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
                    <p class="text-on-surface-variant italic">"The level of technical sophistication is unmatched. They handled our global data telemetry migration with zero downtime and perfect precision."</p>
                    <p class="text-xs font-bold text-primary">— Marcus Thorne, Lead Scientist</p>
                </div>
                <div class="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
                    <p class="text-on-surface-variant italic">"Finally, an agency that understands that SEO is an engineering problem, not just a content one. Our rankings have never been higher."</p>
                    <p class="text-xs font-bold text-primary">— Sarah Chen, Digital Director</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Final CTA -->
    <section class="max-w-7xl mx-auto px-8 my-48">
        <div class="relative rounded-[3rem] overflow-hidden p-16 md:p-24 text-center space-y-8">
            <div class="absolute inset-0 bg-linear-to-br from-indigo-950 to-indigo-900 -z-10"></div>
            <div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
            <h2 class="text-4xl md:text-7xl font-black font-headline text-on-surface leading-tight">Ready to Transcend <br/> the Ordinary?</h2>
            <p class="text-on-surface-variant max-w-xl mx-auto text-lg">Join us in architecting the next frontier of digital excellence.</p>
            <div class="flex flex-wrap justify-center gap-6 pt-8">
                <a href="/contact" class="px-12 py-6 bg-primary text-on-primary rounded-full font-black text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(123,44,191,0.3)]">Launch Project</a>
                <a href="/portfolio" class="px-12 py-6 border border-white/10 text-on-surface rounded-full font-black text-xl hover:bg-white/5 transition-colors">View Portfolio</a>
            </div>
        </div>
    </section>
</main>
@endsection

<style>
    .floating {
        animation: floating 6s ease-in-out infinite;
    }
    @keyframes floating {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    .glow-shadow {
        box-shadow: 0 0 40px 0 rgba(123, 44, 191, 0.15);
    }
</style>