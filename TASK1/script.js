const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const quizEl = document.getElementById('quiz');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const resultEl = document.getElementById('result');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const certificateBtn = document.getElementById('certificate-btn');
const usernameInput = document.getElementById('username');
const nameSection = document.getElementById('name-section');

const questions = [
  {
    question: "What does HTML stand for?",
    options: ["HyperText Markup Language", "HighText Machine Language", "Hyper Tool Multi Language", "None"],
    answer: 0
  },
  {
    question: "Which language is used for styling web pages?",
    options: ["HTML", "JQuery", "CSS", "XML"],
    answer: 2
  },
  {
    question: "Which is not a JavaScript Framework?",
    options: ["Python Script", "JQuery", "Django", "NodeJS"],
    answer: 0
  },
  {
    question: "Which is used for Connect To Database?",
    options: ["PHP", "HTML", "JS", "All"],
    answer: 0
  }
];

let currentIndex = 0;
let score = 0;
let username = "";

startBtn.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (!username) {
    alert("Please enter your name");
    return;
  }
  nameSection.classList.add('hidden');
  quizEl.classList.remove('hidden');
  showQuestion();
});

function showQuestion() {
  const current = questions[currentIndex];
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";
  
  current.options.forEach((opt, index) => {
    const btn = document.createElement('div');
    btn.classList.add('option');
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(index));
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(selectedIndex) {
  const current = questions[currentIndex];
  const options = document.querySelectorAll('.option');
  
  options.forEach((opt, index) => {
    opt.style.pointerEvents = 'none';
    if (index === current.answer) opt.classList.add('correct');
    else if (index === selectedIndex) opt.classList.add('wrong');
  });
  
  if (selectedIndex === current.answer) score++;
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizEl.classList.add('hidden');
  resultEl.classList.remove('hidden');
  scoreEl.textContent = `${score} / ${questions.length}`;
  messageEl.textContent =
    score === questions.length
      ? "Excellent!"
      : score >= questions.length / 2
      ? "Good job!"
      : "Try again!";
}

restartBtn.addEventListener('click', () => {
  currentIndex = 0;
  score = 0;
  resultEl.classList.add('hidden');
  nameSection.classList.remove('hidden');
  usernameInput.value = "";
});

certificateBtn.addEventListener('click', () => {
  const canvas = document.getElementById('certificateCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 600;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Certificate of Completion", canvas.width / 2, 100);
  
  ctx.font = "20px Arial";
  ctx.fillText(`This certificate is proudly presented to`, canvas.width / 2, 180);

  ctx.font = "28px Arial";
  ctx.fillText(username, canvas.width / 2, 230);

  ctx.font = "18px Arial";
  ctx.fillText(`for successfully completing the JavaScript Quiz`, canvas.width / 2, 280);

  ctx.font = "16px Arial";
  ctx.fillText(`Score: ${score} / ${questions.length}`, canvas.width / 2, 330);

  const link = document.createElement('a');
  link.download = `${username}-Certificate.png`;
  link.href = canvas.toDataURL();
  link.click();
});
