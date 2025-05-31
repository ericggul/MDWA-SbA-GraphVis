# MDWA Figure Download System

## Quick Start

### Method 1: Web Interface (Recommended)
1. Start a local server:
   ```bash
   python -m http.server 8000
   ```
2. Open `http://localhost:8000/index.html`
3. Use the "Batch Download" link for automated downloads

### Method 2: Automated Script
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the generator:
   ```bash
   npm run generate
   ```

## Download Options

### Individual Downloads
- **Web Interface**: `index.html` → Select figure → Download (PNG default)
- **Batch Interface**: `download.html` → Generate All → Download All
- **Filenames**: Automatically named as `fig1.png`, `fig2.png`, etc.

### Automated Batch Download
The `generate-figures.js` script will:
- ✅ Generate all 8 figures as PNG files
- 📁 Save them to `./public/` directory
- 🔄 Auto-detect/start local server
- 📊 Show progress and summary

## Available Figures

| Figure | Title | Description |
|--------|-------|-------------|
| `fig1.png` | Simple Interaction | Basic input-output model |
| `fig2.png` | State-Based Architecture | SbA with four state types |
| `fig3.png` | SbA with Feedback | State-based with feedback loops |
| `fig4.png` | Dimensional Transformation | DT integration framework |
| `fig5.png` | Multi-Device Architecture | Multiple device interactions |
| `fig6.png` | Feedback Architecture | Advanced feedback systems |
| `fig7.png` | Complex Multi-System Architecture | Sophisticated multi-system design |
| `fig8.png` | Economic DSGE System | MDWA economic modeling framework |

## Technical Requirements

### Dependencies
- **Node.js** 16+ (for automated script)
- **Python** 3.x (for local server)
- **Modern browser** (for web interface)

### Optional Dependencies
- **Puppeteer** (auto-installed with `npm install`)
- **curl** (for server detection)

## File Structure
```
./
├── index.html              # Main visualization interface
├── download.html           # Batch download interface  
├── generate-figures.js     # Automated generation script
├── package.json           # Node.js dependencies
├── public/                # Generated PNG files
│   ├── fig1.png
│   ├── fig2.png
│   └── ...
└── graphs/                # Source DOT files
    ├── fig1.dot
    ├── fig2.dot
    └── ...
```

## Features

### ✅ Implemented
- PNG as default download format
- Proper figure naming (`fig1.png`, `fig2.png`, etc.)
- Web-based batch download interface
- Automated Node.js generation script
- Progress tracking and error handling
- Public folder organization

### 🎯 Research Integration
- Academic-quality PNG exports
- Consistent naming for thesis documentation
- Batch processing for efficient workflow
- Error reporting and validation
- Compatible with MDWA framework structure

## Usage Examples

### Quick Single Download
1. Open `index.html`
2. Select "Figure 4: Dimensional Transformation"  
3. Click download → `fig4.png` saved

### Batch Download via Web
1. Open `download.html`
2. Click "Generate All Figures"
3. Click "Download All" → All PNGs saved

### Automated Generation
```bash
# Install and generate all figures
npm install && npm run generate

# Or run manually
node generate-figures.js
```

## Troubleshooting

### Common Issues
- **Server not found**: Run `python -m http.server 8000` first
- **Permission errors**: Check write access to `./public/` folder
- **Missing figures**: Verify all `.dot` files exist in `./graphs/`

### Dependencies
- **Puppeteer fails**: Try `npm install puppeteer --unsafe-perm=true`
- **Python not found**: Use `python3 -m http.server 8000`

---

**MDWA PhD Research Repository**  
*Multi-Device Web Artwork: Interactive, Semantic, and Modular Systems Art*  
Jeanyoon Choi - Industrial Design Department 