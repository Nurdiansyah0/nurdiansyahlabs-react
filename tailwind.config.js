/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                canvas: {
                    DEFAULT: '#0B0F17',
                    deep: '#070A0F',
                    subtle: '#0F172A',
                },
                surface: {
                    DEFAULT: '#111827',
                    card: 'rgba(15, 23, 42, 0.8)',
                    subtle: '#1E293B',
                    border: 'rgba(255, 255, 255, 0.08)',
                },
                brand: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
                accent: {
                    50: '#ecfeff',
                    100: '#cffafe',
                    200: '#a5f3fc',
                    300: '#67e8f9',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                    700: '#0e7490',
                    800: '#155e75',
                    900: '#164e63',
                    950: '#083344',
                },
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
                heading: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
                body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                serif: ['"Instrument Serif"', 'Georgia', 'serif'],
                mono: ['"Geist Mono"', 'JetBrains Mono', 'Fira Code', 'monospace'],
            },
            boxShadow: {
                'studio-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
                'studio-glow': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
                'studio-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
                'specular': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
                'specular-hover': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 0 25px 50px -12px rgba(167, 139, 250, 0.25)',
                'aurora-glow': '0 0 80px -20px rgba(167, 139, 250, 0.35)',
            },
            borderRadius: {
                'card': '16px',
                'panel': '20px',
            },
        },
    },
    // Prevent Tailwind from resetting global CSS of react-app
    corePlugins: {
        preflight: false,
    },
    plugins: [],
}
