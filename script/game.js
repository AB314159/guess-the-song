// game.js - updated with clue control and round management
let currentTeamIndex = 0;
let currentClue = 0;
let teams = [];
let songs = [];
let round = 1;
let scores = [];
let timeLeft = 15;
let timerInterval;
let selectedDifficulty = "easy";

function loadGame() {
  teams = JSON.parse(localStorage.getItem("teams")) || ["Team 1", "Team 2"];
  scores = teams.map(() => 0);

  showDifficultySelector();
}

function showDifficultySelector() {
  const container = document.getElementById("gameArea");
  container.innerHTML = `
    <h1>Select Difficulty for Round ${round}</h1>
    <select id="difficultySelect">
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select><br>
    <button onclick="startRound()" class="btn">Start Round</button>
  `;
}

function startRound() {
  selectedDifficulty = document.getElementById("difficultySelect").value;
  const allSongs = JSON.parse(localStorage.getItem("songs")) || [];
  songs = allSongs.filter(song => song.difficulty === selectedDifficulty);

  if (songs.length < teams.length) {
    alert("Not enough songs of this difficulty for all teams!");
    return;
  }

  currentTeamIndex = 0;
  currentClue = 0;
  renderGameUI();
  showClue();
  startTimer();
}

function renderGameUI() {
  const container = document.getElementById("gameArea");
  container.innerHTML = `
    <h1 id="roundTitle">Round ${round}</h1>
    <div id="teamTurn">${teams[currentTeamIndex]}'s Turn</div>
    <img id="clueImage" class="clue-img" />
    <input type="text" id="guessInput" placeholder="Enter your guess" />
    <button onclick="submitGuess()" class="btn">Submit</button>
    <div id="timer"></div>
    <div id="feedback"></div>
    <div id="youtubeContainer"></div>
    <button id="nextClueButton" class="btn" style="display:none" onclick="nextClue()">Next Clue</button>
    <button onclick="nextTeam()" class="btn">Next Team</button>
    <button onclick="endGame()" id="endRoundButton">End Game</button>
  `;
}

function showClue() {
  const currentSong = songs[currentTeamIndex];
  if (!currentSong) return;
  document.getElementById("clueImage").src = currentSong.images[currentClue];
  document.getElementById("feedback").textContent = "";
  document.getElementById("youtubeContainer").innerHTML = "";
  document.getElementById("nextClueButton").style.display = "none";
  document.getElementById("guessInput").disabled = false;
  timeLeft = 15;
  startTimer();
}

function startTimer() {
  const timerDisplay = document.getElementById("timer");
  clearInterval(timerInterval);
  timerDisplay.style.color = '#e53e3e';
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "Time's up!";
      document.getElementById("nextClueButton").style.display = "inline-block";
      document.getElementById("guessInput").disabled = true;
    }
  }, 1000);
}

function submitGuess() {
  const input = document.getElementById("guessInput");
  const guess = input.value.trim().toLowerCase();
  const currentSong = songs[currentTeamIndex];
  const correct = currentSong.name.trim().toLowerCase();

  if (guess === correct) {
    clearInterval(timerInterval);
    const points = [5, 3, 1][currentClue];
    scores[currentTeamIndex] += points;
    document.getElementById("feedback").textContent = `Correct! +${points} points`;
    showYouTube(currentSong.youtube);
    input.disabled = true;
  } else {
    document.getElementById("feedback").textContent = "Incorrect. Click 'Next Clue' to continue.";
    document.getElementById("nextClueButton").style.display = "inline-block";
    input.disabled = true;
    clearInterval(timerInterval);
  }
}

function nextClue() {
  currentClue++;
  if (currentClue < 3) {
    showClue();
  } else {
    const currentSong = songs[currentTeamIndex];
    document.getElementById("feedback").textContent = `All clues used. The correct answer was: ${currentSong.name}`;
    showYouTube(currentSong.youtube);
  }
}

function showYouTube(url) {
  const container = document.getElementById("youtubeContainer");
  container.innerHTML = `<iframe src="${url.replace("watch?v=", "embed/")}" allowfullscreen></iframe>`;
}

function nextTeam() {
  currentTeamIndex++;
  currentClue = 0;

  if (currentTeamIndex >= teams.length) {
    alert("Round complete!\nScores: " + scores.map((s, i) => `${teams[i]}: ${s}`).join(", "));
    round++;
    showDifficultySelector();
  } else {
    renderGameUI();
    showClue();
    startTimer();
  }
}

function endGame() {
  let results = scores.map((s, i) => `${teams[i]}: ${s}`).join("\n");
  alert("Final Scores:\n" + results);
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", loadGame);
