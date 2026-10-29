const loveMessages = [
  "Ashley, vos hacés que hasta los días simples se sientan mágicos.",
  "Tu sonrisa es mi lugar favorito para volver.",
  "Si fueras un pandita, igual te elegiría entre todos los bosques.",
  "Me encanta la forma en que volvés tierno todo lo que tocás.",
  "Sos mi casualidad favorita y mi decisión más linda.",
  "Cada mensajito tuyo me arregla un pedacito del día.",
  "Con vos, el amor se siente suavecito, como abrazo de osita.",
  "Ashley, gracias por existir justo de esa manera tan tuya.",
  "Te quiero en todos los planes: los grandes, los chiquitos y los de domingo.",
  "Ojalá esta canastita pudiera guardar todos los besos que te debo.",
  "Mi parte favorita del juego es que siempre termino pensando en vos.",
  "Ganaste: sos mi premio, mi suerte y mi hogar bonito."
];

const cuteItems = ["🐼", "🧸", "💖", "💌", "🌸"];

const stage = document.querySelector("#gameStage");
const fallingItemsLayer = document.querySelector("#fallingItems");
const basket = document.querySelector("#basket");
const scoreNode = document.querySelector("#score");
const unlockedNode = document.querySelector("#unlocked");
const totalMessagesNode = document.querySelector("#totalMessages");
const currentMessageNode = document.querySelector("#currentMessage");
const notesGrid = document.querySelector("#notesGrid");
const surpriseButton = document.querySelector("#surpriseButton");

const state = {
  basketX: 50,
  score: 0,
  unlocked: 0,
  items: [],
  lastTime: 0,
  spawnTimer: 0,
  reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
};

totalMessagesNode.textContent = loveMessages.length.toString();
renderNotes();
moveBasket(50);
requestAnimationFrame(tick);

surpriseButton.addEventListener("click", () => {
  unlockMessage(Math.floor(Math.random() * loveMessages.length));
});

stage.addEventListener("pointermove", (event) => {
  const bounds = stage.getBoundingClientRect();
  const percent = ((event.clientX - bounds.left) / bounds.width) * 100;
  moveBasket(percent);
});

stage.addEventListener("pointerdown", (event) => {
  stage.setPointerCapture(event.pointerId);
  stage.focus();
});

stage.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveBasket(state.basketX - 7);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    moveBasket(state.basketX + 7);
  }
});

function tick(time) {
  const delta = Math.min(time - state.lastTime || 16, 48);
  state.lastTime = time;
  state.spawnTimer += delta;

  if (state.spawnTimer > (state.reduceMotion ? 1800 : 950)) {
    state.spawnTimer = 0;
    spawnItem();
  }

  updateItems(delta);
  requestAnimationFrame(tick);
}

function moveBasket(percent) {
  state.basketX = clamp(percent, 8, 92);
  basket.style.left = `${state.basketX}%`;
}

function spawnItem() {
  const item = document.createElement("span");
  const size = 54;
  const x = randomBetween(8, 92);
  const speed = state.reduceMotion ? randomBetween(0.06, 0.1) : randomBetween(0.12, 0.2);
  const icon = cuteItems[Math.floor(Math.random() * cuteItems.length)];

  item.className = "falling-item";
  item.textContent = icon;
  item.style.left = `${x}%`;
  fallingItemsLayer.appendChild(item);

  state.items.push({ element: item, x, y: -size, size, speed, caught: false });
}

function updateItems(delta) {
  const stageHeight = stage.clientHeight;
  const basketZone = stageHeight - 92;

  state.items.forEach((item) => {
    item.y += item.speed * delta;
    item.element.style.transform = `translate(-50%, ${item.y}px)`;

    const closeToBasket = Math.abs(item.x - state.basketX) < 9;
    const lowEnough = item.y > basketZone - 48;

    if (!item.caught && closeToBasket && lowEnough) {
      item.caught = true;
      catchItem(item);
    }
  });

  state.items = state.items.filter((item) => {
    const keep = item.y < stageHeight + 80 && !item.caught;
    if (!keep) item.element.remove();
    return keep;
  });
}

function catchItem(item) {
  state.score += 1;
  scoreNode.textContent = state.score.toString();
  unlockMessage(state.score - 1);
  item.element.remove();
}

function unlockMessage(index) {
  const messageIndex = index % loveMessages.length;
  const message = loveMessages[messageIndex];

  state.unlocked = Math.max(state.unlocked, Math.min(messageIndex + 1, loveMessages.length));
  unlockedNode.textContent = state.unlocked.toString();
  currentMessageNode.textContent = message;
  renderNotes();
}

function renderNotes() {
  notesGrid.innerHTML = loveMessages.map((message, index) => {
    const unlocked = index < state.unlocked;
    if (!unlocked) {
      return `<li class="note-card note-card--locked">Mensaje ${index + 1} bloqueado · atrapá más amorcitos</li>`;
    }

    return `<li class="note-card"><span class="note-card__icon" aria-hidden="true">${cuteItems[index % cuteItems.length]}</span>${message}</li>`;
  }).join("");
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
