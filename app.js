const STORAGE_KEY = "missao-prenex-ranking-v1";

const challenges = [
  {
    level: "Fase 1",
    title: "Reconheça a forma",
    icon: "∀",
    prompt: "Qual fórmula já está em Forma Normal Prenex?",
    formula: "Escolha a alternativa em que todos os quantificadores aparecem antes da matriz.",
    options: [
      "∀x∃y(P(x) ∧ Q(y))",
      "P(x) ∧ ∃yQ(y)",
      "¬∀xP(x)",
      "P(x) → ∃yR(y)",
    ],
    answer: 0,
    hint: "Prenex vem de colocar o prefixo de quantificadores à frente.",
    explanation: "Na alternativa correta, ∀x∃y é o prefixo e P(x) ∧ Q(y) é a matriz.",
  },
  {
    level: "Fase 1",
    title: "Prefixo e matriz",
    icon: "α",
    prompt: "Na fórmula ∀x∃y(P(x) ∨ R(y)), qual é a matriz?",
    formula: "∀x∃y(P(x) ∨ R(y))",
    options: ["∀x∃y", "P(x) ∨ R(y)", "∃y(P(x) ∨ R(y))", "x e y"],
    answer: 1,
    hint: "A matriz é a parte sem quantificadores.",
    explanation: "A matriz é P(x) ∨ R(y), pois o prefixo é ∀x∃y.",
  },
  {
    level: "Fase 2",
    title: "Conjunção",
    icon: "∧",
    prompt: "Transforme a conjunção em uma forma prenex equivalente.",
    formula: "∀xP(x) ∧ ∃yQ(y)",
    options: [
      "∀x∃y(P(x) ∧ Q(y))",
      "∃y∀x(P(x) → Q(y))",
      "∀x(P(x) ∧ ∃yQ(y))",
      "∃x∀y(P(x) ∨ Q(y))",
    ],
    answer: 0,
    hint: "Traga os quantificadores para frente e envolva a matriz com parênteses.",
    explanation: "Como as variáveis são diferentes, basta formar o prefixo ∀x∃y e a matriz P(x) ∧ Q(y).",
  },
  {
    level: "Fase 2",
    title: "Variáveis repetidas",
    icon: "↻",
    prompt: "Qual conversão evita o erro de usar a mesma variável quantificada duas vezes?",
    formula: "∀xP(x) ∧ ∃xQ(x)",
    options: [
      "∀x∃x(P(x) ∧ Q(x))",
      "∀x∃w(P(x) ∧ Q(w))",
      "∃x∀x(P(x) ∧ Q(x))",
      "∀x(P(x) ∧ Q(x))",
    ],
    answer: 1,
    hint: "Quando as variáveis quantificadas são iguais, renomeie uma delas.",
    explanation: "Renomear o segundo x para w evita capturar a variável e preserva o sentido da fórmula.",
  },
  {
    level: "Fase 3",
    title: "Disjunção",
    icon: "∨",
    prompt: "Escolha a forma prenex da disjunção.",
    formula: "∃z∀xP(z,x) ∨ ∃yQ(y)",
    options: [
      "∃z∀x∃y(P(z,x) ∨ Q(y))",
      "∀x∃z∃y(P(z,x) ∧ Q(y))",
      "∃y(P(z,x) ∨ Q(y))",
      "∃z∀x(P(z,x) → Q(y))",
    ],
    answer: 0,
    hint: "Na disjunção, os quantificadores também vão para frente.",
    explanation: "O prefixo correto é ∃z∀x∃y, seguido da matriz P(z,x) ∨ Q(y).",
  },
  {
    level: "Fase 3",
    title: "Negação",
    icon: "¬",
    prompt: "O que acontece ao negar um quantificador existencial?",
    formula: "¬∃xP(x)",
    options: ["∀x¬P(x)", "∃x¬P(x)", "¬∀xP(x)", "∀xP(x)"],
    answer: 0,
    hint: "A negação troca ∃ por ∀ e segue para perto do predicado.",
    explanation: "¬∃xP(x) é equivalente a ∀x¬P(x).",
  },
  {
    level: "Fase 3",
    title: "Negação dupla de ideia",
    icon: "¬",
    prompt: "Qual é a transformação correta?",
    formula: "¬∀xP(x)",
    options: ["∃x¬P(x)", "∀x¬P(x)", "¬∃xP(x)", "∃xP(x)"],
    answer: 0,
    hint: "Negar 'para todo' vira 'existe' com negação no predicado.",
    explanation: "Se não é verdade para todo x, então existe algum x para o qual P(x) é falso.",
  },
  {
    level: "Fase 4",
    title: "Implicação no antecedente",
    icon: "→",
    prompt: "Na implicação, o quantificador do antecedente vai para frente como?",
    formula: "∀yP(y) → ∀xR(x)",
    options: [
      "∃y∀x(P(y) → R(x))",
      "∀y∀x(P(y) → R(x))",
      "∃y∀x(P(y) ∧ R(x))",
      "∀x∃y(R(x) → P(y))",
    ],
    answer: 0,
    hint: "O antecedente é invertido ao passar para frente.",
    explanation: "Reescrevendo A → B como ¬A ∨ B, o ∀ do antecedente se torna ∃.",
  },
  {
    level: "Fase 4",
    title: "Implicação no consequente",
    icon: "→",
    prompt: "Escolha a forma prenex considerando a renomeação de variável.",
    formula: "∀yP(y) → ∀x∃yR(y,x)",
    options: [
      "∃y∀x∃z(P(y) → R(z,x))",
      "∀y∀x∃y(P(y) → R(y,x))",
      "∃x∀y∃z(P(y) ∧ R(z,x))",
      "∀x∃z∀y(R(z,x) → P(y))",
    ],
    answer: 0,
    hint: "O consequente mantém seus quantificadores; a variável repetida precisa ser renomeada.",
    explanation: "O y do consequente foi renomeado para z, e o quantificador do antecedente ∀y passou como ∃y.",
  },
  {
    level: "Desafio final",
    title: "Diagnóstico",
    icon: "★",
    prompt: "Qual alternativa descreve melhor a Forma Normal Prenex?",
    formula: "Q1x1 Q2x2 ... Qnxn α",
    options: [
      "Um prefixo de quantificadores seguido de uma matriz sem quantificadores.",
      "Uma fórmula sem conectivos lógicos.",
      "Uma fórmula em que só aparece o quantificador universal.",
      "Uma fórmula que sempre começa com negação.",
    ],
    answer: 0,
    hint: "O slide chama α de matriz.",
    explanation: "A forma prenex separa prefixo de quantificadores e matriz livre de quantificadores.",
  },
  {
    level: "Desafio final",
    title: "Caça ao erro",
    icon: "!",
    prompt: "Por que ∀xP(x) ∧ ∃xQ(x) ⇔ ∀x∃x(P(x) ∧ Q(x)) está errado?",
    formula: "∀xP(x) ∧ ∃xQ(x) ⇔ ∀x∃x(P(x) ∧ Q(x))",
    options: [
      "Porque a variável x foi reutilizada e precisa ser renomeada.",
      "Porque conjunções não podem ir para a forma prenex.",
      "Porque o símbolo ∧ deve virar ∨.",
      "Porque todo ∃ deve ser apagado.",
    ],
    answer: 0,
    hint: "O próprio slide alerta: cuidado quando as variáveis quantificadas forem iguais.",
    explanation: "A conversão correta pode ser ∀x∃w(P(x) ∧ Q(w)).",
  },
  {
    level: "Desafio final",
    title: "Exercício de aula",
    icon: "✓",
    prompt: "Qual é uma boa primeira ação para converter a fórmula abaixo?",
    formula: "¬(∀x(P(x,z) ∧ R(x,y)) ∨ (∃xP(x,z) ∨ ∀xR(x,y)))",
    options: [
      "Distribuir a negação e inverter quantificadores quando ela alcançar ∀ ou ∃.",
      "Apagar todos os quantificadores para sobrar só a matriz.",
      "Trocar todos os conectivos por implicação.",
      "Manter a negação fora e apenas copiar os quantificadores.",
    ],
    answer: 0,
    hint: "A negação precisa caminhar para perto dos predicados.",
    explanation: "Para chegar à prenex, a negação deve ser empurrada para dentro, invertendo ∀ e ∃ quando atravessa quantificadores.",
  },
];

const state = {
  player: "",
  index: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  correct: 0,
  answered: false,
  hintUsed: false,
  startedAt: 0,
};

const $ = (selector) => document.querySelector(selector);

const screens = {
  start: $("#start-screen"),
  game: $("#game-screen"),
  result: $("#result-screen"),
};

const showScreen = (name) => {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
};

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

let sessionChallenges = shuffle(challenges).slice(0, 10);

function startGame(player) {
  state.player = player.trim();
  state.index = 0;
  state.score = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.correct = 0;
  state.startedAt = Date.now();
  sessionChallenges = shuffle(challenges).slice(0, 10);
  $("#hud-player").textContent = state.player;
  showScreen("game");
  renderChallenge();
}

function renderChallenge() {
  const challenge = sessionChallenges[state.index];
  state.answered = false;
  state.hintUsed = false;

  $("#level-label").textContent = `${challenge.level} · ${state.index + 1}/${sessionChallenges.length}`;
  $("#challenge-title").textContent = challenge.title;
  $("#challenge-icon").textContent = challenge.icon;
  $("#challenge-prompt").textContent = challenge.prompt;
  $("#formula-box").textContent = challenge.formula;
  $("#hud-score").textContent = state.score;
  $("#hud-streak").textContent = state.streak;
  $("#progress-bar").style.width = `${(state.index / sessionChallenges.length) * 100}%`;
  $("#feedback").hidden = true;
  $("#feedback").textContent = "";
  $("#next-button").disabled = true;
  $("#hint-button").disabled = false;

  const options = $("#options");
  options.innerHTML = "";
  challenge.options.forEach((option, optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => answer(optionIndex));
    options.appendChild(button);
  });
}

function answer(optionIndex) {
  if (state.answered) return;

  const challenge = sessionChallenges[state.index];
  const buttons = [...document.querySelectorAll(".option")];
  const isCorrect = optionIndex === challenge.answer;
  state.answered = true;

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === challenge.answer) button.classList.add("is-correct");
    if (index === optionIndex && !isCorrect) button.classList.add("is-wrong");
  });

  if (isCorrect) {
    const streakBonus = Math.min(state.streak * 15, 60);
    const hintPenalty = state.hintUsed ? 25 : 0;
    const gained = 100 + streakBonus - hintPenalty;
    state.score += gained;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.correct += 1;
    $("#feedback").textContent = `Acertou! +${gained} pontos. ${challenge.explanation}`;
  } else {
    state.streak = 0;
    $("#feedback").textContent = `Quase. ${challenge.explanation}`;
  }

  $("#hud-score").textContent = state.score;
  $("#hud-streak").textContent = state.streak;
  $("#feedback").hidden = false;
  $("#next-button").disabled = false;
}

function showHint() {
  const challenge = sessionChallenges[state.index];
  state.hintUsed = true;
  $("#hint-button").disabled = true;
  $("#feedback").textContent = `Dica: ${challenge.hint}`;
  $("#feedback").hidden = false;
}

function nextChallenge() {
  if (state.index + 1 >= sessionChallenges.length) {
    finishGame();
    return;
  }
  state.index += 1;
  renderChallenge();
}

function finishGame() {
  $("#progress-bar").style.width = "100%";
  const total = sessionChallenges.length;
  const accuracy = Math.round((state.correct / total) * 100);
  const durationSeconds = Math.round((Date.now() - state.startedAt) / 1000);
  const record = {
    name: state.player,
    score: state.score,
    accuracy,
    correct: state.correct,
    total,
    bestStreak: state.bestStreak,
    durationSeconds,
    date: new Date().toLocaleString("pt-BR"),
  };

  saveRecord(record);
  $("#result-title").textContent = `${state.player}, missão concluída!`;
  $("#result-summary").textContent =
    accuracy >= 80
      ? "Excelente domínio dos quantificadores. A matriz saiu inteira da fase."
      : "Bom treino. Revise as regras de negação, implicação e renomeação antes da próxima rodada.";
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
    item.innerHTML = `<strong>${escapeHtml(record.name)} · ${record.score} pontos</strong><span>${record.accuracy}% de acerto · melhor sequência ${record.bestStreak} · ${record.date}</span>`;
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
  const header = ["nome", "pontos", "acertos_percentual", "acertos", "total", "melhor_sequencia", "tempo_segundos", "data"];
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
  const text = `Missão Prenex - ${latest.name}: ${latest.score} pontos, ${latest.accuracy}% de acerto, melhor sequência ${latest.bestStreak}.`;
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
$("#next-button").addEventListener("click", nextChallenge);
$("#play-again").addEventListener("click", () => showScreen("start"));
$("#copy-result").addEventListener("click", copyResult);
$("#export-ranking").addEventListener("click", exportRanking);
$("#clear-ranking").addEventListener("click", () => {
  if (confirm("Limpar todos os resultados salvos neste navegador?")) {
    setRanking([]);
    renderRanking();
  }
});
$("#import-ranking").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) importRanking(file);
  event.target.value = "";
});

renderRanking();
