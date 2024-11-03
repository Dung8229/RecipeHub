/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
      spacing: {
        '2': '8px',   // Padding và margin 8px
        '4': '16px',  // Padding và margin 16px
        '8': '32px',  // Padding và margin 32px
        '12': '48px', // Padding và margin 48px
        '16': '64px', // Padding và margin 64px
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.15)',
        'star': '0 0 0 10px #4fc3dc44'
      },
      dropShadow: {
        'star': '0 0 0 10px #4fc3dc44'
      },
      // Màu sắc chủ đạo
      colors: {
        primary: '#FFA726', // Cam nhạt cho các nút chính
        primaryHover: '#FB8C00', // Cam đậm cho hover và tiêu đề
        background: '#FFFFFF', // Trắng cho nền
        text: '#111827', // Màu chữ đen
        secondaryBackground: '#F5F5F5', // Xám nhạt cho nền phụ
      },
      // Font chữ
      fontFamily: {
        primary: ['Poppins', 'sans-serif'], // Font chính
        secondary: ['Roboto', 'sans-serif'], // Font phụ
      },
      // Kích thước font chữ (UI)
      fontSize: {
        h1: '32px', // Tiêu đề chính
        h2: '24px', // Tiêu đề phụ
        body: '16px', // Văn bản chính
        button: '18px', // Nút bấm
        xxs: '0.5rem',
      },
      // Góc bo tròn
      borderRadius: {
        button: '8px', // Bo góc cho nút
        input: '4px',  // Bo góc cho form input
      },
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        gradientMove: {  // Đã sửa lỗi ở đây
          '0%': { backgroundPosition: '0% 50%' }, // Sử dụng backgroundPosition
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "tranlate(0px, 0px) scale(1)",
          },
        },
        'star': {
          "0%": {
            transform: "translateY(100vh) scale(1)",
          },
          "100%": {
            transform: "translateY(-10vh) scale(0)",
          },
        }
      },
      animation: {
        progress: 'progress 2s ease-out forwards',
        gradientMove: 'gradientMove 10s linear infinite',
        blob: "blob 7s infinite",
        star15: "star 15s linear infinite",
        star16: "star 16s linear infinite",
        star17: "star 17s linear infinite",
        star18: "star 18s linear infinite",
        star19: "star 19s linear infinite",
        star20: "star 20s linear infinite",
      },
      transitionDuration: {
        '15000': '15000ms',
        '16000': '16000ms',
        '17000': '17000ms',
        '18000': '18000ms',
        '19000': '19000ms',
        '20000': '20000ms',
      }
    },
  },
  plugins: [],
};

