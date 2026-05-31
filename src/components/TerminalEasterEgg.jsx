import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Terminal } from 'lucide-react';

export default function TerminalEasterEgg() {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState([
        { type: 'system', text: 'Welcome to NurdiansyahOS v1.0.0' },
        { type: 'system', text: 'Type "help" to see available commands.' }
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    // Keyboard shortcut to open terminal (Ctrl + ` or typing 'cpanel')
    useEffect(() => {
        let keys = '';
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === '`') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            
            // Easter egg trigger by typing "cpanel"
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                keys += e.key.toLowerCase();
                if (keys.length > 6) keys = keys.slice(-6);
                if (keys === 'cpanel') {
                    setIsOpen(true);
                    keys = '';
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleCommand = (e) => {
        e.preventDefault();
        const cmd = input.trim();
        if (!cmd) return;

        const newHistory = [...history, { type: 'user', text: `[uygpuazs@waguri ~]$ ${cmd}` }];
        
        // Process command
        const args = cmd.toLowerCase().split(' ');
        const baseCmd = args[0];

        switch (baseCmd) {
            case 'help':
                newHistory.push({ type: 'system', text: 'Available commands: help, whoami, clear, about, capabilities, sudo, neofetch, deploy-seo-sniper' });
                break;
            case 'whoami':
                newHistory.push({ type: 'system', text: 'uygpuazs (cPanel User)' });
                break;
            case 'clear':
                setHistory([]);
                setInput('');
                return;
            case 'about':
                newHistory.push({ type: 'system', text: 'Nurdiansyah Labs: We build high performance React applications and AI tools.' });
                break;
            case 'capabilities':
                newHistory.push(
                    { type: 'system', text: 'Checking AI Capabilities...' },
                    { type: 'system', text: '[OK] Fullstack Development (React/Vite, PHP, Python)' },
                    { type: 'system', text: '[OK] Machine Learning Integration' },
                    { type: 'system', text: '[OK] Secure Server Management' },
                    { type: 'system', text: '[OK] Easter Egg Generation 😉' }
                );
                break;
            case 'neofetch':
                newHistory.push(
                    { type: 'system', text: '       _,met$$$$$gg.          uygpuazs@waguri' },
                    { type: 'system', text: '    ,g$$$$$$$$$$$$$$$P.       ---------------' },
                    { type: 'system', text: '  ,g$$P"     """Y$$.".        OS: NurdiansyahOS x86_64' },
                    { type: 'system', text: ' ,$$P\'              `$$$.     Host: cPanel Terminal Environment' },
                    { type: 'system', text: ',$$P       ,ggs.     `$$b:    Kernel: 6.1.0-49-amd64' },
                    { type: 'system', text: '`d$$\'     ,$P"\'   .    $$$    Uptime: 99.99%' },
                    { type: 'system', text: ' $$P      d$\'     ,    $$P    Packages: 1000 (npm), 50 (composer)' },
                    { type: 'system', text: ' $$:      $$.   -    ,d$$\'    Shell: bash 5.2.15' },
                    { type: 'system', text: ' $$;      Y$b._   _,d$P\'      DE: React Desktop' },
                    { type: 'system', text: ' Y$$.    `.`"Y$$$$P"\'         WM: Framer Motion' },
                    { type: 'system', text: ' `$$b      "-.__              Terminal: lucide-react-term' }
                );
                break;
            case 'sudo':
                newHistory.push({ type: 'system', text: 'Nice try, but you are not in the sudoers file. This incident will be reported to Nurdiansyah.' });
                break;
            case 'deploy-seo-sniper':
                newHistory.push(
                    { type: 'system', text: '[WARNING] Initiating SEO Sniper Protocol v2.0...' },
                    { type: 'system', text: 'Connecting to Pollinations AI LLM Cluster... [OK]' },
                    { type: 'system', text: 'Bypassing WAF & spoofing Chrome User-Agent... [OK]' },
                    { type: 'system', text: 'Scanning Google Trends (geo=ID)... [Found: 5 viral keywords]' },
                    { type: 'system', text: 'Generating Long-Tail B2B Content...' },
                    { type: 'system', text: 'Injecting Schema.org JSON-LD Entities...' },
                    { type: 'system', text: 'Deploying Prerendered HTML payloads to Edge CDN...' },
                    { type: 'system', text: '[SUCCESS] Target Acquired. NurdiansyahLabs is now locked on Google Rank #1.' }
                );
                break;
            default:
                newHistory.push({ type: 'error', text: `bash: ${cmd}: command not found` });
        }

        setHistory(newHistory);
        setInput('');
        
        // Auto scroll
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        }, 50);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <m.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className="fixed bottom-6 right-6 w-[500px] h-[350px] bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-[9999] flex flex-col font-mono text-sm"
                >
                    {/* Header */}
                    <div className="bg-slate-800/80 flex items-center justify-between px-4 py-2 border-b border-slate-700">
                        <div className="flex items-center gap-2 text-slate-300">
                            <Terminal size={16} />
                            <span>cPanel Terminal - uygpuazs@waguri</span>
                        </div>
                        <button aria-label="Action button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Body */}
                    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-2 whitespace-pre-wrap font-mono text-xs md:text-sm">
                        {history.map((entry, i) => (
                            <div key={i} className={
                                entry.type === 'error' ? 'text-red-400' : 
                                entry.type === 'user' ? 'text-white font-semibold' : 'text-emerald-400'
                            }>
                                {entry.text}
                            </div>
                        ))}
                        <form onSubmit={handleCommand} className="flex items-center gap-2 mt-2">
                            <span className="text-blue-400 shrink-0">[uygpuazs@waguri ~]$</span>
                            <input aria-label="Form input"
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 bg-transparent outline-none border-none text-white focus:ring-0 p-0 text-xs md:text-sm"
                                autoFocus
                                spellCheck="false"
                                autoComplete="off"
                            />
                        </form>
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    );
}
