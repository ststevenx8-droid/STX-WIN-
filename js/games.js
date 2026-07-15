document.addEventListener('DOMContentLoaded', () => {
  // Sync starting/current balance in lobby view
  const currentBalance = localStorage.getItem('casino_balance') || '10000';
  document.getElementById('lobby-balance').innerText = parseFloat(currentBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Direct Links/Navigation
  const superAceCard = document.getElementById('super-ace-card');
  const featuredPlayBtn = document.getElementById('featured-play-btn');

  const launchSuperAce = () => {
    window.location.href = 'slot.html';
  };

  if (superAceCard) superAceCard.addEventListener('click', launchSuperAce);
  if (featuredPlayBtn) featuredPlayBtn.addEventListener('click', launchSuperAce);

  // Search Filter Interaction
  const searchInput = document.getElementById('game-search');
  const cards = document.querySelectorAll('.game-card');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    cards.forEach(card => {
      const title = card.querySelector('h3').innerText.toLowerCase();
      if (title.includes(query)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });

  // Filter Categories
  const catBtns = document.querySelectorAll('.cat-btn');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');
      cards.forEach(card => {
        if (cat === 'all') {
          card.style.display = 'block';
        } else {
          const cardCat = card.getAttribute('data-category');
          card.style.display = cardCat === cat ? 'block' : 'none';
        }
      });
    });
  });

  // Favorite Heart Toggle
  const hearts = document.querySelectorAll('.favorite-heart');
  hearts.forEach(heart => {
    heart.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering card navigation
      heart.classList.toggle('active');
    });
  });
});
