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
      },
      // Góc bo tròn
      borderRadius: {
        button: '8px', // Bo góc cho nút
        input: '4px',  // Bo góc cho form input
      },
    },
  },
  plugins: [],
};

