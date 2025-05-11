// game.js - supports unique question per team per round
let currentTeamIndex = 0;
let currentClue = 0;
let teams = [];
let allSongs = [];
let round = 1;
let scores = [];
let roundScores = [];
let roundSongs = []; // <-- NEW: per-round song assignments
let timeLeft = 15;
let timerInterval;
let selectedDifficulty = "easy";
let clueAnswered = false;

function loadGame() {
  teams = JSON.parse(localStorage.getItem("teams")) || ["Team 1", "Team 2"];
  allSongs = JSON.parse(localStorage.getItem("songs")) || [];
  scores = teams.map(() => 0);
  roundScores = [];
  roundSongs = [];
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
  const filteredSongs = allSongs.filter(song => song.difficulty === selectedDifficulty);
  
  if (filteredSongs.length < teams.length) {
    alert("Not enough songs of this difficulty for all teams!");
    return;
  }

  // Shuffle and assign unique songs to each team
  const availableSongs = [...filteredSongs];
  const roundSongSet = [];
  for (let i = 0; i < teams.length; i++) {
    const randIndex = Math.floor(Math.random() * availableSongs.length);
    roundSongSet.push(availableSongs.splice(randIndex, 1)[0]);
  }
  roundSongs[round - 1] = roundSongSet;
  roundScores[round - 1] = teams.map(() => 0);
  
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
    <div id="timer"></div>
    <div id="feedback"></div>
    <div id="youtubeContainer"></div>
    <button onclick="markCorrect()" class="btn">Correct</button>
    <button id="nextClueButton" class="btn" style="display:none" onclick="nextClue()">Next Clue</button>
    <button onclick="nextTeam()" class="btn">Next Team</button>
    <button onclick="endGame()" id="endRoundButton">End Game</button>
  `;
}

function showClue() {
  const currentSong = roundSongs[round - 1][currentTeamIndex];
  if (!currentSong) return;
  document.getElementById("clueImage").src = currentSong.images[currentClue];
  document.getElementById("feedback").textContent = "";
  document.getElementById("youtubeContainer").innerHTML = "";
  document.getElementById("nextClueButton").style.display = "none";
  clueAnswered = false;
  timeLeft = 15;
  startTimer();
}

function startTimer() {
  const timerDisplay = document.getElementById("timer");
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "Time's up!";
      if (!clueAnswered) {
        document.getElementById("nextClueButton").style.display = "inline-block";
      }
    }
  }, 1000);
}

function markCorrect() {
  if (clueAnswered) return;
  clearInterval(timerInterval);
  const currentSong = roundSongs[round - 1][currentTeamIndex];
  const points = [5, 3, 1][currentClue] || 0;
  scores[currentTeamIndex] += points;
  roundScores[round - 1][currentTeamIndex] = points;
  document.getElementById("feedback").textContent = `Correct! +${points} points`;
  showYouTube(currentSong.youtube);
  clueAnswered = true;
}

function nextClue() {
  currentClue++;
  if (currentClue < 3) {
    showClue();
  } else {
    const currentSong = roundSongs[round - 1][currentTeamIndex];
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
    const roundResults = roundScores[round - 1].map((score, i) => `${teams[i]}: ${score}`).join(", ");
    alert(`Round ${round} complete!\nScores this round: ${roundResults}`);
    round++;
    showDifficultySelector();
  } else {
    renderGameUI();
    showClue();
    startTimer();
  }
}

function endGame() {
  let finalResults = teams.map((team, i) => {
    let perRound = roundScores.map((r, index) => `Round ${index + 1}: ${r[i] || 0}`).join(", ");
    return `${team} → ${scores[i]} pts [ ${perRound} ]`;
  }).join("\n");
  alert("Final Scores by Round:\n\n" + finalResults);
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", loadGame);
