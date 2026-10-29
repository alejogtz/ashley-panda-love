'use strict';

(() => {
  const messages = [
    'Ashley, encontrarte siempre se siente como descubrir un tesoro chiquito.',
    'Esta osita guarda un abrazo que te debo desde hace rato.',
    'Si el jardín fuera infinito, igual mi lugar favorito sería al lado tuyo.',
    'Tu risa tiene más magia que todas estas panditas juntas.',
    'Me gustás en versión lunes, domingo, despeinada y brillante.',
    'Sos mi nota secreta favorita.',
    'Cada vez que pienso en vos, el mundo se pone más suavecito.',
    'Ashley, vos sos mi lucky find.',
    'Prometo guardarte besos como estas ositas guardan cartitas.',
    'No hay disfraz que esconda lo mucho que te quiero.',
    'Si clickeás mi corazón, siempre aparece tu nombre.',
    'Tu forma de existir me hace querer quedarme.',
    'Esta pandita vota por más abrazos con Ashley.',
    'Te elegiría en cualquier mapa, jardín o universo.',
    'Encontrarte fue mi parte favorita del juego.',
    'Ashley, sos el final especial y también la aventura completa.'
  ];

  const costumes = ['🎀', '🌸', '👑', '🧣', '🎧', '⭐', '💌', '🌷', '🍓', '✨', '🫶', '💐', '🌙', '☁️', '💖', '🐾'];
  const palette = [
    ['#ffffff', '#2f2530'], ['#fff7ee', '#805a45'], ['#f7f2ff', '#5e4a86'], ['#fff', '#2f2530'],
    ['#fff3e8', '#7b5744'], ['#fefefe', '#2f2530'], ['#fff9f1', '#7b5744'], ['#fff', '#2f2530'],
    ['#f9f2ea', '#805a45'], ['#ffffff', '#2f2530'], ['#f6ecff', '#5e4a86'], ['#fffaf3', '#805a45'],
    ['#ffffff', '#2f2530'], ['#fff2e8', '#805a45'], ['#fff', '#2f2530'], ['#f7f2ff', '#5e4a86']
  ];
  const confettiColors = ['#ff5f9f', '#d9c7ff', '#bcebdc', '#ffd36a', '#ff8abf', '#ffffff'];

  const field = document.querySelector('#playground');
  const introCard = document.querySelector('#introCard');
  const closeIntro = document.querySelector('#closeIntro');
  const shuffleAgain = document.querySelector('#shuffleAgain');
  const playAgain = document.querySelector('#playAgain');
  const finale = document.querySelector('#finale');
  const confetti = document.querySelector('#confetti');
  const status = document.querySelector('#status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let critters = [];
  let openCritter = null;
  let luckyCritter = null;
  let hasWon = false;
  let frameId = 0;
  let lastTime = 0;
  let width = 0;
  let height = 0;
  let baseSize = 0;

  closeIntro.addEventListener('click', () => {
    introCard.hidden = true;
    status.textContent = 'Mensaje de inicio cerrado. El jardín queda listo para jugar.';
  });
  shuffleAgain.addEventListener('click', start);
  playAgain.addEventListener('click', start);
  window.addEventListener('resize', resize);
  start();

  function start() {
    cancelAnimationFrame(frameId);
    field.replaceChildren();
    confetti.replaceChildren();
    finale.hidden = true;
    hasWon = false;
    openCritter = null;
    measure();

    const order = shuffle(messages.map((_, index) => index));
    const luckyIndex = Math.floor(Math.random() * messages.length);

    critters = order.map((messageIndex, position) => {
      const element = buildCritter(messageIndex);
      const size = baseSize * randomBetween(0.82, 1.18);
      const margin = size * 0.58;
      const critter = {
        element,
        hop: element.querySelector('.critter__hop'),
        shadow: element.querySelector('.critter__shadow'),
        index: messageIndex,
        size,
        x: randomBetween(margin, width - margin),
        y: randomBetween(Math.max(170, margin), height - margin),
        vx: randomBetween(-0.28, 0.28) * size,
        vy: randomBetween(-0.22, 0.22) * size,
        bounce: randomBetween(0, Math.PI * 2),
        open: false
      };

      if (position === luckyIndex) luckyCritter = critter;
      element.style.setProperty('--size', `${size}px`);
      element.addEventListener('click', () => reveal(critter));
      field.append(element);
      draw(critter);
      return critter;
    });

    status.textContent = 'El jardín de panditas está listo. Tocá un personaje para abrir una cartita.';
    lastTime = performance.now();
    frameId = requestAnimationFrame(tick);
  }

  function buildCritter(index) {
    const element = document.createElement('button');
    const [fur, ear] = palette[index % palette.length];
    element.type = 'button';
    element.className = 'critter';
    element.setAttribute('aria-pressed', 'false');
    element.setAttribute('aria-label', `Abrir cartita ${index + 1} para Ashley`);
    element.style.setProperty('--fur', fur);
    element.style.setProperty('--ear', ear);
    element.style.setProperty('--tilt', `${randomBetween(-9, 9)}deg`);
    element.innerHTML = `
      <span class="critter__shadow"></span>
      <span class="critter__hop">
        <span class="critter__flip">
          <span class="critter__front" aria-hidden="true">
            <span class="critter__face">
              <span class="critter__costume">${costumes[index % costumes.length]}</span>
              <span class="critter__eyes"><i></i><i></i></span>
              <span class="critter__snout"></span>
              <span class="critter__blush"><i></i><i></i></span>
            </span>
          </span>
          <span class="critter__back">
            <span class="critter__note">${messages[index]}</span>
          </span>
        </span>
      </span>`;
    return element;
  }

  function tick(time) {
    const delta = Math.min((time - lastTime) / 1000 || 0, 0.05);
    lastTime = time;

    if (!hasWon && !reducedMotion.matches) {
      critters.forEach((critter) => {
        if (!critter.open) {
          critter.x += critter.vx * delta;
          critter.y += critter.vy * delta;
          critter.bounce += delta * 4.2;
          keepInside(critter);
        }
        draw(critter);
      });
    } else {
      critters.forEach(draw);
    }

    frameId = requestAnimationFrame(tick);
  }

  function reveal(critter) {
    if (hasWon) return;

    if (openCritter && openCritter !== critter) close(openCritter);
    if (openCritter === critter) {
      close(critter);
      openCritter = null;
      return;
    }

    critter.open = true;
    openCritter = critter;
    critter.element.classList.add('is-open');
    critter.element.setAttribute('aria-pressed', 'true');
    critter.element.setAttribute('aria-label', messages[critter.index]);
    status.textContent = messages[critter.index];

    if (critter === luckyCritter) win(critter);
  }

  function close(critter) {
    critter.open = false;
    critter.element.classList.remove('is-open');
    critter.element.setAttribute('aria-pressed', 'false');
    critter.element.setAttribute('aria-label', `Abrir cartita ${critter.index + 1} para Ashley`);
  }

  function win(critter) {
    hasWon = true;
    critter.element.classList.add('is-lucky');
    burstConfetti();
    window.setTimeout(() => {
      finale.hidden = false;
      playAgain.focus();
    }, reducedMotion.matches ? 0 : 700);
  }

  function draw(critter) {
    const lift = critter.open || reducedMotion.matches ? 0 : Math.max(0, Math.sin(critter.bounce)) * critter.size * 0.12;
    critter.element.style.transform = `translate3d(${critter.x - critter.size / 2}px, ${critter.y - critter.size / 2}px, 0)`;
    critter.element.style.zIndex = critter.open ? '70' : String(Math.round(critter.y));
    critter.hop.style.transform = `translateY(${-lift}px) rotate(${lift ? critter.vx * 0.018 : 0}deg)`;
    critter.shadow.style.transform = `scale(${1 - lift / critter.size})`;
  }

  function keepInside(critter) {
    const margin = critter.size * 0.55;
    const topMargin = Math.max(130, margin);

    if (critter.x < margin || critter.x > width - margin) critter.vx *= -1;
    if (critter.y < topMargin || critter.y > height - margin) critter.vy *= -1;

    critter.x = clamp(critter.x, margin, width - margin);
    critter.y = clamp(critter.y, topMargin, height - margin);
  }

  function resize() {
    const oldWidth = width || window.innerWidth;
    const oldHeight = height || window.innerHeight;
    measure();

    critters.forEach((critter) => {
      critter.x = clamp((critter.x / oldWidth) * width, critter.size * 0.55, width - critter.size * 0.55);
      critter.y = clamp((critter.y / oldHeight) * height, Math.max(130, critter.size * 0.55), height - critter.size * 0.55);
      draw(critter);
    });
  }

  function measure() {
    width = field.clientWidth || window.innerWidth;
    height = field.clientHeight || window.innerHeight;
    baseSize = clamp(Math.sqrt((width * height) / messages.length) * 0.48, 74, 150);
  }

  function burstConfetti() {
    confetti.replaceChildren();
    for (let index = 0; index < 90; index += 1) {
      const bit = document.createElement('i');
      bit.style.left = `${randomBetween(0, 100)}%`;
      bit.style.setProperty('--confetti-color', confettiColors[index % confettiColors.length]);
      bit.style.setProperty('--time', `${randomBetween(1.6, 3.2)}s`);
      bit.style.setProperty('--drift', `${randomBetween(-140, 140)}px`);
      bit.style.setProperty('--quiet-y', `${randomBetween(0, 100)}%`);
      bit.style.animationDelay = `${randomBetween(-0.5, 0.1)}s`;
      confetti.append(bit);
    }
  }

  function shuffle(items) {
    const bag = items.slice();
    for (let index = bag.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [bag[index], bag[swapIndex]] = [bag[swapIndex], bag[index]];
    }
    return bag;
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
})();
