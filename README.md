# ColorConsole 3000 Pro

A professional color palette generator and analyzer inspired by Dieter Rams' minimalist design philosophy. Built with Next.js, React, and TypeScript.

![ColorConsole](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

## 🎨 Features

- **Multiple Color Models**: Switch between OKLCH, RGB, and HSL color spaces
- **Harmonic Color Palettes**: Generate palettes using various harmony types:
  - Analogous
  - Monochromatic
  - Triad
  - Tetrad
  - Complementary
  - Split Complementary
- **Interactive Controls**:
  - Draggable faders for precise color adjustment
  - Interactive harmonic phase wheel
  - Effect processor knobs (Shadow, Glow, Grain, Vignette)
- **Real-time Color Analysis**: View color values in multiple formats (HEX, RGB, OKLCH, HSL, HSV, CMYK, P3)
- **Export Options**: Export palettes as JSON, SVG, or PNG
- **Spectral Matrix**: Visualize color palettes in a grid layout
- **Dieter Rams Aesthetic**: Minimalist, functional design with industrial hardware-inspired UI

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/loremipsum000/ColorPaletteSynth.git
cd ColorPaletteSynth
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Color Processing**: [Culori](https://culorijs.org/) - Advanced color manipulation library

## 📁 Project Structure

```
rams-color/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Main page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── ColorConsole.tsx    # Main application component
│   │   ├── color/             # Color-related components
│   │   │   ├── DataScreen.tsx
│   │   │   ├── DataRow.tsx
│   │   │   ├── GridVisualizer.tsx
│   │   │   └── HarmonyWheel.tsx
│   │   └── ui/                 # UI components
│   │       ├── Fader.tsx
│   │       ├── Knob.tsx
│   │       ├── PushButton.tsx
│   │       ├── Screw.tsx
│   │       └── icons.tsx
│   ├── lib/                # Utility functions
│   │   ├── color-utils.ts
│   │   └── constants.ts
│   └── types/              # TypeScript type definitions
│       └── culori.d.ts
├── public/                 # Static assets
├── tailwind.config.ts      # Tailwind configuration
└── package.json
```

## 🎯 Usage

### Color Adjustment

1. **Select Color Mode**: Choose between OKLCH, RGB, or HSL using the mode buttons
2. **Adjust Values**: Use the faders to adjust individual color channels
3. **Hex Input**: Type or paste a hex color value directly
4. **Random Color**: Click the refresh button to generate a random color

### Palette Generation

1. **Select Harmony Type**: Choose from the palette type buttons (ANA, MON, TRI, TET, COM, SPL)
2. **View Palette**: The Spectral Matrix displays your generated palette
3. **Harmonic Phase**: Drag the phase wheel to adjust hue relationships

### Effects

Adjust visual effects using the knobs:
- **Shadow**: Add depth with shadow effects
- **Glow**: Apply glow effects
- **Grain**: Add texture with grain
- **Vignette**: Darken edges with vignette

### Export

Export your color palette:
- **JSON**: Export color data as JSON
- **SVG**: Export as scalable vector graphics
- **PNG**: Export as raster image

## 🎨 Design Philosophy

This project is inspired by Dieter Rams' "10 Principles of Good Design":

- **Good design is innovative**
- **Good design makes a product useful**
- **Good design is aesthetic**
- **Good design makes a product understandable**
- **Good design is unobtrusive**
- **Good design is honest**
- **Good design is long-lasting**
- **Good design is thorough down to the last detail**
- **Good design is environmentally friendly**
- **Good design is as little design as possible**

The interface reflects these principles through:
- Minimalist, functional design
- Clear visual hierarchy
- Industrial hardware aesthetics
- Focus on usability over decoration

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by Dieter Rams' design philosophy
- Color processing powered by [Culori](https://culorijs.org/)
- Built with [Next.js](https://nextjs.org/) and [React](https://react.dev/)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/loremipsum000/ColorPaletteSynth/issues).

## 📧 Contact

[@loremipsum000](https://github.com/loremipsum000)

Project Link: [https://github.com/loremipsum000/ColorPaletteSynth](https://github.com/loremipsum000/ColorPaletteSynth)

---

Made with ❤️ and inspired by Dieter Rams
