// ===== МАГІЧНІ ЗМІННІ КОРОЛІВСТВА =====
const screens = document.querySelectorAll('.screen');
const totalScoreEl = document.getElementById('totalScore');
const completedTasksEl = document.getElementById('completedTasks');
const completedSpellsEl = document.getElementById('completed-spells');
const musicBtn = document.getElementById('music-btn');
const musicText = document.getElementById('music-text');

let totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
let completedTasks = parseInt(localStorage.getItem('completedTasks')) || 0;
let isMusicPlaying = true;
let bgMusic = null;

// Налаштування королівства
const kingdomSettings = {
  princessName: "Єлезавета",
  princeName: "Віталій",
  castleName: "Замок Кохання(1604)",
  date: "14 лютого",
  time: "18:00",
  dressCode: "Вечірні сукні та фраки"
};

// ===== МАГІЧНІ ЗАКЛИНАННЯ =====
function initMagicAudio() {
  try {
    // Створюємо фонову музику
    bgMusic = new Audio('https://assets.mixkit.co/music/preview/mixkit-mysterious-magic-illusion-588.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    // Автоматичне відтворення при взаємодії
    document.addEventListener('click', () => {
      if (isMusicPlaying && bgMusic.paused) {
        bgMusic.play().catch(e => console.log("Музика потребує дозволу"));
      }
    }, { once: true });

  } catch (error) {
    console.log("Аудіо недоступне");
  }
}

function toggleMusic() {
  isMusicPlaying = !isMusicPlaying;
  if (bgMusic) {
    if (isMusicPlaying) {
      bgMusic.play();
      musicText.textContent = "Музика фей: Ввімкнено";
      musicBtn.querySelector('.music-status i').className = 'fas fa-volume-up';
    } else {
      bgMusic.pause();
      musicText.textContent = "Музика фей: Вимкнено";
      musicBtn.querySelector('.music-status i').className = 'fas fa-volume-mute';
    }
  }
}

// ===== МАГІЧНІ ПОРТАЛИ =====
function showScreen(id) {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  if (id === 'final-screen') {
    createFinalMagic();
  }
}

function goToMenu() {
  updateMenuStats();
  showScreen('menu-screen');
}

function updateMenuStats() {
  totalScoreEl.textContent = totalScore;
  completedTasksEl.textContent = `${completedTasks}/4`;

  // Оновлюємо прогрес-бари
  document.getElementById('score-progress').style.width = Math.min(totalScore, 100) + '%';
  document.getElementById('tasks-progress').style.width = (completedTasks / 4 * 100) + '%';

  // Оновлюємо лічильник заклинань
  const completedSpells = parseInt(localStorage.getItem('completedSpells')) || 0;
  completedSpellsEl.textContent = completedSpells;
  document.getElementById('spells-badge').textContent = 15;

  updateQuestStatus();
}

function updateQuestStatus() {
  const heartsComplete = localStorage.getItem('heartsCompleted') === 'true';
  const phrasesComplete = localStorage.getItem('phrasesCompleted') === 'true';
  const memoryComplete = localStorage.getItem('memoryCompleted') === 'true';
  const puzzleComplete = localStorage.getItem('puzzleCompleted') === 'true';

  completedTasks = [heartsComplete, phrasesComplete, memoryComplete, puzzleComplete]
    .filter(status => status).length;

  // Оновлюємо статуси квестів
  const heartsStatus = document.getElementById('hearts-status');
  const phrasesStatus = document.getElementById('phrases-status');
  const memoryStatus = document.getElementById('memory-status');
  const puzzleStatus = document.getElementById('puzzle-status');

  heartsStatus.innerHTML = heartsComplete ?
    '<span class="status-text">✅ Пройдено</span>' :
    '<span class="status-text">🔓 Доступно</span>';

  phrasesStatus.innerHTML = phrasesComplete ?
    '<span class="status-text">✅ Пройдено</span>' :
    (heartsComplete ? '<span class="status-text">🔓 Доступно</span>' : '<span class="status-text">🔒 Замкнено</span>');

  memoryStatus.innerHTML = memoryComplete ?
    '<span class="status-text">✅ Пройдено</span>' :
    (phrasesComplete ? '<span class="status-text">🔓 Доступно</span>' : '<span class="status-text">🔒 Замкнено</span>');

  puzzleStatus.innerHTML = puzzleComplete ?
    '<span class="status-text">✅ Пройдено</span>' :
    (memoryComplete ? '<span class="status-text">🔓 Доступно</span>' : '<span class="status-text">🔒 Замкнено</span>');

  // Активуємо/деактивуємо кнопки квестів
  document.getElementById('phrases-btn').disabled = !heartsComplete;
  document.getElementById('memory-btn').disabled = !phrasesComplete;
  document.getElementById('puzzle-btn').disabled = !memoryComplete;

  // Фінальний квест
  const finalBtn = document.getElementById('final-btn');
  if (completedTasks === 4) {
    finalBtn.disabled = false;
    finalBtn.classList.add('pulse-glow');
    finalBtn.querySelector('.final-lock').innerHTML = '<i class="fas fa-unlock"></i>';
  } else {
    finalBtn.disabled = true;
    finalBtn.classList.remove('pulse-glow');
    finalBtn.querySelector('.final-lock').innerHTML = '<i class="fas fa-lock"></i>';
  }

  // Зберігаємо прогрес
  localStorage.setItem('totalScore', totalScore);
  localStorage.setItem('completedTasks', completedTasks);
}

// ===== КВЕСТ 1: МАГІЯ СЕРЦЕЦЬ =====
let heartScore = 0;
let heartTime = 20;
let heartTimer, heartSpawner;

function startHeartsGame() {
  heartScore = 0;
  heartTime = 20;
  document.getElementById('score').textContent = heartScore;
  document.getElementById('time').textContent = heartTime;

  const gameArea = document.querySelector('.hearts-container');
  gameArea.innerHTML = '';

  showScreen('hearts-screen');

  clearInterval(heartTimer);
  clearInterval(heartSpawner);

  heartTimer = setInterval(() => {
    heartTime--;
    document.getElementById('time').textContent = heartTime;
    if (heartTime <= 0) endHeartsGame();
  }, 1000);

  heartSpawner = setInterval(spawnMagicHeart, 600);
}

function spawnMagicHeart() {
  const magicHearts = [
    { emoji: '❤️', value: 2, color: '#ff3333', class: 'love' },
    { emoji: '💖', value: 3, color: '#ff66b2', class: 'sparkle' },
    { emoji: '💕', value: 1, color: '#ff9999', class: 'double' },
    { emoji: '💘', value: 5, color: '#ff0066', class: 'arrow' },
    { emoji: '💔', value: -2, color: '#666666', class: 'broken' },
    { emoji: '🖤', value: -3, color: '#000000', class: 'dark' }
  ];

  const heart = magicHearts[Math.floor(Math.random() * magicHearts.length)];
  const heartEl = document.createElement('div');
  heartEl.className = `heart ${heart.class}`;
  heartEl.textContent = heart.emoji;
  heartEl.style.color = heart.color;
  heartEl.style.left = Math.random() * 85 + '%';
  heartEl.style.animationDuration = (Math.random() * 1.5 + 2) + 's';
  heartEl.style.fontSize = `${Math.random() * 20 + 30}px`;

  heartEl.addEventListener('click', () => {
    heartScore += heart.value;
    document.getElementById('score').textContent = heartScore;

    // Ефект при кліку
    heartEl.style.animation = 'none';
    heartEl.style.transform = 'scale(1.5)';
    heartEl.style.opacity = '0.7';

    // Створюємо ефект
    createHeartEffect(heartEl);

    setTimeout(() => {
      if (heartEl.parentNode) {
        heartEl.remove();
      }
    }, 300);
  });

  document.querySelector('.hearts-container').appendChild(heartEl);

  // Автоматичне видалення через 5 секунд
  setTimeout(() => {
    if (heartEl.parentNode) {
      heartEl.remove();
    }
  }, 5000);
}

function createHeartEffect(element) {
  const effect = document.createElement('div');
  effect.className = 'heart-effect';
  effect.textContent = element.textContent;
  effect.style.position = 'absolute';
  effect.style.left = element.style.left;
  effect.style.top = element.offsetTop + 'px';
  effect.style.color = element.style.color;
  effect.style.fontSize = element.style.fontSize;
  effect.style.animation = 'heartPop 1s forwards';
  effect.style.zIndex = '1000';
  effect.style.pointerEvents = 'none';

  document.querySelector('.hearts-container').appendChild(effect);
  setTimeout(() => effect.remove(), 1000);
}

function endHeartsGame() {
  clearInterval(heartTimer);
  clearInterval(heartSpawner);

  if (heartScore >= 15) {
    localStorage.setItem('heartsCompleted', 'true');
    totalScore += 30; // +30 балів за цю гру
    showFairyMessage(`Чудово! Ти зібрала ${heartScore} одиниць магії кохання! +30 балів! 💖`);
    setTimeout(() => goToMenu(), 2000);
  } else {
    showFairyMessage(`Потрібно зібрати щонайменше 15 одиниць магії! Ти зібрала: ${heartScore}. Спробуй ще раз! ✨`);
    setTimeout(() => goToMenu(), 2000);
  }
}

function heartsHint() {
  showFairyMessage("💡 Лови світлі сердечка (❤️, 💖, 💕, 💘), уникай темних (💔, 🖤). Кожне світле серце дає магію кохання!");
}

// ===== КВЕСТ 2: ЗАКЛИНАННЯ КОХАННЯ =====
let matchedSpells = 0;

function startPhraseGame() {
  if (localStorage.getItem('heartsCompleted') !== 'true') {
    showFairyMessage("Спочатку пройди 'Магію сердець'!");
    return;
  }

  matchedSpells = 0;
  const loveSpells = [
    ['Серце моє б\'ється', 'лише для тебе'],
    ['Твої очі - це', 'зірочки вночі'],
    ['Разом ми можемо', 'здійснити мрії'],
    ['Кохання - це магія,', 'яка об\'єднує душі'],
    ['Ти робиш цей світ', 'чарівнішим'],
    ['Коли я з тобою,', 'час зупиняється'],
    ['Ти - моя', 'найкраща казка'],
    ['Наші серця говорять', 'однією мовою'],
    ['Ти запалила', 'вогонь у моєму серці'],
    ['Разом ми -', 'непереможна команда'],
    ['Твоя посмішка', 'світить яскравіше сонця'],
    ['Я вірю в нашу', 'казкову історію'],
    ['Ти допомагаєш мені', 'літати'],
    ['З тобою кожен день -', 'нове пригода'],
    ['Наше кохання -', 'вічне як зорі']
  ];

  const leftColumn = document.getElementById('leftColumn');
  const rightColumn = document.getElementById('rightColumn');
  leftColumn.innerHTML = '';
  rightColumn.innerHTML = '';
  document.getElementById('matched-count').textContent = '0/15';

  // Перемішуємо праву частину
  const shuffledRight = [...loveSpells].sort(() => Math.random() - 0.5);

  // Створюємо ліву частину заклинань
  loveSpells.forEach((spell, index) => {
    const spellEl = document.createElement('div');
    spellEl.className = 'spell-item';
    spellEl.textContent = spell[0];
    spellEl.dataset.id = index;
    spellEl.draggable = true;
    leftColumn.appendChild(spellEl);
  });

  // Створюємо праву частину заклинань
  shuffledRight.forEach(spell => {
    const spellEl = document.createElement('div');
    spellEl.className = 'spell-item';
    spellEl.textContent = spell[1];
    spellEl.dataset.id = loveSpells.findIndex(s => s[1] === spell[1]);
    rightColumn.appendChild(spellEl);
  });

  setupSpellDragDrop();
  showScreen('phrases-screen');
}

function setupSpellDragDrop() {
  let draggedSpell = null;

  document.querySelectorAll('#leftColumn .spell-item').forEach(spell => {
    spell.addEventListener('dragstart', (e) => {
      draggedSpell = spell;
      spell.classList.add('dragging');
      e.dataTransfer.setData('text/plain', spell.dataset.id);
    });

    spell.addEventListener('dragend', () => {
      spell.classList.remove('dragging');
      draggedSpell = null;
    });
  });

  document.querySelectorAll('#rightColumn .spell-item').forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!zone.classList.contains('correct')) {
        zone.style.background = 'linear-gradient(135deg, #0096c7, #0077b6)';
      }
    });

    zone.addEventListener('dragleave', () => {
      if (!zone.classList.contains('correct')) {
        zone.style.background = 'linear-gradient(135deg, var(--crystal-blue), #0096c7)';
      }
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!zone.classList.contains('correct')) {
        zone.style.background = 'linear-gradient(135deg, var(--crystal-blue), #0096c7)';
      }

      if (!draggedSpell) return;

      if (draggedSpell.dataset.id === zone.dataset.id) {
        draggedSpell.classList.add('correct');
        zone.classList.add('correct');
        draggedSpell.style.opacity = '0.5';
        zone.style.opacity = '0.5';
        draggedSpell.draggable = false;

        matchedSpells++;
        document.getElementById('matched-count').textContent = `${matchedSpells}/15`;
        document.getElementById('completed-spells-count').textContent = matchedSpells;

        if (matchedSpells === 15) {
          localStorage.setItem('phrasesCompleted', 'true');
          localStorage.setItem('completedSpells', matchedSpells);
          totalScore += 50; // +50 балів за цю гру
          showFairyMessage("Чарівно! Ти відновила всі заклинання кохання! +50 балів! 📜✨");
          setTimeout(() => goToMenu(), 2000);
        }
      } else {
        showFairyMessage("Це заклинання не підходить... Спробуй інше! 🔮");
      }
    });
  });
}

function phrasesHint() {
  showFairyMessage("💡 Перетягуй частини заклинань зліва направо. Коли заклинання зберуться правильно, вони засяють зеленим кольором!");
}

// ===== КВЕСТ 3: КРИШТАЛЕВІ СПОГАДИ =====
let crystalTime = 60;
let crystalTimer;
let crystalMoves = 0;
let flippedCrystals = [];
let matchedCrystals = 0;

function startMemoryGame() {
  if (localStorage.getItem('phrasesCompleted') !== 'true') {
    showFairyMessage("Спочатку пройди 'Забутий сувій'!");
    return;
  }

  crystalTime = 60;
  crystalMoves = 0;
  matchedCrystals = 0;
  flippedCrystals = [];

  document.getElementById('memory-time').textContent = crystalTime;
  document.getElementById('memory-pairs').textContent = '0/8';
  document.getElementById('memory-moves').textContent = '0';

  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';

  const crystalSymbols = ['💎', '🔮', '✨', '🌟', '💫', '⭐', '☄️', '🌠'];
  let crystals = [...crystalSymbols, ...crystalSymbols];
  crystals.sort(() => Math.random() - 0.5);

  crystals.forEach((symbol, index) => {
    const crystal = document.createElement('div');
    crystal.className = 'memory-card';
    crystal.dataset.index = index;
    crystal.dataset.symbol = symbol;

    const back = document.createElement('div');
    back.className = 'card-back';
    back.innerHTML = '<i class="fas fa-question"></i>';

    const front = document.createElement('div');
    front.className = 'card-front';
    front.textContent = symbol;

    crystal.appendChild(back);
    crystal.appendChild(front);

    crystal.addEventListener('click', () => flipCrystal(crystal));
    grid.appendChild(crystal);
  });

  clearInterval(crystalTimer);
  crystalTimer = setInterval(() => {
    crystalTime--;
    document.getElementById('memory-time').textContent = crystalTime;
    if (crystalTime <= 0) endMemoryGame();
  }, 1000);

  showScreen('memory-screen');
}

function flipCrystal(crystal) {
  if (crystal.classList.contains('flipped') ||
      crystal.classList.contains('matched') ||
      flippedCrystals.length >= 2) return;

  crystal.classList.add('flipped');
  flippedCrystals.push(crystal);

  if (flippedCrystals.length === 2) {
    crystalMoves++;
    document.getElementById('memory-moves').textContent = crystalMoves;

    if (flippedCrystals[0].dataset.symbol === flippedCrystals[1].dataset.symbol) {
      flippedCrystals.forEach(c => c.classList.add('matched'));
      flippedCrystals = [];
      matchedCrystals++;
      document.getElementById('memory-pairs').textContent = `${matchedCrystals}/8`;

      if (matchedCrystals === 8) {
        clearInterval(crystalTimer);
        localStorage.setItem('memoryCompleted', 'true');
        totalScore += 40; // +40 балів за цю гру
        showFairyMessage(`Вражаюче! Ти знайшла всі кришталі за ${crystalMoves} спроб! +40 балів! 💎✨`);
        setTimeout(() => goToMenu(), 2000);
      }
    } else {
      setTimeout(() => {
        flippedCrystals.forEach(c => c.classList.remove('flipped'));
        flippedCrystals = [];
      }, 1000);
    }
  }
}

function memoryHint() {
  showFairyMessage("💡 Запам'ятай розташування кришталів. Кожна пара однакових кришталів дає магічну силу!");
}

function resetMemoryGame() {
  startMemoryGame();
}

function endMemoryGame() {
  clearInterval(crystalTimer);
  if (matchedCrystals < 8) {
    showFairyMessage(`Час вийшов! Знайдено пар: ${matchedCrystals}/8. Спробуй ще раз! ⏳`);
    setTimeout(() => goToMenu(), 2000);
  }
}

// ===== КВЕСТ 4: ПАЗЛ ДУШІ (НОВА МЕХАНІКА - ПЕРЕТЯГУВАННЯ) =====
let puzzleMoves = 0;
let puzzlePieces = [];
let draggedPiece = null;
let isTouchDevice = false;

// Правильний порядок каменів
const correctOrder = [
  { emoji: '💖', color: 'pink', name: 'Рожевий' },
  { emoji: '🧡', color: 'orange', name: 'Оранжевий' },
  { emoji: '💛', color: 'yellow', name: 'Жовтий' },
  { emoji: '💚', color: 'green', name: 'Зелений' },
  { emoji: '💙', color: 'blue', name: 'Синій' },
  { emoji: '💜', color: 'purple', name: 'Фіолетовий' },
  { emoji: '🖤', color: 'black', name: 'Чорний' },
  { emoji: '🤍', color: 'white', name: 'Білий' }
];

function startPuzzleGame() {
  if (localStorage.getItem('memoryCompleted') !== 'true') {
    showFairyMessage("Спочатку пройди 'Кришталеві спогади'!");
    return;
  }

  puzzleMoves = 0;
  document.getElementById('puzzle-moves').textContent = puzzleMoves;
  document.getElementById('puzzle-progress').textContent = '0%';

  const board = document.getElementById('puzzle-board');
  const targets = document.getElementById('puzzle-targets');

  board.innerHTML = '';
  targets.innerHTML = '';

  // Перевіряємо чи це тач-пристрій
  isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Створюємо перемішаний порядок пазлів
  puzzlePieces = [...correctOrder];
  shuffleArray(puzzlePieces);

  // Створюємо пазлі на дошці
  puzzlePieces.forEach((piece, index) => {
    const pieceEl = createPuzzlePiece(piece, index);
    board.appendChild(pieceEl);
  });

  // Створюємо цільові позиції
  correctOrder.forEach((piece, index) => {
    const targetSlot = createTargetSlot(piece, index);
    targets.appendChild(targetSlot);
  });

  // Активуємо перший колір у гіді
  document.querySelectorAll('.color-sample').forEach(sample => {
    sample.classList.remove('active');
  });
  document.querySelector('.color-sample[data-color="pink"]').classList.add('active');

  showScreen('puzzle-screen');
}

function createPuzzlePiece(piece, index) {
  const pieceEl = document.createElement('div');
  pieceEl.className = 'puzzle-piece';
  pieceEl.draggable = true;
  pieceEl.dataset.id = index;
  pieceEl.dataset.color = piece.color;
  pieceEl.dataset.emoji = piece.emoji;
  pieceEl.textContent = piece.emoji;

  // Додаємо обробники подій для drag and drop
  pieceEl.addEventListener('dragstart', handleDragStart);
  pieceEl.addEventListener('dragend', handleDragEnd);

  // Додаємо обробники для тач-пристроїв
  if (isTouchDevice) {
    pieceEl.addEventListener('touchstart', handleTouchStart);
    pieceEl.addEventListener('touchend', handleTouchEnd);
    pieceEl.addEventListener('touchmove', handleTouchMove);
  }

  return pieceEl;
}

function createTargetSlot(piece, index) {
  const slotEl = document.createElement('div');
  slotEl.className = 'puzzle-slot';
  slotEl.dataset.targetId = index;
  slotEl.dataset.targetColor = piece.color;
  slotEl.dataset.targetEmoji = piece.emoji;
  slotEl.setAttribute('data-target', piece.name);

  // Додаємо обробники подій для drop
  slotEl.addEventListener('dragover', handleDragOver);
  slotEl.addEventListener('dragleave', handleDragLeave);
  slotEl.addEventListener('drop', handleDrop);

  // Додаємо обробники для тач-пристроїв
  if (isTouchDevice) {
    slotEl.addEventListener('touchmove', handleTouchMove);
    slotEl.addEventListener('touchend', handleTouchEnd);
  }

  return slotEl;
}

// Drag and Drop обробники
function handleDragStart(e) {
  draggedPiece = this;
  this.classList.add('dragging');

  // Встановлюємо дані для drag
  e.dataTransfer.setData('text/plain', this.dataset.id);
  e.dataTransfer.effectAllowed = 'move';

  // Додаємо візуальний ефект
  setTimeout(() => {
    this.style.opacity = '0.4';
  }, 0);
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  this.style.opacity = '1';
  draggedPiece = null;

  // Прибираємо підсвічування з усіх слотів
  document.querySelectorAll('.puzzle-slot').forEach(slot => {
    slot.classList.remove('highlighted');
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';

  // Підсвічуємо слот, якщо він підходить
  if (draggedPiece && this.dataset.targetColor === draggedPiece.dataset.color) {
    this.classList.add('highlighted');
  }
}

function handleDragLeave(e) {
  this.classList.remove('highlighted');
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('highlighted');

  if (!draggedPiece) return;

  // Перевіряємо, чи пазл відповідає слоту
  if (this.dataset.targetColor === draggedPiece.dataset.color) {
    // Перевіряємо, чи слот вже зайнятий
    if (!this.classList.contains('correct')) {
      // Видаляємо пазл з дошки
      draggedPiece.remove();

      // Додаємо пазл у слот
      const placedPiece = createPlacedPiece(draggedPiece.dataset);
      this.innerHTML = '';
      this.appendChild(placedPiece);
      this.classList.add('correct');

      // Оновлюємо лічильник
      puzzleMoves++;
      document.getElementById('puzzle-moves').textContent = puzzleMoves;

      // Оновлюємо прогрес
      updatePuzzleProgress();

      // Перевіряємо, чи пазл завершено
      if (isPuzzleComplete()) {
        localStorage.setItem('puzzleCompleted', 'true');
        totalScore += 60; // +60 балів за цю гру
        showFairyMessage("Неймовірно! Ти склала пазл душі за " + puzzleMoves + " переміщень! +60 балів! 🧩✨");
        setTimeout(() => goToMenu(), 2000);
      }
    }
  } else {
    showFairyMessage("Цей камінь не підходить для цього місця! Спробуй інший колір.");
  }
}

// Touch обробники для мобільних пристроїв
let touchStartX = 0;
let touchStartY = 0;
let touchElement = null;

function handleTouchStart(e) {
  e.preventDefault();
  touchElement = this;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;

  // Імітуємо dragstart
  this.classList.add('dragging');
  draggedPiece = this;
}

function handleTouchMove(e) {
  e.preventDefault();
  if (!touchElement || !draggedPiece) return;

  const touch = e.touches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  // Переміщуємо елемент
  touchElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  touchElement.style.opacity = '0.7';

  // Перевіряємо, чи знаходимось над слотом
  const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
  const targetSlot = elements.find(el => el.classList.contains('puzzle-slot'));

  // Підсвічуємо слот, якщо він підходить
  document.querySelectorAll('.puzzle-slot').forEach(slot => {
    slot.classList.remove('highlighted');
  });

  if (targetSlot && targetSlot.dataset.targetColor === draggedPiece.dataset.color) {
    targetSlot.classList.add('highlighted');
  }
}

function handleTouchEnd(e) {
  e.preventDefault();
  if (!touchElement || !draggedPiece) return;

  const touch = e.changedTouches[0];
  const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
  const targetSlot = elements.find(el => el.classList.contains('puzzle-slot'));

  // Скидаємо стилі
  touchElement.style.transform = '';
  touchElement.style.opacity = '1';
  touchElement.classList.remove('dragging');

  // Прибираємо підсвічування
  document.querySelectorAll('.puzzle-slot').forEach(slot => {
    slot.classList.remove('highlighted');
  });

  // Перевіряємо drop
  if (targetSlot && targetSlot.dataset.targetColor === draggedPiece.dataset.color) {
    if (!targetSlot.classList.contains('correct')) {
      // Видаляємо пазл з дошки
      draggedPiece.remove();

      // Додаємо пазл у слот
      const placedPiece = createPlacedPiece(draggedPiece.dataset);
      targetSlot.innerHTML = '';
      targetSlot.appendChild(placedPiece);
      targetSlot.classList.add('correct');

      // Оновлюємо лічильник
      puzzleMoves++;
      document.getElementById('puzzle-moves').textContent = puzzleMoves;

      // Оновлюємо прогрес
      updatePuzzleProgress();

      // Перевіряємо, чи пазл завершено
      if (isPuzzleComplete()) {
        localStorage.setItem('puzzleCompleted', 'true');
        totalScore += 60; // +60 балів за цю гру
        showFairyMessage("Неймовірно! Ти склала пазл душі за " + puzzleMoves + " переміщень! +60 балів! 🧩✨");
        setTimeout(() => goToMenu(), 2000);
      }
    }
  }

  draggedPiece = null;
  touchElement = null;
}

function createPlacedPiece(data) {
  const piece = document.createElement('div');
  piece.className = 'puzzle-piece placed';
  piece.textContent = data.emoji;
  piece.dataset.color = data.color;
  return piece;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updatePuzzleProgress() {
  const correctSlots = document.querySelectorAll('.puzzle-slot.correct').length;
  const totalSlots = correctOrder.length;
  const progress = Math.round((correctSlots / totalSlots) * 100);
  document.getElementById('puzzle-progress').textContent = `${progress}%`;

  // Оновлюємо активний колір у гіді
  document.querySelectorAll('.color-sample').forEach(sample => {
    sample.classList.remove('active');
  });

  // Знаходимо перший неправильно розміщений колір
  const slots = document.querySelectorAll('.puzzle-slot');
  for (let i = 0; i < slots.length; i++) {
    if (!slots[i].classList.contains('correct')) {
      const targetColor = slots[i].dataset.targetColor;
      const colorSample = document.querySelector(`.color-sample[data-color="${targetColor}"]`);
      if (colorSample) {
        colorSample.classList.add('active');
        break;
      }
    }
  }
}

function isPuzzleComplete() {
  const correctSlots = document.querySelectorAll('.puzzle-slot.correct').length;
  return correctSlots === correctOrder.length;
}

function puzzleHint() {
  showFairyMessage("💡 Перетягуй камені на відповідні кольорові місця. Кожен колір має свою позицію за веселкою!");
}

function resetPuzzle() {
  startPuzzleGame();
}

// ===== ФІНАЛЬНИЙ СУРПРИЗ =====
function showFinal() {
  if (completedTasks < 4) {
    showFairyMessage("Спочатку пройди всі 4 випробування, принцесо! ✨");
    return;
  }

  // Встановлюємо персоналізовані дані
  document.getElementById('girl-name').textContent = kingdomSettings.princessName;
  document.getElementById('boy-name').textContent = kingdomSettings.princeName;
  document.getElementById('restaurant-name').textContent = kingdomSettings.castleName;

  // Створюємо фінальну магію
  createFinalMagic();
  showScreen('final-screen');
}

function createFinalMagic() {
  const celebration = document.querySelector('.final-celebration');
  celebration.innerHTML = '';

  // Створюємо конфетті
  const colors = ['#ff6b9d', '#c77dff', '#48cae4', '#38b000', '#ffd166'];

  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random() * 3}s`;
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = `${Math.random() * 15 + 10}px`;
    confetti.style.height = confetti.style.width;
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    celebration.appendChild(confetti);
  }
}

function printInvitation() {
  window.print();
}

function shareInvitation() {
  const shareText = `${kingdomSettings.princeName} запрошує ${kingdomSettings.princessName} на королівський бал у ${kingdomSettings.castleName} 14 лютого о 19:00! ✨🏰`;

  if (navigator.share) {
    navigator.share({
      title: 'Королівське запрошення',
      text: shareText,
      url: window.location.href
    }).catch(err => console.log('Помилка спільного доступу:', err));
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      showFairyMessage("Запрошення скопійовано до буферу обміну! 📋✨");
    }).catch(() => {
      showFairyMessage("Просто скопіюй це посилання та поділись ним: " + window.location.href);
    });
  }
}

function resetQuest() {
  if (confirm("Ти дійсно хочеш почати квест з самого початку? Це очистить весь твій прогрес.")) {
    localStorage.clear();
    totalScore = 0;
    completedTasks = 0;
    goToMenu();
    showFairyMessage("Квест перезапущено! Готуйся до нової пригоди! 🚀✨");
  }
}

// ===== УТИЛІТИ =====
function showFairyMessage(message) {
  // Перевіряємо, чи вже є повідомлення
  const existingMessage = document.querySelector('.fairy-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  const fairyMessage = document.createElement('div');
  fairyMessage.className = 'fairy-message';
  fairyMessage.innerHTML = `
    <div class="fairy-message-content">
      <div class="fairy-icon">🧚‍♀️</div>
      <div class="fairy-text">${message}</div>
    </div>
  `;

  // Додаємо стилі, якщо їх ще немає
  if (!document.querySelector('#fairy-message-styles')) {
    const style = document.createElement('style');
    style.id = 'fairy-message-styles';
    style.textContent = `
      .fairy-message {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: linear-gradient(135deg,
          rgba(199, 125, 255, 0.95),
          rgba(255, 107, 157, 0.95));
        color: white;
        padding: 20px 30px;
        border-radius: 20px;
        z-index: 9999;
        box-shadow:
          0 15px 40px rgba(0, 0, 0, 0.4),
          0 0 0 3px var(--royal-gold);
        border: 2px solid var(--royal-gold);
        min-width: 300px;
        max-width: 90%;
        backdrop-filter: blur(10px);
        transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        font-size: 1.1rem;
        line-height: 1.5;
      }

      .fairy-message.show {
        transform: translateX(-50%) translateY(0);
      }

      .fairy-message-content {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .fairy-icon {
        font-size: 2rem;
        animation: floatIcon 3s ease-in-out infinite;
      }

      .fairy-text {
        flex: 1;
      }

      @keyframes floatIcon {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(fairyMessage);

  // Анімація появи
  setTimeout(() => {
    fairyMessage.classList.add('show');
  }, 100);

  // Автоматичне зникнення
  setTimeout(() => {
    fairyMessage.classList.remove('show');
    setTimeout(() => {
      if (fairyMessage.parentNode) {
        fairyMessage.remove();
      }
    }, 500);
  }, 4000);
}

// ===== ЗАКЛИНАННЯ ІНІЦІАЛІЗАЦІЇ =====
document.addEventListener('DOMContentLoaded', () => {
  // Ініціалізуємо магічні звуки
  initMagicAudio();

  // Відновлюємо прогрес
  totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
  completedTasks = parseInt(localStorage.getItem('completedTasks')) || 0;

  // Оновлюємо меню
  updateMenuStats();

  // Пояснювальне повідомлення
  setTimeout(() => {
    showFairyMessage("Ласкаво просимо до Казкового Валентинкового Квесту, принцесо! ✨ Готуйся до незабутньої пригоди!");
  }, 1500);

  // Анімація для кнопки початку
  const startButton = document.querySelector('#start-screen .magic-button');
  if (startButton) {
    startButton.addEventListener('click', goToMenu);
  }
});

// Додаємо стилі для ефектів
const effectsStyle = document.createElement('style');
effectsStyle.textContent = `
  @keyframes heartPop {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  .heart-effect {
    pointer-events: none;
    animation: heartPop 1s forwards;
  }
`;
document.head.appendChild(effectsStyle);