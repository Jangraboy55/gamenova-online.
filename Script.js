// GameNova frontend script - simple, robust, accessible
document.addEventListener('DOMContentLoaded', () => {
  // sample games list: add more entries or generate dynamically from server
  const games = [
    {
      id: 'wormszone',
      title: 'Worms Zone (Demo)',
      desc: 'Snake-style demo (client only)',
      path: 'games/wormszone/index.html',
      cover: 'games/wormszone/cover.png'
    },
    {
      id: 'secretseed',
      title: 'Secret Seed (Placeholder)',
      desc: 'Habit-growing mini-game (add your own)',
      path: 'games/secretseed/index.html',
      cover: 'assets/placeholder.png'
    }
  ];

  const grid = document.getElementById('gamesGrid');
  const search = document.getElementById('search');
  const year = document.getElementById('year');
  year.textContent = new Date().getFullYear();

  const modal = document.getElementById('playModal');
  const iframe = document.getElementById('gameFrame');
  const modalTitle = document.getElementById('modalTitle');
  const closeModalBtn = document.getElementById('closeModal');
  const openNewTabBtn = document.getElementById('openNewTab');

  function createCard(g) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.innerHTML = `
      <div style="position:relative">
        <img class="game-cover" src="${g.cover}" alt="${g.title} cover" onerror="this.src='assets/placeholder.png'">
      </div>
      <div class="game-meta">
        <div>
          <h4 class="game-title">${g.title}</h4>
          <p class="game-desc">${g.desc}</p>
        </div>
        <div>
          <button class="play-btn" aria-label="Play ${g.title}">Play</button>
        </div>
      </div>`;
    // click or keyboard open
    function openGame(){ openModal(g); }
    card.querySelector('.play-btn').addEventListener('click', openGame);
    card.addEventListener('click', (e) => { if (e.target === card) openGame(); });
    card.addEventListener('keypress', (e) => { if (e.key === 'Enter') openGame(); });
    return card;
  }

  function renderGrid(list) {
    grid.innerHTML = '';
    if (!list.length) {
      grid.innerHTML = '<div class="card">No games found.</div>';
      return;
    }
    list.forEach(g => grid.appendChild(createCard(g)));
  }

  function openModal(game) {
    modalTitle.textContent = game.title;
    // set iframe src to game's path (relative) and show modal
    iframe.src = game.path;
    openNewTabBtn.onclick = () => window.open(game.path, '_blank');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    // ensure focus for accessibility
    closeModalBtn.focus();
  }

  function closeModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    // unload iframe to stop audio/CPU
    iframe.src = 'about:blank';
  }

  closeModalBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // search
  search.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    renderGrid(games.filter(g => g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q)));
  });

  // theme toggle
  const themeToggle = document.getElementById('themeToggle');
  function applyTheme(t){
    if (t === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
    localStorage.setItem('gn_theme', t);
    themeToggle.textContent = t === 'light' ? '☀️' : '🌙';
  }
  themeToggle.addEventListener('click', () => applyTheme(document.documentElement.classList.contains('light') ? 'dark' : 'light'));
  const saved = localStorage.getItem('gn_theme') || 'dark';
  applyTheme(saved);

  // initial render
  renderGrid(games);
});
