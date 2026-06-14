# Tap Reactor 🎮

**A fast-paced mobile arcade reflex game by ST Studio**

Version: 1.0.0  
Created by: Sahil Thakur  
Studio: ST Studio

---

## 🎯 Overview

Tap Reactor is a production-ready mobile arcade game designed for Play Store release. The game combines fast-paced gameplay with smooth performance on low-end devices, featuring multiple game modes and addictive mechanics.

**Core Features:**
- 4 unique game modes (Tap, Color Challenge, Danger, Survival)
- Combo multiplier system
- Progressive difficulty
- Local high score tracking
- Statistics and settings
- Smooth animations and visual effects
- 60 FPS stable performance

---

## 📱 Game Modes

### Tap Mode
Tap glowing colored circles to score points. Simple, fast-paced, perfect for beginners.

### Color Challenge Mode
Follow color instructions! "TAP BLUE" - tap only blue circles to earn points.

### Danger Mode
Black objects appear and penalize you if tapped. Avoid them while scoring on colored objects.

### Survival Mode
Intensity increases over time with more objects, faster spawns, and higher danger rates.

---

## 🎮 Gameplay

- **Duration**: 30 seconds per round
- **Lives**: 3 lives per game
- **Scoring**: 1 point per tap + combo multiplier
- **Combo**: Increases multiplier (1.1x per combo)
- **Danger**: -5 points + combo reset

---

## 🎨 Design

- **Style**: Modern neon arcade futuristic
- **Theme**: Dark navy background with neon blue, green, yellow, purple, and red colors
- **Responsive**: Works on all screen sizes (mobile-first)
- **Performance**: Optimized for 60 FPS on low-end devices

---

## 📋 Project Structure

```
tap-reactor/
├── index.html              # Main HTML entry point
├── css/
│   ├── styles.css         # Main stylesheet
│   └── animations.css     # Animation definitions
├── js/
│   ├── config.js          # Game configuration
│   ├── storage-manager.js # Local storage handling
│   ├── audio-manager.js   # Sound effects and audio
│   ├── particle-system.js # Visual particle effects
│   ├── game-object.js     # Game object class
│   ├── game-engine.js     # Core game logic
│   ├── ui-manager.js      # UI and navigation
│   └── main.js            # Application entry point
├── assets/
│   ├── images/            # Game images
│   ├── sounds/            # Audio files
│   └── fonts/             # Custom fonts
├── README.md              # This file
├── .gitignore             # Git ignore rules
└── package.json           # Project metadata
```

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser with ES6 support
- Local web server (for testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/st18571857-dev/tap-reactor.git
```

2. Navigate to the project:
```bash
cd tap-reactor
```

3. Start a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using Live Server (VS Code)
Open with Live Server
```

4. Open in browser:
```
http://localhost:8000
```

---

## 🎮 Controls

- **Tap/Click**: Tap objects to score points
- **Pause**: Click pause button (⏸) or press ESC
- **Resume**: Click resume button
- **Menu Navigation**: Use buttons to navigate screens

---

## ⚙️ Configuration

Game settings can be modified in `js/config.js`:

```javascript
// Game Duration
GAME_DURATION: 30 // seconds

// Initial Lives
INITIAL_LIVES: 3

// Spawn Rate
SPAWN_RATE_START: 1000 // milliseconds

// Scoring
POINTS.TAP_TARGET: 1
POINTS.COMBO_MULTIPLIER: 1.1
```

---

## 🔊 Audio

The game uses Web Audio API for synthesized sounds:
- **Tap Sound**: 800Hz → 600Hz pitch
- **Success Sound**: 1200Hz → 1600Hz pitch
- **Danger Sound**: 400Hz → 200Hz pitch
- **Combo Sound**: Multi-frequency burst
- **Game Over Sound**: Descending frequencies

All sounds can be toggled in Settings.

---

## 💾 Data Storage

Tap Reactor saves data locally using browser localStorage:
- **High Scores**: Top 10 scores per mode
- **Statistics**: Games played, total score, best combo, etc.
- **Settings**: Sound, music, vibration preferences

No external servers or accounts required.

---

## 🎯 Performance

- **Target FPS**: 60 FPS
- **Load Time**: < 3 seconds
- **Memory Efficient**: Object pooling and reuse
- **Mobile Optimized**: Works on low-end Android devices
- **No External Dependencies**: Pure vanilla JavaScript

---

## 🧪 Testing

### Browser Testing
- Chrome/Chromium
- Firefox
- Safari
- Edge
- Mobile browsers (Chrome, Safari, Firefox Android)

### Device Testing
- Desktop (1920x1080, 1366x768, 1024x768)
- Tablet (iPad, Android tablets)
- Mobile (iPhone, Android phones)

---

## 📦 Build & Deployment

### Web Deployment
1. Upload files to web server
2. Ensure proper MIME types
3. Enable HTTPS for production

### Play Store Deployment
1. Build with Cordova/Capacitor
2. Generate signed APK/AAB
3. Upload to Play Store
4. Ensure compliance with Play Store policies

---

## 🛠️ Development

### Code Style
- ES6+ JavaScript
- Class-based architecture
- Clear separation of concerns
- Comprehensive comments

### Adding Features
1. Update `CONFIG` in `js/config.js`
2. Modify game logic in `GameEngine` class
3. Add UI in `index.html`
4. Style with CSS
5. Test thoroughly

---

## 🐛 Bug Reports

For bug reports and feature requests, please open an issue on GitHub.

---

## 📄 License

Copyright © ST Studio. All rights reserved.

---

## 🙏 Credits

**Developer**: Sahil Thakur  
**Studio**: ST Studio  
**Game Design**: Fast-paced arcade mechanics  
**Inspiration**: Classic arcade games

---

## 📞 Contact

For inquiries or business opportunities:
- **Studio**: ST Studio
- **Email**: contact@ststudio.com

---

**Enjoy playing Tap Reactor! 🎮⚡**
