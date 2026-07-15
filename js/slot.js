import { AudioEngine } from './audio.js';

// Symbol Configurations
const SYMBOLS = {
  WILD: { id: 'wild', name: 'WILD', color: '#ffea00', label: 'WILD' },
  SCATTER: { id: 'scatter', name: 'SCATTER', color: '#00ff87', label: 'STAR' },
  ACE: { id: 'ace', name: 'Ace Card', color: '#f39c12', val: 120 },
  CROWN: { id: 'crown', name: 'Royal Crown', color: '#ffb300', val: 90 },
  SEVEN: { id: 'seven', name: 'Lucky 7', color: '#e74c3c', val: 70 },
  RUBY: { id: 'ruby', name: 'Ruby', color: '#ff2a6d', val: 50 },
  EMERALD: { id: 'emerald', name: 'Emerald', color: '#05d9e8', val: 40 },
  DIAMOND: { id: 'diamond', name: 'Diamond', color: '#d1f2a5', val: 30 },
  COIN: { id: 'coin', name: 'Gold Coin', color: '#ffc857', val: 20 },
  STAR: { id: 'star', name: 'Neon Star', color: '#9b5de5', val: 10 }
};

const SYMBOL_ARRAY = Object.values(SYMBOLS);

// Helper class to dynamically output clean custom vector SVGs
class SymbolRenderer {
  static getSVG(symbolId) {
    const symbol = SYMBOLS[symbolId.toUpperCase()] || SYMBOLS.STAR;
    const color = symbol.color;
    
    switch (symbolId) {
      case 'wild':
        return `
          <svg viewBox="0 0 100 100" class="symbol-svg">
            <defs>
              <linearGradient id="grad-wild" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fff" />
                <stop offset="50%" stop-color="#ffb300" />
                <stop offset="100%" stop-color="#d4af37" />
              </linearGradient>
            </defs>
            <rect x="5" y="15" width="90" height="70" rx="10" fill="url(#grad-wild)" stroke="#fff" stroke-width="2"/>
            <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="'Impact', Arial" font-size="28" fill="#000">WILD</text>
          </svg>
        `;
      case 'scatter':
        return `
          <svg viewBox="0 0 100 100" class="symbol-svg">
            <polygon points="50,10 64,38 95,43 72,65 78,96 50,81 22,96 28,65 5,43 36,38" fill="${color}" stroke="#fff" stroke-width="2" />
            <circle cx="50" cy="53" r="14" fill="#000" opacity="0.8" />
            <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-weight="900" font-size="10" fill="${color}">SPIN</text>
          </svg>
        `;
      case 'ace':
        return `
          <svg viewBox="0 0 100 100" class="symbol-svg">
            <rect x="15" y="10" width="70" height="80" rx="8" fill="#fff" stroke="#ffb300" stroke-width="3" />
            <text x="30" y="35" font-family="Arial" font-weight="900" font-size="24" fill="#000">A</text>
            <path d="M50,35 L62,55 L53,55 L53,68 L47,68 L47,55 L38,55 Z" fill="#000" />
          </svg>
        `;
      case 'crown':
        return `
          <svg viewBox="0 0 100 100" class="symbol-svg">
            <path d="M10,75 L90,75 L80,30 L60,55 L50,20 L40,55 L20,30 Z" fill="${color}" stroke="#fff" stroke-width="2" />
            <circle cx="50" cy="75" r="5" fill="#f00" />
            <circle cx="30" cy="75" r="5" fill="#00f" />
            <circle cx="70" cy="75" r="5" fill="#00f" />
          </svg>
        `;
      case 'seven':
        return `
          <svg viewBox="0 0 100 100" class="symbol-svg">
            <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="'Impact', sans-serif" font-weight="900" font-size="70" fill="${color}" stroke="#fff" stroke-width="2">7</text>
          </svg>
        `;
      case 'ruby':
        return `
          <svg viewBox="0 0 100 100" class="symbol-svg">
            <polygon points="50,15 80,40 50,85 20,40" fill="${color}" stroke="#fff" stroke-width="1.5" />
            <polygon points="50,15 65,40 50,85" fill="#fff" opacity="0.3" />
          </svg>
        `;
      case 'emerald':
        return `
          <svg viewBox="0 0 100 100" class="symbol-svg">
            <polygon points="35,15 65,15 85,35 85,65 65,85 35,85 15,65 15,35" fill="${color}" stroke="#fff" stroke-width="1.5" />
          </svg>
        `;
      case 'diamond':
        return `
          <svg viewBox="0 0 100 100" class="symbol-svg">
            <polygon points="50,10 85,50 50,90 15,50" fill="${color}" stroke="#fff" stroke-width="1.5"/>
          </svg>
        `;
      case 'coin':
        return `
          <svg viewBox="0 0 100 100" class="symbol-svg">
            <circle cx="50" cy="50" r="38" fill="${color}" stroke="#fff" stroke-width="2" />
            <circle cx="50" cy="50" r="28" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="5,5" />
            <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-weight="bold" font-size="20" fill="#000">$</text>
          </svg>
        `;
      default:
        return `
          <svg viewBox="0 0 100 100" class="symbol-svg">
            <polygon points="50,15 63,45 95,45 70,65 80,95 50,75 20,95 30,65 5,45 37,45" fill="${color}" stroke="#fff" stroke-width="1" />
          </svg>
        `;
    }
  }
}

// Game Core State Controller
class STXSuperAceSlot {
  constructor() {
    this.balance = parseFloat(localStorage.getItem('casino_balance')) || 10000;
    this.betList = [10, 20, 50, 100, 200, 500, 1000, 5000];
    this.betIndex = 0;
    this.currentBet = this.betList[this.betIndex];
    this.isSpinning = false;
    this.isAuto = false;
    this.isTurbo = false;
    this.cascadeLevel = 1; // Tracks multiplier level
    this.freeSpinsRemaining = 0;
    this.isInFreeSpins = false;

    // Reels array (5 columns x 4 rows)
    this.grid = Array(5).fill(null).map(() => Array(4).fill(null));
    
    // UI Elements Binding
    this.btnBack = document.getElementById('btn-back');
    this.btnSpin = document.getElementById('btn-spin');
    this.btnBetMinus = document.getElementById('bet-minus');
    this.btnBetPlus = document.getElementById('bet-plus');
    this.btnTurbo = document.getElementById('btn-turbo');
    this.btnAuto = document.getElementById('btn-auto');
    this.displayBalance = document.getElementById('display-balance');
    this.displayWin = document.getElementById('display-win');
    this.displayBet = document.getElementById('display-bet');
    this.reelsContainer = document.getElementById('reels-container');
    this.particleCanvas = document.getElementById('particle-canvas');
    this.ctxParticles = this.particleCanvas.getContext('2d');
    
    // Sparkle Particles state
    this.particles = [];
    this.isAnimatingParticles = false;

    // Hook listeners
    this.initEvents();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Generate random layout on init
    this.fillGridRandomly();
    this.renderGrid();
    this.updateHUD();
    this.buildPaytable();
  }

  resizeCanvas() {
    this.particleCanvas.width = this.particleCanvas.parentElement.clientWidth;
    this.particleCanvas.height = this.particleCanvas.parentElement.clientHeight;
  }

  initEvents() {
    // Enable Web Audio & Lobby Redirection
    this.btnBack.addEventListener('click', () => {
      AudioEngine.playClick();
      window.location.href = 'index.html';
    });

    this.btnSpin.addEventListener('click', () => {
      AudioEngine.init();
      this.triggerSpin();
    });

    this.btnBetPlus.addEventListener('click', () => {
      AudioEngine.playClick();
      if (this.betIndex < this.betList.length - 1) {
        this.betIndex++;
        this.currentBet = this.betList[this.betIndex];
        this.updateHUD();
      }
    });

    this.btnBetMinus.addEventListener('click', () => {
      AudioEngine.playClick();
      if (this.betIndex > 0) {
        this.betIndex--;
        this.currentBet = this.betList[this.betIndex];
        this.updateHUD();
      }
    });

    this.btnTurbo.addEventListener('click', () => {
      AudioEngine.playClick();
      this.isTurbo = !this.isTurbo;
      this.btnTurbo.classList.toggle('active', this.isTurbo);
      this.btnTurbo.innerText = this.isTurbo ? "TURBO ON" : "TURBO OFF";
    });

    this.btnAuto.addEventListener('click', () => {
      AudioEngine.playClick();
      this.isAuto = !this.isAuto;
      this.btnAuto.classList.toggle('active', this.isAuto);
      this.btnAuto.innerText = this.isAuto ? "AUTO ON" : "AUTO OFF";
      if (this.isAuto && !this.isSpinning) {
        this.triggerSpin();
      }
    });

    // Volume Controller
    const btnVol = document.getElementById('btn-volume');
    btnVol.addEventListener('click', () => {
      AudioEngine.init();
      AudioEngine.playClick();
      const sfxOn = !AudioEngine.sfxEnabled;
      AudioEngine.setSFXEnabled(sfxOn);
      AudioEngine.setMusicEnabled(sfxOn);
      btnVol.innerText = sfxOn ? "🔊" : "🔇";
    });

    // Modal Control logic
    const settingsBtn = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('modal-settings');
    const settingsClose = document.getElementById('settings-close');

    settingsBtn.addEventListener('click', () => {
      AudioEngine.init();
      AudioEngine.playClick();
      settingsModal.classList.remove('hidden');
    });
    settingsClose.addEventListener('click', () => {
      AudioEngine.playClick();
      settingsModal.classList.add('hidden');
    });

    const checkSFX = document.getElementById('check-sfx');
    const checkMusic = document.getElementById('check-music');

    checkSFX.addEventListener('change', (e) => {
      AudioEngine.setSFXEnabled(e.target.checked);
    });
    checkMusic.addEventListener('change', (e) => {
      AudioEngine.setMusicEnabled(e.target.checked);
    });

    const paytableBtn = document.getElementById('btn-paytable');
    const paytableModal = document.getElementById('modal-paytable');
    const paytableClose = document.getElementById('paytable-close');

    paytableBtn.addEventListener('click', () => {
      AudioEngine.init();
      AudioEngine.playClick();
      paytableModal.classList.remove('hidden');
    });
    paytableClose.addEventListener('click', () => {
      AudioEngine.playClick();
      paytableModal.classList.add('hidden');
    });
  }

  // Populate dynamic UI inside info paytable
  buildPaytable() {
    const grid = document.getElementById('paytable-grid');
    grid.innerHTML = '';
    SYMBOL_ARRAY.forEach(sym => {
      if (sym.id === 'wild' || sym.id === 'scatter') return;
      const card = document.createElement('div');
      card.className = 'paytable-card';
      card.innerHTML = `
        <div class="pay-art-box">${SymbolRenderer.getSVG(sym.id)}</div>
        <div class="pay-info">
          <h4>${sym.name}</h4>
          <p>5-in-row: x${(sym.val/10).toFixed(1)}</p>
          <p>4-in-row: x${(sym.val/25).toFixed(1)}</p>
          <p>3-in-row: x${(sym.val/50).toFixed(1)}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  updateHUD() {
    this.displayBalance.innerText = this.balance.toLocaleString('en-US', { minimumFractionDigits: 2 });
    this.displayBet.innerText = this.currentBet.toLocaleString();
    localStorage.setItem('casino_balance', this.balance.toString());
  }

  fillGridRandomly() {
    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 4; row++) {
        this.grid[col][row] = this.getRandomSymbolId();
      }
    }
  }

  getRandomSymbolId() {
    // Weights matching an exciting, original math system
    const rand = Math.random();
    if (rand < 0.04) return 'wild';
    if (rand < 0.08) return 'scatter';
    if (rand < 0.16) return 'ace';
    if (rand < 0.25) return 'crown';
    if (rand < 0.35) return 'seven';
    if (rand < 0.47) return 'ruby';
    if (rand < 0.59) return 'emerald';
    if (rand < 0.72) return 'diamond';
    if (rand < 0.86) return 'coin';
    return 'star';
  }

  renderGrid() {
    this.reelsContainer.innerHTML = '';
    for (let col = 0; col < 5; col++) {
      const reelStrip = document.createElement('div');
      reelStrip.className = 'reel-strip';
      reelStrip.id = `reel-col-${col}`;

      for (let row = 0; row < 4; row++) {
        const symbolId = this.grid[col][row];
        const cell = document.createElement('div');
        cell.className = 'reel-row-cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.innerHTML = SymbolRenderer.getSVG(symbolId);
        reelStrip.appendChild(cell);
      }
      this.reelsContainer.appendChild(reelStrip);
    }
  }

  // Core reel-rolling state machine
  triggerSpin() {
    if (this.isSpinning) return;
    if (this.balance < this.currentBet && this.freeSpinsRemaining <= 0) {
      alert("Insufficient Balance.");
      this.isAuto = false;
      this.btnAuto.classList.remove('active');
      this.btnAuto.innerText = "AUTO OFF";
      return;
    }

    this.isSpinning = true;
    this.btnSpin.classList.add('disabled');
    this.displayWin.innerText = "0.00";

    // Deduct cost
    if (!this.isInFreeSpins) {
      this.balance -= this.currentBet;
      this.cascadeLevel = 1;
      this.updateHUD();
    }

    this.applyActiveMultiplierGlow();

    // Trigger visual motion spin
    const strips = document.querySelectorAll('.reel-strip');
    const delayStep = this.isTurbo ? 60 : 200;
    
    AudioEngine.playSpinWhir();

    strips.forEach((strip, index) => {
      strip.classList.add('reel-spinning');
      
      setTimeout(() => {
        // Sequentially stop each column strip
        strip.classList.remove('reel-spinning');
        AudioEngine.playReelStop(index);

        // Fill strip with fresh result
        for (let row = 0; row < 4; row++) {
          this.grid[index][row] = this.getRandomSymbolId();
        }

        // Render target elements instantly
        const cells = strip.querySelectorAll('.reel-row-cell');
        cells.forEach((cell, r) => {
          cell.innerHTML = SymbolRenderer.getSVG(this.grid[index][r]);
        });

        // Completed last strip
        if (index === 4) {
          setTimeout(() => {
            this.evaluateSpinPayout();
          }, 200);
        }
      }, 500 + index * delayStep);
    });
  }

  // Active cascade multiplier display bar
  applyActiveMultiplierGlow() {
    const indicators = ['m-x1', 'm-x2', 'm-x3', 'm-x5'];
    indicators.forEach((id, idx) => {
      const el = document.getElementById(id);
      el.classList.remove('active', 'free-active');
      
      const multiplierStep = idx + 1; // x1, x2, x3, x5
      const isActive = this.cascadeLevel === multiplierStep || (multiplierStep === 4 && this.cascadeLevel >= 4);
      
      if (isActive) {
        if (this.isInFreeSpins) {
          el.classList.add('free-active');
        } else {
          el.classList.add('active');
        }
      }
    });
  }

  // Calculation Engine: 1024-Ways Adjacent Logic
  evaluateSpinPayout() {
    // 1. Gather occurrences of each symbol across columns left-to-right
    const occurrences = Array(5).fill(null).map(() => ({}));
    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 4; row++) {
        const sym = this.grid[col][row];
        occurrences[col][sym] = (occurrences[col][sym] || 0) + 1;
        if (sym === 'wild') {
          // Track wildcard propagation for all base pay symbols
          SYMBOL_ARRAY.forEach(baseSym => {
            if (baseSym.id !== 'wild' && baseSym.id !== 'scatter') {
              occurrences[col][baseSym.id] = (occurrences[col][baseSym.id] || 0) + 1;
            }
          });
        }
      }
    }

    let totalWinMultiplier = 0;
    const winningCellsMap = []; // Array of {col, row} coordinate matches

    // 2. Compute winning combinations (matches must connect adjacent columns starting from Leftmost Reel-col-0)
    SYMBOL_ARRAY.forEach(symbol => {
      if (symbol.id === 'wild' || symbol.id === 'scatter') return;

      let count = 0;
      let ways = 1;

      for (let col = 0; col < 5; col++) {
        const matches = occurrences[col][symbol.id] || 0;
        if (matches > 0) {
          count++;
          ways *= matches;
        } else {
          break; // Must remain adjacent
        }
      }

      if (count >= 3) {
        // Retrieve payout mapping
        let scale = 0.1;
        if (count === 3) scale = 0.2;
        if (count === 4) scale = 0.5;
        if (count === 5) scale = 1.0;

        const basePayout = symbol.val * scale * ways;
        totalWinMultiplier += basePayout;

        // Trace back and highlight matching elements on board grid
        for (let col = 0; col < count; col++) {
          for (let row = 0; row < 4; row++) {
            const symAt = this.grid[col][row];
            if (symAt === symbol.id || symAt === 'wild') {
              winningCellsMap.push({ col, row });
            }
          }
        }
      }
    });

    // 3. Evaluate Scatter count across the complete grid board
    let scatterCount = 0;
    const scatterLocations = [];
    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 4; row++) {
        if (this.grid[col][row] === 'scatter') {
          scatterCount++;
          scatterLocations.push({ col, row });
        }
      }
    }

    const multiplierScaleTable = this.isInFreeSpins ? [2, 4, 6, 10] : [1, 2, 3, 5];
    const activeMultIdx = Math.min(this.cascadeLevel - 1, 3);
    const activeMultiplier = multiplierScaleTable[activeMultIdx];

    const absoluteWinAmount = (totalWinMultiplier / 100) * this.currentBet * activeMultiplier;

    if (absoluteWinAmount > 0) {
      // Execute Highlight animations
      this.animateWinningCells(winningCellsMap);
      
      setTimeout(() => {
        this.balance += absoluteWinAmount;
        this.displayWin.innerText = absoluteWinAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });
        this.updateHUD();

        // High rewards trigger screen explosion FX
        if (absoluteWinAmount >= this.currentBet * 10) {
          this.triggerCelebrationEffect(absoluteWinAmount);
        } else {
          AudioEngine.playWinChime();
        }

        // Drop Cascading round
        setTimeout(() => {
          this.removeWinningSymbolsAndCascade(winningCellsMap);
        }, 1200);

      }, 400);

    } else {
      // Evaluate Free Spins Trigger
      if (scatterCount >= 3) {
        this.animateWinningCells(scatterLocations);
        setTimeout(() => {
          this.triggerFreeSpinsBonus();
        }, 800);
      } else {
        // Check for Free Spins Progression or Auto Loop
        this.concludeGameplayRound();
      }
    }
  }

  animateWinningCells(cells) {
    cells.forEach(coord => {
      const el = document.querySelector(`#reel-col-${coord.col} [data-row="${coord.row}"]`);
      if (el) el.classList.add('winning-cell');
    });
  }

  // Cascade Mechanics: Explode winning coordinates, trigger drop-down sequence
  removeWinningSymbolsAndCascade(winningCells) {
    // Reset layout visuals
    document.querySelectorAll('.reel-row-cell').forEach(cell => cell.classList.remove('winning-cell'));

    // Reconstruct columns internally, drawing top replacements down
    for (let col = 0; col < 5; col++) {
      const colWins = winningCells.filter(c => c.col === col).map(c => c.row);
      if (colWins.length === 0) continue;

      // Filter non-winning elements in this strip and shift them down
      const keptSymbols = [];
      for (let row = 0; row < 4; row++) {
        if (!colWins.includes(row)) {
          keptSymbols.push(this.grid[col][row]);
        }
      }

      // Prepend fresh random cards to the top of column array to replenish
      while (keptSymbols.length < 4) {
        keptSymbols.unshift(this.getRandomSymbolId());
      }

      this.grid[col] = keptSymbols;
    }

    // Refresh display
    this.renderGrid();
    
    // Scale reactive multiplier level
    this.cascadeLevel++;
    this.applyActiveMultiplierGlow();

    // Re-verify new combinations
    setTimeout(() => {
      this.evaluateSpinPayout();
    }, 400);
  }

  // Free Spins logic block
  triggerFreeSpinsBonus() {
    this.isInFreeSpins = true;
    this.freeSpinsRemaining += 10;
    AudioEngine.playJackpotFanfare();
    
    // Showcase celebration layout overlay popup
    const title = document.getElementById('announcement-title');
    const amount = document.getElementById('announcement-amount');
    const panel = document.getElementById('big-win-announcement');

    title.innerText = "GOLDEN FREE SPINS UNLOCKED!";
    amount.innerText = "10 SPINS";
    panel.classList.remove('hidden');

    this.spawnParticlesBurst(100);

    setTimeout(() => {
      panel.classList.add('hidden');
      this.concludeGameplayRound();
    }, 2500);
  }

  concludeGameplayRound() {
    this.isSpinning = false;
    this.btnSpin.classList.remove('disabled');

    // Run Free Spins sequence or Auto Loop
    if (this.isInFreeSpins && this.freeSpinsRemaining > 0) {
      this.freeSpinsRemaining--;
      if (this.freeSpinsRemaining === 0) {
        this.isInFreeSpins = false;
      }
      setTimeout(() => {
        this.triggerSpin();
      }, 1000);
    } else if (this.isAuto) {
      setTimeout(() => {
        this.triggerSpin();
      }, 1000);
    }
  }

  // Sparkle and Coin particle fountains
  triggerCelebrationEffect(winValue) {
    AudioEngine.playJackpotFanfare();
    const title = document.getElementById('announcement-title');
    const amount = document.getElementById('announcement-amount');
    const panel = document.getElementById('big-win-announcement');

    title.innerText = winValue >= this.currentBet * 50 ? "LEGENDARY JACKPOT!" : "BIG WIN!";
    amount.innerText = winValue.toLocaleString('en-US', { minimumFractionDigits: 2 });
    panel.classList.remove('hidden');

    this.spawnParticlesBurst(80);

    setTimeout(() => {
      panel.classList.add('hidden');
    }, 3000);
  }

  // Particle Generation and Canvas Loops
  spawnParticlesBurst(num) {
    this.particles = [];
    const colors = ['#d4af37', '#ffa751', '#00ff87', '#fff'];
    for (let i = 0; i < num; i++) {
      this.particles.push({
        x: this.particleCanvas.width / 2,
        y: this.particleCanvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 16,
        r: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.35,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.01
      });
    }

    if (!this.isAnimatingParticles) {
      this.isAnimatingParticles = true;
      this.animateParticlesLoop();
    }
  }

  animateParticlesLoop() {
    if (this.particles.length === 0) {
      this.isAnimatingParticles = false;
      this.ctxParticles.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
      return;
    }

    requestAnimationFrame(() => this.animateParticlesLoop());

    this.ctxParticles.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      this.ctxParticles.beginPath();
      this.ctxParticles.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctxParticles.fillStyle = p.color;
      this.ctxParticles.globalAlpha = p.life;
      this.ctxParticles.fill();

      if (p.life <= 0 || p.y > this.particleCanvas.height) {
        this.particles.splice(i, 1);
      }
    }
  }
}

// Instantiate Global Class context on document launch
document.addEventListener('DOMContentLoaded', () => {
  window.STXSlotInstance = new STXSuperAceSlot();
});
