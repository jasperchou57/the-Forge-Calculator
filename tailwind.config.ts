import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
            },
            colors: {
                void: '#040404',
                surface: '#161719',
                'surface-highlight': '#1F2937',
                border: 'rgba(255, 255, 255, 0.08)',
                accent: {
                    blue: '#3B82F6',
                    indigo: '#6366F1',
                    cyan: '#06b6d4'
                },
                success: '#10B981',
                warning: '#F59E0B',
                error: '#EF4444',
            },
            backgroundImage: {
                'glow-gradient': 'radial-gradient(circle at center top, rgba(59, 130, 246, 0.15), transparent 60%)',
                'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
            }
        },
    },
    plugins: [],
};
export default config;
