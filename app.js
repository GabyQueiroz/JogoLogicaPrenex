const STORAGE_KEY = "missao-prenex-ranking-v2";

const stages = [
  {
    world: "Treino",
    title: "Portal do Prefixo",
    icon: "∀",
    prompt: "Monte a forma prenex arrastando ou clicando nas peças certas.",
    formula: "∀xP(x) ∧ ∃yQ(y)",
    slots: ["∀x", "∃y", "(P(x) ∧ Q(y))"],
    pieces: ["∃y", "(P(x) ∨ Q(y))", "∀x", "(P(x) ∧ Q(y))", "∃x"],
    hint: "Na conjunção, traga os quantificadores para a frente e mantenha ∧ na matriz.",
    explanation: "A resposta é ∀x∃y(P(x) ∧ Q(y)). As variáveis já são diferentes.",
  },
  {
    world: "Treino",
    title: "Matriz Protegida",
    icon: "α",
    prompt: "Leve para os slots o prefixo e a matriz correta.",
    formula: "∀x∃y(P(x) ∨ R(y))",
    slots: ["∀x", "∃y", "(P(x) ∨ R(y))"],
    pieces: ["(P(x) ∧ R(y))", "∃y", "∀x", "P(x)", "(P(x) ∨ R(y))"],
    hint: "A matriz não tem quantificadores.",
    explanation: "Prefixo: ∀x∃y. Matriz: P(x) ∨ R(y).",
  },
  {
    world: "Renomeação",
    title: "Variável Capturada",
    icon: "↻",
    prompt: "Evite usar a mesma variável quantificada duas vezes.",
    formula: "∀xP(x) ∧ ∃xQ(x)",
    slots: ["∀x", "∃w", "(P(x) ∧ Q(w))"],
    pieces: ["∀x", "∃x", "(P(x) ∧ Q(x))", "∃w", "(P(x) ∧ Q(w))"],
    hint: "Renomeie uma das ocorrências de x antes de montar a fórmula.",
    explanation: "A conversão segura é ∀x∃w(P(x) ∧ Q(w)).",
  },
  {
    world: "Disjunção",
    title: "Ponte do Ou",
    icon: "∨",
    prompt: "Construa a disjunção em forma prenex.",
    formula: "∃z∀xP(z,x) ∨ ∃yQ(y)",
    slots: ["∃z", "∀x", "∃y", "(P(z,x) ∨ Q(y))"],
    pieces: ["∀x", "∃y", "(P(z,x) ∧ Q(y))", "∃z", "(P(z,x) ∨ Q(y))", "∀z"],
    hint: "A disjunção mantém ∨ na matriz depois que o prefixo vem para frente.",
    explanation: "A forma correta é ∃z∀x∃y(P(z,x) ∨ Q(y)).",
  },
  {
    world: "Negação",
    title: "Inversor Existencial",
    icon: "¬",
    prompt: "A negação atravessa o quantificador. Escolha as peças transformadas.",
    formula: "¬∃xP(x)",
    slots: ["∀x", "¬P(x)"],
    pieces: ["∃x", "P(x)", "∀x", "¬P(x)", "¬∀x"],
    hint: "Negar ∃ transforma em ∀ e leva a negação para o predicado.",
    explanation: "¬∃xP(x) equivale a ∀x¬P(x).",
  },
  {
    world: "Negação",
    title: "Inversor Universal",
    icon: "¬",
    prompt: "Passe a negação para perto do predicado.",
    formula: "¬∀xP(x)",
    slots: ["∃x", "¬P(x)"],
    pieces: ["∀x", "¬P(x)", "∃x", "P(x)", "¬∃x"],
    hint: "Negar ∀ transforma em ∃.",
    explanation: "¬∀xP(x) equivale a ∃x¬P(x).",
  },
  {
    world: "Implicação",
    title: "Portal do Antecedente",
    icon: "→",
    prompt: "No antecedente, o quantificador inverte ao vir para frente.",
    formula: "∀yP(y) → ∀xR(x)",
    slots: ["∃y", "∀x", "(P(y) → R(x))"],
    pieces: ["∀y", "∃y", "∀x", "(P(y) ∧ R(x))", "(P(y) → R(x))"],
    hint: "Pense em A → B como ¬A ∨ B.",
    explanation: "O ∀ do antecedente passa como ∃: ∃y∀x(P(y) → R(x)).",
  },
  {
    world: "Implicação",
    title: "Duelo de Y",
    icon: "→",
    prompt: "Renomeie o y do consequente e monte a fórmula final.",
    formula: "∀yP(y) → ∀x∃yR(y,x)",
    slots: ["∃y", "∀x", "∃z", "(P(y) → R(z,x))"],
    pieces: ["∃y", "∀x", "∃y", "(P(y) → R(y,x))", "∃z", "(P(y) → R(z,x))"],
    hint: "O y do consequente deve virar z para não confundir com o y do antecedente.",
    explanation: "A forma correta é ∃y∀x∃z(P(y) → R(z,x)).",
  },
  {
    world: "Chefão",
    title: "Prefixo Completo",
    icon: "★",
    prompt: "Monte a maior fórmula antes que as vidas acabem.",
    formula: "∀x(P(x) ∧ Q(x)) ∨ ∃x(R(x) ∧ S(y))",
    slots: ["∀x", "∃w", "((P(x) ∧ Q(x)) ∨ (R(w) ∧ S(y)))"],
    pieces: [
      "∃x",
      "∀x",
      "∃w",
      "(P(x) ∧ Q(x))",
      "((P(x) ∧ Q(x)) ∨ (R(w) ∧ S(y)))",
      "((P(x) ∨ Q(x)) ∧ R(w))",
    ],
    hint: "Há dois x quantificados. Renomeie o x do segundo bloco.",
    explanation: "Uma resposta segura é ∀x∃w((P(x) ∧ Q(x)) ∨ (R(w) ∧ S(y))).",
  },
];

const state = {
  player: "",
  index: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  solved: 0,
  mistakes: 0,
  lives: 3,
  hintUsed: false,
  startedAt: 0,
  board: [],
};

const $ = (selector) => document.querySelector(selector);

const screens = {
  start: $("#start-screen"),
  game: $("#game-screen"),
  result: $("#result-screen"),
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

let sessionStages = stages;

function startGame(player) {
  state.player = player.trim();
  state.index = 0;
  state.score = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.solved = 0;
  state.mistakes = 0;
  state.lives = 3;
  state.startedAt = Date.now();
  sessionStages = [...stages];
  $("#hud-player").textContent = state.player;
  showScreen("game");
  renderStage();
}

function renderStage() {
  const stage = sessionStages[state.index];
  state.hintUsed = false;
  state.board = Array(stage.slots.length).fill(null);

  $("#level-label").textContent = `${stage.world} · ${state.index + 1}/${sessionStages.length}`;
  $("#challenge-title").textContent = stage.title;
  $("#challenge-icon").textContent = stage.icon;
  $("#challenge-prompt").textContent = stage.prompt;
  $("#formula-box").textContent = stage.formula;
  $("#progress-bar").style.width = `${(state.index / sessionStages.length) * 100}%`;
  $("#feedback").hidden = true;
  $("#feedback").textContent = "";
  $("#next-button").disabled = true;
  $("#hint-button").disabled = false;
  updateHud();
  renderSlots(stage);
  renderPieces(stage);
}

function updateHud() {
  $("#hud-score").textContent = state.score;
  $("#hud-streak").textContent = state.streak;
  $("#hud-lives").textContent = "♥".repeat(state.lives) || "0";
}

function renderSlots(stage) {
  const slots = $("#prefix-slots");
  slots.innerHTML = "";
  stage.slots.forEach((slot, index) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "slot";
    node.dataset.index = index;
    node.textContent = state.board[index] ?? (index === stage.slots.length - 1 ? "matriz" : `peça ${index + 1}`);
    node.addEventListener("dragover", (event) => event.preventDefault());
    node.addEventListener("drop", (event) => {
      event.preventDefault();
      placePiece(event.dataTransfer.getData("text/plain"), index);
    });
    node.addEventListener("click", () => removePiece(index));
    slots.appendChild(node);
  });
}

function renderPieces(stage) {
  const rack = $("#piece-rack");
  rack.innerHTML = "";
  shuffle(stage.pieces).forEach((piece) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "piece";
    node.textContent = piece;
    node.draggable = true;
    node.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", piece);
    });
    node.addEventListener("click", () => placePiece(piece));
    rack.appendChild(node);
  });
}

function placePiece(piece, forcedIndex = null) {
  const stage = sessionStages[state.index];
  const index = forcedIndex ?? state.board.findIndex((value) => value === null);
  if (index === -1) return;

  const expected = stage.slots[index];
  if (piece === expected) {
    state.board[index] = piece;
    renderSlots(stage);
    pulseFeedback(`Peça encaixada: ${piece}`, true);
    if (state.board.every(Boolean)) completeStage();
    return;
  }

  state.mistakes += 1;
  state.streak = 0;
  state.lives -= 1;
  updateHud();
  pulseFeedback(`Essa peça não encaixa no slot ${index + 1}. Observe a ordem do prefixo.`, false);
  if (state.lives <= 0) finishGame();
}

function removePiece(index) {
  const stage = sessionStages[state.index];
  if (!state.board[index]) return;
  state.board[index] = null;
  renderSlots(stage);
}

function completeStage() {
  const stage = sessionStages[state.index];
  const base = 180;
  const streakBonus = Math.min(state.streak * 25, 125);
  const lifeBonus = state.lives * 20;
  const hintPenalty = state.hintUsed ? 40 : 0;
  const gained = base + streakBonus + lifeBonus - hintPenalty;
  state.score += gained;
  state.streak += 1;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  state.solved += 1;
  updateHud();
  $("#feedback").hidden = false;
  $("#feedback").className = "feedback success";
  $("#feedback").textContent = `Fase concluída! +${gained} pontos. ${stage.explanation}`;
  $("#next-button").disabled = false;
  $("#hint-button").disabled = true;
  document.querySelectorAll(".piece").forEach((piece) => {
    piece.disabled = true;
    piece.draggable = false;
  });
}

function pulseFeedback(message, success) {
  const feedback = $("#feedback");
  feedback.hidden = false;
  feedback.className = success ? "feedback success" : "feedback danger-box";
  feedback.textContent = message;
}

function showHint() {
  const stage = sessionStages[state.index];
  state.hintUsed = true;
  $("#hint-button").disabled = true;
  pulseFeedback(`Dica: ${stage.hint}`, true);
}

function nextStage() {
  if (state.index + 1 >= sessionStages.length) {
    finishGame();
    return;
  }
  state.index += 1;
  state.lives = Math.min(3, state.lives + 1);
  renderStage();
}

function finishGame() {
  $("#progress-bar").style.width = "100%";
  const total = sessionStages.length;
  const accuracy = Math.round((state.solved / total) * 100);
  const durationSeconds = Math.round((Date.now() - state.startedAt) / 1000);
  const record = {
    name: state.player,
    score: state.score,
    accuracy,
    correct: state.solved,
    total,
    bestStreak: state.bestStreak,
    durationSeconds,
    date: new Date().toLocaleString("pt-BR"),
  };

  saveRecord(record);
  $("#result-title").textContent =
    state.lives <= 0 ? `${state.player}, tente a missão de novo` : `${state.player}, missão concluída!`;
  $("#result-summary").textContent =
    accuracy >= 80
      ? "Você montou fórmulas prenex com ótimo controle de prefixo, matriz e renomeação."
      : "Você avançou, mas precisa treinar a ordem dos quantificadores e a inversão pela negação.";
  $("#final-score").textContent = state.score;
  $("#final-accuracy").textContent = `${accuracy}%`;
  $("#final-best-streak").textContent = state.bestStreak;
  showScreen("result");
  renderRanking();
}

function getRanking() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function setRanking(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function saveRecord(record) {
  const ranking = getRanking();
  ranking.push(record);
  ranking.sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
  setRanking(ranking.slice(0, 100));
}

function renderRanking() {
  const list = $("#ranking-list");
  const ranking = getRanking().slice(0, 10);
  list.innerHTML = "";

  if (ranking.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Ainda não há resultados salvos.";
    list.appendChild(empty);
    return;
  }

  ranking.forEach((record) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${escapeHtml(record.name)} · ${record.score} pontos</strong><span>${record.accuracy}% concluído · melhor combo ${record.bestStreak} · ${record.date}</span>`;
    list.appendChild(item);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[char];
  });
}

function toCsv(records) {
  const header = ["nome", "pontos", "conclusao_percentual", "fases", "total", "melhor_combo", "tempo_segundos", "data"];
  const rows = records.map((record) => [
    record.name,
    record.score,
    record.accuracy,
    record.correct,
    record.total,
    record.bestStreak,
    record.durationSeconds,
    record.date,
  ]);
  return [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

function exportRanking() {
  const csv = toCsv(getRanking());
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ranking-missao-prenex.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function importRanking(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const rows = String(reader.result)
      .split(/\r?\n/)
      .slice(1)
      .filter(Boolean)
      .map(parseCsvLine)
      .map(([name, score, accuracy, correct, total, bestStreak, durationSeconds, date]) => ({
        name,
        score: Number(score),
        accuracy: Number(accuracy),
        correct: Number(correct),
        total: Number(total),
        bestStreak: Number(bestStreak),
        durationSeconds: Number(durationSeconds),
        date,
      }))
      .filter((record) => record.name && Number.isFinite(record.score));
    const merged = [...getRanking(), ...rows].sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
    setRanking(merged.slice(0, 100));
    renderRanking();
  };
  reader.readAsText(file, "utf-8");
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function copyResult() {
  const ranking = getRanking();
  const latest = ranking.find((record) => record.name === state.player && record.score === state.score) ?? ranking[0];
  const text = `Missão Prenex - ${latest.name}: ${latest.score} pontos, ${latest.accuracy}% concluído, melhor combo ${latest.bestStreak}.`;
  navigator.clipboard?.writeText(text);
  $("#copy-result").textContent = "Copiado";
  setTimeout(() => {
    $("#copy-result").textContent = "Copiar resultado";
  }, 1400);
}

$("#player-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#player-name").value.trim();
  if (name) startGame(name);
});

$("#hint-button").addEventListener("click", showHint);
$("#next-button").addEventListener("click", nextStage);
$("#play-again").addEventListener("click", () => showScreen("start"));
$("#copy-result").addEventListener("click", copyResult);
$("#export-ranking").addEventListener("click", exportRanking);
$("#import-ranking").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) importRanking(file);
  event.target.value = "";
});

renderRanking();
