// --- Static Game Library Configuration ---
const gameLibrary = [
    {
        id: 'mario3',
        name: 'Super Mario Bros. 3',
        platform: 'NES',
        core: 'nes',
        genre: 'Platformer',
        file: 'nes_super_mario_bros_3.nes',
        desc: 'Guide Mario and Luigi through eight diverse worlds to rescue Princess Peach from Bowser and his Koopaling children.',
        icon: '🍄'
    },
    {
        id: 'marioworld',
        name: 'Super Mario World + All-Stars',
        platform: 'SNES',
        core: 'snes',
        genre: 'Platformer',
        file: 'snes_super_mario_all_stars.sfc',
        desc: 'A super collection containing remakes of Super Mario Bros 1, 2, 3, and Lost Levels, plus the legendary Super Mario World adventure!',
        icon: '🦕'
    },
    {
        id: 'mariokart',
        name: 'Super Mario Kart',
        platform: 'SNES',
        core: 'snes',
        genre: 'Racing',
        file: 'snes_super_mario_kart.sfc',
        desc: 'The original Mario kart racer. Zoom around courses using shells, bananas, and mushrooms to defeat your opponents.',
        icon: '🏎️'
    },
    {
        id: 'donkeykong',
        name: 'Donkey Kong Country',
        platform: 'SNES',
        core: 'snes',
        genre: 'Platformer',
        file: 'snes_donkey_kong_country.smc',
        desc: 'Help Donkey Kong and Diddy Kong recover their stolen banana hoard from the villainous King K. Rool.',
        icon: '🦍'
    },
    {
        id: 'mortalkombat',
        name: 'Ultimate Mortal Kombat 3',
        platform: 'SNES',
        core: 'snes',
        genre: 'Fighting',
        file: 'snes_ultimate_mortal_kombat_3.sfc',
        desc: 'Choose your fighter and engage in brutal kombat with fatalities, friendships, babalities, and stage finishers.',
        icon: '🩸'
    },
    {
        id: 'sonic1',
        name: 'Sonic The Hedgehog',
        platform: 'Genesis',
        core: 'segaMD',
        genre: 'Platformer',
        file: 'genesis_sonic_hedgehog.md',
        desc: 'Run at supersonic speeds, collect rings, and defeat Dr. Robotnik to free the captured animal friends.',
        icon: '🦔'
    },
    {
        id: 'streetsrage',
        name: 'Streets of Rage 3',
        platform: 'Genesis',
        core: 'segaMD',
        genre: 'Beat \'Em Up',
        file: 'genesis_streets_of_rage_3.md',
        desc: 'Axel, Blaze, and Skate return along with newcomers to punch and kick their way through syndicate crime bosses.',
        icon: '👊'
    },
    {
        id: 'pokemongold',
        name: 'Pokemon Gold Version',
        platform: 'GBC',
        core: 'gba',
        genre: 'RPG',
        file: 'gbc_pokemon_gold.gbc',
        desc: 'Explore the Johto region, capture 250 pocket monsters, earn 8 gym badges, and challenge the Elite Four.',
        icon: '⚡'
    },
    {
        id: 'zeldagb',
        name: 'Zelda: Link\'s Awakening',
        platform: 'Game Boy',
        core: 'gb',
        genre: 'Adventure',
        file: 'gb_zelda_links_awakening.gb',
        desc: 'After a storm wrecks his ship, Link washes ashore on Koholint Island. Collect the 8 Instruments of the Sirens to awaken the Wind Fish.',
        icon: '🛡️'
    },
    {
        id: 'nes1200',
        name: '1200-in-1 Retro Collection',
        platform: 'NES',
        core: 'nes',
        genre: 'Multi-game',
        file: 'nes_1200_in_1.nes',
        desc: 'A massive Japanese multicart containing hundreds of classic Famicom and NES micro-games.',
        icon: '📼'
    }
];

// --- Global UI State ---
let resourceName = 'tatitup-zwitch';
let currentSection = 'home';
let selectedGameIndex = 0;
let selectedSystemIndex = 0;
let activeSystemFilter = null;
let activeFocus = 'content'; // 'content' or 'navbar'
let systemVolume = 50; // out of 100
let emulatorRunning = false;
let bootCompleted = false;

// Systems configuration
const systemsList = [
    { id: 'nes', name: 'Nintendo Entertainment System', brand: 'Nintendo', logo: '🍄', characterEmoji: '🍄', consoleImg: 'nes_console.png', bgGradient: 'linear-gradient(135deg, rgba(230, 0, 18, 0.22) 0%, transparent 60%)' },
    { id: 'snes', name: 'Super Nintendo Entertainment System', brand: 'Super Nintendo', logo: '🦖', characterEmoji: '🦖', consoleImg: 'snes_console.jpg', bgGradient: 'linear-gradient(135deg, rgba(0, 125, 214, 0.22) 0%, transparent 60%)' },
    { id: 'sega', name: 'Sega Genesis / Mega Drive', brand: 'Sega Mega Drive', logo: '🦔', characterEmoji: '🦔', consoleImg: 'sega_console.png', bgGradient: 'linear-gradient(135deg, rgba(0, 47, 190, 0.22) 0%, transparent 60%)' },
    { id: 'gb', name: 'Nintendo Game Boy Classic', brand: 'Nintendo GB', logo: '📟', characterEmoji: '📟', consoleImg: 'gb_console.png', bgGradient: 'linear-gradient(135deg, rgba(46, 204, 113, 0.22) 0%, transparent 60%)' },
    { id: 'gbc', name: 'Nintendo Game Boy Color / Advance', brand: 'GBA / GBC', logo: '⚡', characterEmoji: '⚡', consoleImg: 'gba_console.png', bgGradient: 'linear-gradient(135deg, rgba(241, 196, 15, 0.22) 0%, transparent 60%)' }
];

// Helper to filter gameLibrary based on active system filter or explicit systemId
function getFilteredGames(systemId) {
    const filter = systemId || activeSystemFilter;
    if (!filter) return gameLibrary;
    return gameLibrary.filter(game => {
        if (filter === 'sega') return game.core === 'segaMD';
        if (filter === 'gbc') return game.core === 'gbc' || game.core === 'gba';
        return game.core === filter;
    });
}

// Audio Context for Synthesizer Beeps (No static files needed!)
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
}

// Synthesize Custom Retro Beep
function playBeep(freq = 600, duration = 0.08) {
    if (systemVolume <= 0) return;
    initAudio();
    if (!audioCtx) return;

    try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now);
        
        gainNode.gain.setValueAtTime((systemVolume / 100) * 0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration);
    } catch (e) {
        console.error("Audio synth error:", e);
    }
}

// Synthesize Nintendo-like Console Boot Sound
function playBootSound() {
    if (systemVolume <= 0) return;
    initAudio();
    if (!audioCtx) return;

    try {
        const now = audioCtx.currentTime;
        
        // High Ping note 1
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.35); // C6
        gain1.gain.setValueAtTime((systemVolume / 100) * 0.15, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        
        // Harmonizing Ping note 2
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.45); // E6
        gain2.gain.setValueAtTime((systemVolume / 100) * 0.12, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);

        osc1.start(now);
        osc1.stop(now + 0.4);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.5);
    } catch (e) {
        console.error("Audio boot sound error:", e);
    }
}

// --- Clock Update ---
function updateClock() {
    const clockEl = document.getElementById('status-clock');
    if (!clockEl) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    clockEl.innerText = `${hours}:${minutes} ${ampm}`;
}
setInterval(updateClock, 30000);
updateClock();

// --- Boot Sequence Handler ---
const bootLines = [
    "[    0.000000] Booting ZWITCH OS kernel...",
    "[    0.180291] Initializing CPU Core emulation... OK",
    "[    0.342125] GPU: Nvidia Tegra X1 Emulation Layer... Mounted",
    "[    0.550182] BIOS pack detected: TDTMEDIA_CONSOLE_BIOS_Pack... Verified",
    "[    0.710921] Loading System BIOS: bios/gba_bios.bin (16KB)... Loaded",
    "[    0.892011] Mounting ROM storage partition (roms/)... OK",
    "[    1.092812] Found 10 bundled game ROMs...",
    "[    1.250419] Launching Frontend Interface: ZWITCH OS (Alekfull NX)..."
];

function runBootSequence(callback) {
    const logsEl = document.getElementById('boot-logs');
    const logoEl = document.getElementById('boot-logo-zone');
    const bootScreen = document.getElementById('boot-screen');
    
    logsEl.innerHTML = "";
    logoEl.style.display = "none";
    bootScreen.style.display = "block";
    
    let currentLine = 0;
    
    function printNextLine() {
        if (currentLine < bootLines.length) {
            logsEl.innerHTML += bootLines[currentLine] + "\n";
            playBeep(250 + (currentLine * 60), 0.04);
            currentLine++;
            setTimeout(printNextLine, 120 + Math.random() * 150);
        } else {
            // Fade logs and show the logo boot screen
            setTimeout(() => {
                logsEl.style.display = "none";
                logoEl.style.display = "flex";
                playBootSound();
                
                // Final boot load complete
                setTimeout(() => {
                    bootScreen.style.display = "none";
                    logsEl.style.display = "block"; // reset for next boot
                    bootCompleted = true;
                    callback();
                }, 1800);
            }, 500);
        }
    }
    
    setTimeout(printNextLine, 300);
}

// --- Menu Navigation Controls ---
function switchSection(sectionId) {
    if (sectionId === 'shutdown') {
        closeConsole();
        return;
    }
    
    playBeep(480, 0.06);
    currentSection = sectionId;
    
    // Update active bottom bar elements
    document.querySelectorAll('.nav-icon-wrapper').forEach(item => {
        if (item.getAttribute('data-target') === sectionId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update the action bar caption
    const captionEl = document.getElementById('nav-bar-caption');
    if (captionEl) {
        if (sectionId === 'home') captionEl.innerText = "System Menu";
        else if (sectionId === 'games') captionEl.innerText = "Game Library";
        else if (sectionId === 'settings') captionEl.innerText = "System Settings";
    }
    
    // Update content panel sections
    document.querySelectorAll('.panel-section').forEach(section => {
        if (section.id === `panel-${sectionId}`) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    if (sectionId === 'games') {
        selectedGameIndex = 0;
        renderGamesList();
    } else if (sectionId === 'home') {
        updateBackdrop();
    } else {
        // Clear backdrop on settings
        const backdrop = document.getElementById('system-backdrop');
        if (backdrop) {
            backdrop.style.backgroundImage = 'none';
            backdrop.style.background = 'transparent';
            backdrop.innerHTML = '';
        }
    }
}

// Update background graphics dynamically based on system selected
function updateBackdrop() {
    if (currentSection !== 'home') return;
    
    const sys = systemsList[selectedSystemIndex];
    if (!sys) return;

    const backdrop = document.getElementById('system-backdrop');
    if (backdrop) {
        backdrop.style.background = sys.bgGradient;
        if (sys.consoleImg) {
            backdrop.innerHTML = `<img class="backdrop-image" src="${sys.consoleImg}" />`;
        } else {
            backdrop.innerHTML = `<div class="backdrop-character">${sys.characterEmoji}</div>`;
        }
        
        // Add style keyframe dynamically if not existing
        if (!document.getElementById('float-anim-style')) {
            const style = document.createElement('style');
            style.id = 'float-anim-style';
            style.innerHTML = `
                @keyframes floatCharacter {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-12px) rotate(2deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Handle highlighting systems on Home Screen
function selectSystem(index) {
    if (index < 0) index = 0;
    if (index >= systemsList.length) index = systemsList.length - 1;
    
    if (selectedSystemIndex !== index) {
        selectedSystemIndex = index;
        playBeep(520, 0.05);
        
        // Update DOM highlight
        document.querySelectorAll('.system-card').forEach((card, idx) => {
            if (idx === index) {
                card.classList.add('active');
                card.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
            } else {
                card.classList.remove('active');
            }
        });
        
        // Update Details View
        const sys = systemsList[index];
        const count = getFilteredGames(sys.id).length;
        
        document.getElementById('system-details-view').innerHTML = `
            <div class="system-full-name">${sys.name}</div>
            <div class="system-game-count">${count} Games Available</div>
        `;
        
        updateBackdrop();
    }
}

// Render games list as a horizontal carousel
function renderGamesList() {
    const container = document.getElementById('games-carousel-view');
    if (!container) return;
    
    container.innerHTML = "";
    
    const filteredGames = getFilteredGames();
        
    // Update active filter badge label
    const badge = document.getElementById('active-filter-badge');
    if (badge) {
        if (activeSystemFilter) {
            const sys = systemsList.find(s => s.id === activeSystemFilter);
            badge.innerText = sys ? `${sys.brand} Games` : "Filtered";
            badge.style.display = "inline-block";
        } else {
            badge.innerText = "All Systems";
        }
    }

    if (filteredGames.length === 0) {
        container.innerHTML = `<div style="color:#666;font-size:11px;padding:20px;">No games available for this system. Press Back to exit filter.</div>`;
        document.getElementById('preview-title').innerText = "Empty System";
        document.getElementById('preview-platform').innerText = "-";
        document.getElementById('preview-genre').innerText = "-";
        document.getElementById('preview-desc').innerText = "No games found under this system filter.";
        return;
    }

    if (selectedGameIndex >= filteredGames.length) {
        selectedGameIndex = 0;
    }

    filteredGames.forEach((game, index) => {
        const gameCard = document.createElement('div');
        gameCard.className = `game-card ${index === selectedGameIndex ? 'active' : ''}`;
        gameCard.innerHTML = `
            <div class="game-card-icon">${game.icon}</div>
            <div class="game-card-name">${game.name}</div>
        `;
        
        gameCard.addEventListener('click', () => {
            selectGame(index);
        });
        
        container.appendChild(gameCard);
    });
    
    updateGameDetail(filteredGames);
}

function selectGame(index) {
    const filteredGames = getFilteredGames();
        
    if (index < 0) index = 0;
    if (index >= filteredGames.length) index = filteredGames.length - 1;
    
    if (selectedGameIndex !== index) {
        selectedGameIndex = index;
        playBeep(520, 0.05);
        
        // Update horizontal highlights
        document.querySelectorAll('.game-card').forEach((card, idx) => {
            if (idx === index) {
                card.classList.add('active');
                card.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
            } else {
                card.classList.remove('active');
            }
        });
        
        updateGameDetail(filteredGames);
    }
}

function updateGameDetail(filteredGamesList) {
    const list = filteredGamesList || getFilteredGames();
        
    const game = list[selectedGameIndex];
    if (!game) return;
    
    document.getElementById('preview-title').innerText = game.name;
    document.getElementById('preview-platform').innerText = game.platform;
    document.getElementById('preview-genre').innerText = game.genre;
    document.getElementById('preview-desc').innerText = game.desc;
}

// --- Emulator Launch & Destroy handlers ---
function launchGame(game) {
    if (emulatorRunning) return;
    
    playBeep(800, 0.12);
    emulatorRunning = true;
    
    // Formulate local path using NUI streaming format
    let romUrl = `../roms/${encodeURIComponent(game.file)}`;
    
    // If it's a blob (custom drag-and-dropped file)
    if (game.blobUrl) {
        romUrl = game.blobUrl;
    }

    const gameContainer = document.getElementById('gameplay-screen');
    gameContainer.innerHTML = "";
    
    // Spawn isolated iframe
    const iframe = document.createElement('iframe');
    iframe.setAttribute('allow', 'gamepad; autoplay');
    iframe.src = `emulator.html?rom=${encodeURIComponent(romUrl)}&core=${game.core}&resource=${resourceName}`;
    
    // Sync settings to iframe localStorage when loaded
    iframe.onload = () => {
        // Focus the iframe and contentWindow so keyboard and gamepad inputs are routed correctly
        iframe.focus();
        if (iframe.contentWindow) {
            iframe.contentWindow.focus();
        }
        
        try {
            const iframeStorage = iframe.contentWindow.localStorage;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && !key.startsWith('zwitch_')) {
                    iframeStorage.setItem(key, localStorage.getItem(key));
                }
            }
        } catch (e) {
            console.error("Failed to sync localStorage to iframe:", e);
        }
    };

    gameContainer.appendChild(iframe);
    
    gameContainer.style.display = 'block';
    
    // Light LED up orange when emulation runs
    const led = document.getElementById('led-indicator');
    led.style.backgroundColor = '#ff9900';
    led.style.boxShadow = '0 0 8px #ff9900';
}

function exitEmulator() {
    if (!emulatorRunning) return;
    
    playBeep(350, 0.1);
    emulatorRunning = false;
    
    // Backup EJS settings on exit
    backupEjsSettings();
    
    const gameContainer = document.getElementById('gameplay-screen');
    gameContainer.innerHTML = "";
    gameContainer.style.display = 'none';
    
    // Reset LED color back to green
    const led = document.getElementById('led-indicator');
    led.style.backgroundColor = '#00ff66';
    led.style.boxShadow = '0 0 6px #00ff66';
}

// Close NUI Console and tell FiveM Client
function closeConsole() {
    playBeep(300, 0.08);
    exitEmulator();
    bootCompleted = false; // Reset boot for next spawn
    
    fetch(`https://${resourceName}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
}

// --- Key Listeners (Switch horizontal navigation support) ---
window.addEventListener('keydown', (event) => {
    if (!bootCompleted) return;
    
    if (emulatorRunning) {
        // Forward keydown event to the emulator iframe
        const iframe = document.querySelector('#gameplay-screen iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'keydown',
                key: event.key,
                keyCode: event.keyCode,
                code: event.code,
                which: event.which,
                shiftKey: event.shiftKey,
                ctrlKey: event.ctrlKey,
                altKey: event.altKey,
                metaKey: event.metaKey
            }, '*');
            
            // Prevent default browser behaviors like scrolling or built-in hotkeys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Escape', 'F1'].includes(event.key)) {
                event.preventDefault();
            }
        }
        return;
    }

    if (event.key === 'Tab') {
        event.preventDefault();
        fetch(`https://${resourceName}/toggleMouse`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        }).catch(err => console.log("Failed to toggle mouse:", err));
        return;
    }

    if (event.key === 'Escape') {
        if (currentSection === 'games' && activeSystemFilter) {
            // Exit filter back to home carousel
            activeSystemFilter = null;
            switchSection('home');
        } else {
            closeConsole();
        }
        return;
    }

    const navItems = ['home', 'games', 'settings'];
    let navIdx = navItems.indexOf(currentSection);

    // Switch Navigation modes (Up/Down between content and navbar)
    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
        if (activeFocus === 'content') {
            activeFocus = 'navbar';
            playBeep(450, 0.04);
            // Highlight active bottom nav icon
            document.querySelectorAll('.nav-icon-wrapper').forEach(item => {
                if (item.getAttribute('data-target') === currentSection) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            return;
        }
    }
    
    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
        if (activeFocus === 'navbar') {
            activeFocus = 'content';
            playBeep(450, 0.04);
            // Remove highlighted active states from navbar icon unless it's the current section
            document.querySelectorAll('.nav-icon-wrapper').forEach(item => {
                if (item.getAttribute('data-target') === currentSection) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            return;
        }
    }

    // Horizontal navigation inside Content Area
    if (activeFocus === 'content') {
        if (currentSection === 'home') {
            if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
                if (selectedSystemIndex > 0) {
                    selectSystem(selectedSystemIndex - 1);
                }
            } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
                if (selectedSystemIndex < systemsList.length - 1) {
                    selectSystem(selectedSystemIndex + 1);
                }
            } else if (event.key === 'Enter') {
                // Enter filters library and goes there
                activeSystemFilter = systemsList[selectedSystemIndex].id;
                selectedGameIndex = 0;
                switchSection('games');
            }
        } 
        else if (currentSection === 'games') {
            const filteredGames = getFilteredGames();

            if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
                if (selectedGameIndex > 0) {
                    selectGame(selectedGameIndex - 1);
                }
            } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
                if (selectedGameIndex < filteredGames.length - 1) {
                    selectGame(selectedGameIndex + 1);
                }
            } else if (event.key === 'Enter') {
                if (filteredGames[selectedGameIndex]) {
                    launchGame(filteredGames[selectedGameIndex]);
                }
            }
        }
    } 
    // Navigation inside Bottom Menu Bar
    else if (activeFocus === 'navbar') {
        if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
            if (navIdx > 0) {
                // Highlight left nav icon
                const target = navItems[navIdx - 1];
                document.querySelectorAll('.nav-icon-wrapper').forEach(item => {
                    if (item.getAttribute('data-target') === target) item.classList.add('active');
                    else item.classList.remove('active');
                });
                switchSection(target);
            }
        } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
            if (navIdx < navItems.length - 1) {
                // Highlight right nav icon
                const target = navItems[navIdx + 1];
                document.querySelectorAll('.nav-icon-wrapper').forEach(item => {
                    if (item.getAttribute('data-target') === target) item.classList.add('active');
                    else item.classList.remove('active');
                });
                switchSection(target);
            }
        } else if (event.key === 'Enter') {
            activeFocus = 'content';
            playBeep(500, 0.05);
        }
    }
});

window.addEventListener('keyup', (event) => {
    if (emulatorRunning) {
        // Forward keyup event to the emulator iframe
        const iframe = document.querySelector('#gameplay-screen iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
                type: 'keyup',
                key: event.key,
                keyCode: event.keyCode,
                code: event.code,
                which: event.which,
                shiftKey: event.shiftKey,
                ctrlKey: event.ctrlKey,
                altKey: event.altKey,
                metaKey: event.metaKey
            }, '*');
            
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Escape', 'F1'].includes(event.key)) {
                event.preventDefault();
            }
        }
    }
});

// Listen to messages from sandbox iframe
window.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'exitGame') {
        exitEmulator();
    }
});

// Helper to apply the console body theme
function applyTheme(themeValue) {
    const device = document.querySelector('.handheld-device');
    if (!device) return;
    
    // Remove old theme classes
    device.classList.remove(
        'theme-classic-gray', 'theme-atomic-purple', 'theme-cyber-pink', 'theme-glacier-white', 
        'theme-custom-casing', 'theme-custom-casing-2', 'theme-custom-casing-3', 'theme-custom-casing-4', 
        'theme-custom-casing-5', 'theme-custom-casing-6', 'theme-custom-casing-7', 'theme-custom-casing-8', 
        'theme-custom-casing-9', 'theme-custom-casing-10', 'theme-custom-casing-11'
    );
    
    // Add new class
    device.classList.add(`theme-${themeValue}`);
    
    // Sync the dropdown menu selection
    const themeSelect = document.getElementById('setting-theme');
    if (themeSelect) {
        themeSelect.value = themeValue;
    }
}

// Helper to save settings to FiveM client KVPs and fallback to localStorage
function saveSetting(key, value) {
    fetch(`https://${resourceName}/saveSetting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key, value: value })
    }).catch(err => console.log(`Failed to save setting ${key} via KVP:`, err));
    
    localStorage.setItem(`zwitch_${key}`, value);
}

// Backup all EmulatorJS configuration keys to client KVPs
function backupEjsSettings() {
    if (!resourceName) return;
    const ejsSettings = {};
    
    // First, try reading from the iframe's localStorage if available
    let sourceStorage = localStorage;
    const gameContainer = document.getElementById('gameplay-screen');
    if (gameContainer) {
        const iframe = gameContainer.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            try {
                sourceStorage = iframe.contentWindow.localStorage;
            } catch (e) {
                console.log("Failed to access iframe localStorage, falling back to parent:", e);
            }
        }
    }

    for (let i = 0; i < sourceStorage.length; i++) {
        const key = sourceStorage.key(i);
        if (key && !key.startsWith('zwitch_')) {
            const value = sourceStorage.getItem(key);
            ejsSettings[key] = value;
            // Sync it back to parent localStorage too so it's cached locally
            localStorage.setItem(key, value);
        }
    }
    saveSetting('ejs_settings', JSON.stringify(ejsSettings));
}

// Periodically backup EJS settings (every 10 seconds) if emulator is running
setInterval(() => {
    if (emulatorRunning) {
        backupEjsSettings();
    }
}, 10000);

// --- Initialize Settings Listeners ---
function setupSettings() {
    const crtToggle = document.getElementById('setting-crt');
    const volumeSlider = document.getElementById('setting-volume');
    const themeSelect = document.getElementById('setting-theme');
    
    // CRT Toggle
    crtToggle.addEventListener('change', (e) => {
        const overlay = document.querySelector('.crt-overlay');
        overlay.style.display = e.target.checked ? 'block' : 'none';
        playBeep(600, 0.05);
        saveSetting('crt', e.target.checked);
    });

    // Volume Slider
    volumeSlider.addEventListener('input', (e) => {
        systemVolume = e.target.value;
    });
    volumeSlider.addEventListener('change', (e) => {
        playBeep(600, 0.08);
        saveSetting('volume', e.target.value);
    });

    // Theme Customizer
    themeSelect.addEventListener('change', (e) => {
        applyTheme(e.target.value);
        playBeep(700, 0.08);
        saveSetting('theme', e.target.value);
    });

    // Prop Offsets Calibration
    const offsetX = document.getElementById('setting-offset-x');
    const offsetY = document.getElementById('setting-offset-y');
    const offsetZ = document.getElementById('setting-offset-z');
    const offsetRX = document.getElementById('setting-offset-rx');
    const offsetRY = document.getElementById('setting-offset-ry');
    const offsetRZ = document.getElementById('setting-offset-rz');
    
    const valX = document.getElementById('val-offset-x');
    const valY = document.getElementById('val-offset-y');
    const valZ = document.getElementById('val-offset-z');
    const valRX = document.getElementById('val-offset-rx');
    const valRY = document.getElementById('val-offset-ry');
    const valRZ = document.getElementById('val-offset-rz');
    
    function sendOffsetsUpdate() {
        valX.innerText = offsetX.value;
        valY.innerText = offsetY.value;
        valZ.innerText = offsetZ.value;
        valRX.innerText = offsetRX.value + "°";
        valRY.innerText = offsetRY.value + "°";
        valRZ.innerText = offsetRZ.value + "°";
        
        fetch(`https://${resourceName}/updateOffset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                x: parseFloat(offsetX.value),
                y: parseFloat(offsetY.value),
                z: parseFloat(offsetZ.value),
                rx: parseFloat(offsetRX.value),
                ry: parseFloat(offsetRY.value),
                rz: parseFloat(offsetRZ.value)
            })
        }).catch(err => console.log("Failed to send offset update:", err));
    }
    
    [offsetX, offsetY, offsetZ, offsetRX, offsetRY, offsetRZ].forEach(slider => {
        if (slider) slider.addEventListener('input', sendOffsetsUpdate);
    });
    
    const resetBtn = document.getElementById('btn-reset-offsets');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (offsetX) offsetX.value = 0.14;
            if (offsetY) offsetY.value = -0.01;
            if (offsetZ) offsetZ.value = -0.03;
            if (offsetRX) offsetRX.value = -65;
            if (offsetRY) offsetRY.value = 180;
            if (offsetRZ) offsetRZ.value = 75;
            playBeep(600, 0.08);
            sendOffsetsUpdate();
        });
    }
}

// --- Listen for messages from FiveM client ---
window.addEventListener('message', (event) => {
    const data = event.data;
    
    if (data.action === "openConsole") {
        resourceName = data.resourceName || 'tatitup-zwitch';
        
        // Restore EJS settings from client KVPs first
        const savedEjs = data.ejsSettings || localStorage.getItem('zwitch_ejs_settings');
        if (savedEjs) {
            try {
                const parsed = JSON.parse(savedEjs);
                for (const [key, val] of Object.entries(parsed)) {
                    localStorage.setItem(key, val);
                }
            } catch(e) {
                console.error("Failed to restore EJS settings:", e);
            }
        }

        const container = document.getElementById('console-container');
        container.style.display = 'block';
        
        // Load and apply theme
        const theme = data.theme || localStorage.getItem('zwitch_theme') || 'custom-casing';
        applyTheme(theme);
        
        // Load and apply volume
        const volume = data.volume !== undefined ? data.volume : (localStorage.getItem('zwitch_volume') !== null ? parseInt(localStorage.getItem('zwitch_volume')) : 50);
        systemVolume = volume;
        const volumeSlider = document.getElementById('setting-volume');
        if (volumeSlider) volumeSlider.value = volume;
        
        // Load and apply CRT overlay
        const crt = data.crt !== undefined ? data.crt : (localStorage.getItem('zwitch_crt') !== null ? localStorage.getItem('zwitch_crt') === 'true' : true);
        const crtToggle = document.getElementById('setting-crt');
        if (crtToggle) crtToggle.checked = crt;
        const overlay = document.querySelector('.crt-overlay');
        if (overlay) overlay.style.display = crt ? 'block' : 'none';

        // Load and apply prop offsets
        if (data.offsets) {
            const ox = document.getElementById('setting-offset-x');
            const oy = document.getElementById('setting-offset-y');
            const oz = document.getElementById('setting-offset-z');
            const orx = document.getElementById('setting-offset-rx');
            const ory = document.getElementById('setting-offset-ry');
            const orz = document.getElementById('setting-offset-rz');
            
            const vx = document.getElementById('val-offset-x');
            const vy = document.getElementById('val-offset-y');
            const vz = document.getElementById('val-offset-z');
            const vrx = document.getElementById('val-offset-rx');
            const vry = document.getElementById('val-offset-ry');
            const vrz = document.getElementById('val-offset-rz');

            if (ox) { ox.value = data.offsets.x; vx.innerText = data.offsets.x; }
            if (oy) { oy.value = data.offsets.y; vy.innerText = data.offsets.y; }
            if (oz) { oz.value = data.offsets.z; vz.innerText = data.offsets.z; }
            if (orx) { orx.value = data.offsets.rx; vrx.innerText = data.offsets.rx + "°"; }
            if (ory) { ory.value = data.offsets.ry; vry.innerText = data.offsets.ry + "°"; }
            if (orz) { orz.value = data.offsets.rz; vrz.innerText = data.offsets.rz + "°"; }
        }
        
        // Adjust scale immediately on open to fit viewport
        adjustScale();
        
        // Start booting OS
        runBootSequence(() => {
            const dashboard = document.getElementById('dashboard-screen');
            dashboard.style.display = 'flex';
            
            selectedSystemIndex = 0;
            activeSystemFilter = null;
            activeFocus = 'content';
            
            switchSection('home');
            selectSystem(0);
        });
    }
    
    if (data.action === "closeConsole") {
        const container = document.getElementById('console-container');
        container.style.display = 'none';
        
        const dashboard = document.getElementById('dashboard-screen');
        dashboard.style.display = 'none';
        
        exitEmulator();
        bootCompleted = false;
    }
});

// --- Click Listeners for Bottom Bar & Buttons ---
document.querySelectorAll('.nav-icon-wrapper').forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('data-target');
        activeFocus = 'content';
        switchSection(target);
    });
});

// Bind click events to system cards on Home Screen
document.querySelectorAll('.system-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        activeFocus = 'content';
        selectSystem(index);
        // Enter filter
        activeSystemFilter = systemsList[index].id;
        selectedGameIndex = 0;
        switchSection('games');
    });
});

document.getElementById('btn-launch-game').addEventListener('click', () => {
    const filteredGames = getFilteredGames();
        
    if (filteredGames[selectedGameIndex]) {
        launchGame(filteredGames[selectedGameIndex]);
    }
});

document.getElementById('console-home-btn').addEventListener('click', () => {
    if (emulatorRunning) {
        exitEmulator();
    } else {
        activeSystemFilter = null;
        switchSection('home');
    }
});

// --- Screen Resolution Auto-Scaling ---
function adjustScale() {
    const device = document.querySelector('.handheld-device');
    if (!device) return;
    
    const baseWidth = 1080; // 1060px layout width + 20px padding buffer
    const baseHeight = 540; // 520px layout height + 20px padding buffer
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Scale down to 75% of standard fit scale to make it smaller
    let scale = Math.min(screenWidth / baseWidth, screenHeight / baseHeight) * 0.75;
    if (scale > 0.75) scale = 0.75; // Cap maximum scale to 0.75
    
    device.style.transform = `scale(${scale})`;
    device.style.transformOrigin = 'bottom right';
}

window.addEventListener('resize', adjustScale);

// Initialize Settings, Drag and Drop, and Clock on page load
setupSettings();
updateClock();
adjustScale(); // Call immediately on page load
console.log("ZWITCH OS system loaded.");

// Standalone Browser Preview Mode Helper
if (typeof GetParentResourceName === 'undefined') {
    console.log("Running in stand-alone browser mode. Auto-booting console...");
    setTimeout(() => {
        window.postMessage({
            action: "openConsole",
            resourceName: "tatitup-zwitch"
        }, "*");
    }, 500);
}
