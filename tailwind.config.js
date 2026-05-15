// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        // Base system colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // Reviuy Primary Colors
        reviuy: {
          primary: {
            50: 'var(--reviuy-primary-50)',
            100: 'var(--reviuy-primary-100)',
            200: 'var(--reviuy-primary-200)',
            300: 'var(--reviuy-primary-300)',
            400: 'var(--reviuy-primary-400)',
            500: 'var(--reviuy-primary-500)',
            600: 'var(--reviuy-primary-600)',
            700: 'var(--reviuy-primary-700)',
            800: 'var(--reviuy-primary-800)',
            900: 'var(--reviuy-primary-900)',
            950: 'var(--reviuy-primary-950)',
          },
          secondary: {
            50: 'var(--reviuy-secondary-50)',
            100: 'var(--reviuy-secondary-100)',
            200: 'var(--reviuy-secondary-200)',
            300: 'var(--reviuy-secondary-300)',
            400: 'var(--reviuy-secondary-400)',
            500: 'var(--reviuy-secondary-500)',
            600: 'var(--reviuy-secondary-600)',
            700: 'var(--reviuy-secondary-700)',
            800: 'var(--reviuy-secondary-800)',
            900: 'var(--reviuy-secondary-900)',
          },
          success: {
            50: 'var(--reviuy-success-50)',
            500: 'var(--reviuy-success-500)',
            600: 'var(--reviuy-success-600)',
            700: 'var(--reviuy-success-700)',
          },
          warning: {
            50: 'var(--reviuy-warning-50)',
            500: 'var(--reviuy-warning-500)',
            600: 'var(--reviuy-warning-600)',
            700: 'var(--reviuy-warning-700)',
          },
          error: {
            50: 'var(--reviuy-error-50)',
            500: 'var(--reviuy-error-500)',
            600: 'var(--reviuy-error-600)',
            700: 'var(--reviuy-error-700)',
          },
          gray: {
            50: 'var(--reviuy-gray-50)',
            100: 'var(--reviuy-gray-100)',
            200: 'var(--reviuy-gray-200)',
            300: 'var(--reviuy-gray-300)',
            400: 'var(--reviuy-gray-400)',
            500: 'var(--reviuy-gray-500)',
            600: 'var(--reviuy-gray-600)',
            700: 'var(--reviuy-gray-700)',
            800: 'var(--reviuy-gray-800)',
            900: 'var(--reviuy-gray-900)',
            950: 'var(--reviuy-gray-950)',
          },
        },

        // Legacy compatibility
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: 'var(--destructive)',

        // Sidebar colors
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },

        // Chart colors
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xs: 'var(--radius-xs)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
