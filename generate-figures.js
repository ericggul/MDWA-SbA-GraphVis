#!/usr/bin/env node

/**
 * MDWA Research Figure Generator
 * Automatically generates all 8 figures as PNG files and saves them to the public folder
 * 
 * Usage: node generate-figures.js
 * 
 * Requirements: npm install puppeteer
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const figures = [
    { file: 'graphs/fig1.dot', name: 'fig1', title: 'Simple Interaction' },
    { file: 'graphs/fig2.dot', name: 'fig2', title: 'State-Based Architecture' },
    { file: 'graphs/fig3.dot', name: 'fig3', title: 'State-Based Architecture with Feedback' },
    { file: 'graphs/fig4.dot', name: 'fig4', title: 'Dimensional Transformation' },
    { file: 'graphs/fig5.dot', name: 'fig5', title: 'Multi-Device Architecture' },
    { file: 'graphs/fig6.dot', name: 'fig6', title: 'Feedback Architecture' },
    { file: 'graphs/fig7.dot', name: 'fig7', title: 'Complex Multi-System Architecture' },
    { file: 'graphs/fig8.dot', name: 'fig8', title: 'Economic DSGE System' }
];

async function generateAllFigures() {
    console.log('🚀 MDWA Research - Figure Generator');
    console.log('====================================');
    
    // Ensure public directory exists
    try {
        await fs.mkdir('public', { recursive: true });
        console.log('📁 Public directory ready');
    } catch (err) {
        console.error('❌ Error creating public directory:', err);
        return;
    }

    let browser;
    try {
        console.log('🌐 Launching browser...');
        browser = await puppeteer.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Navigate to the local server
        const indexUrl = 'http://localhost:8001/index.html';
        console.log(`📡 Connecting to ${indexUrl}`);
        
        try {
            await page.goto(indexUrl, { waitUntil: 'networkidle0', timeout: 10000 });
        } catch (err) {
            console.log('⚠️  Could not connect to localhost:8001, trying localhost:8000...');
            try {
                await page.goto('http://localhost:8000/index.html', { waitUntil: 'networkidle0', timeout: 10000 });
            } catch (err2) {
                console.error('❌ Could not connect to local server. Please start a server first.');
                console.log('💡 Try running: python -m http.server 8000');
                return;
            }
        }

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < figures.length; i++) {
            const figure = figures[i];
            console.log(`\n📊 Generating ${figure.name}: ${figure.title} (${i + 1}/${figures.length})`);
            
            try {
                // Select the figure from dropdown
                await page.select('#file-selector', figure.file);
                
                // Ensure PNG format is selected
                await page.select('#format select', 'png');
                
                // Wait for rendering to complete
                await page.waitForSelector('#review img', { timeout: 15000 });
                await page.waitForTimeout(2000); // Additional wait for complete rendering
                
                // Get the image data
                const imageData = await page.evaluate(() => {
                    const img = document.querySelector('#review img');
                    if (!img || !img.src) {
                        throw new Error('No image found');
                    }
                    return img.src;
                });
                
                // Save the image
                if (imageData.startsWith('data:image/png;base64,')) {
                    const base64Data = imageData.replace('data:image/png;base64,', '');
                    const buffer = Buffer.from(base64Data, 'base64');
                    const filename = `${figure.name}.png`;
                    const filepath = path.join('public', filename);
                    
                    await fs.writeFile(filepath, buffer);
                    console.log(`✅ Saved: ${filepath}`);
                    successCount++;
                } else {
                    throw new Error('Invalid image data format');
                }
                
            } catch (err) {
                console.error(`❌ Error generating ${figure.name}:`, err.message);
                errorCount++;
            }
        }
        
        console.log('\n📈 Generation Summary');
        console.log('====================');
        console.log(`✅ Success: ${successCount} figures`);
        console.log(`❌ Errors: ${errorCount} figures`);
        console.log(`📁 Output directory: ./public/`);
        
        if (successCount > 0) {
            console.log('\n🎉 Figures available at:');
            for (const figure of figures) {
                const filepath = path.join('public', `${figure.name}.png`);
                try {
                    await fs.access(filepath);
                    console.log(`   • ${filepath}`);
                } catch (err) {
                    // File doesn't exist, skip
                }
            }
        }

    } catch (err) {
        console.error('❌ Fatal error:', err);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function checkDependencies() {
    try {
        require('puppeteer');
        return true;
    } catch (err) {
        console.error('❌ Puppeteer not found. Please install it first:');
        console.log('   npm install puppeteer');
        return false;
    }
}

async function checkServer() {
    const { spawn } = require('child_process');
    
    return new Promise((resolve) => {
        const curl = spawn('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', 'http://localhost:8001']);
        
        curl.on('close', (code) => {
            if (code === 0) {
                resolve(true);
            } else {
                const curl8000 = spawn('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', 'http://localhost:8000']);
                curl8000.on('close', (code2) => {
                    resolve(code2 === 0);
                });
            }
        });
        
        curl.on('error', () => {
            resolve(false);
        });
    });
}

// Main execution
async function main() {
    if (!(await checkDependencies())) {
        return;
    }
    
    console.log('🔍 Checking for local server...');
    const serverRunning = await checkServer();
    
    if (!serverRunning) {
        console.log('⚠️  No local server detected. Starting one for you...');
        console.log('💡 If this fails, manually run: python -m http.server 8000');
        
        const { spawn } = require('child_process');
        const server = spawn('python', ['-m', 'http.server', '8001'], {
            detached: true,
            stdio: 'ignore'
        });
        
        server.unref();
        
        // Wait a moment for server to start
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    await generateAllFigures();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { generateAllFigures }; 