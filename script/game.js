// game.js
let currentTeamIndex = 0;
let currentClue = 0;
let teams = [];
let songs = [];
let round = 1;
let scores = [];

function loadGame() {
  // Normally, you'd load from storage or backend
  teams = JSON.parse(localStorage.getItem("teams")) || ["Team 1", "Team 2"];
  songs = JSON.parse(localStorage.getItem("songs")) || [];
  scores = teams.map(() => 0);

  updateTeamTurn();
  showClue();
  startTimer();
}

function updateTeamTurn() {
  document.getElementById("teamTurn").textContent = `${teams[currentTeamIndex]}'s Turn`;
  document.getElementById("roundTitle").textContent = `Round ${round}`;
}

function showClue() {
  const currentSong = songs[currentTeamIndex];
  if (!currentSong || currentClue >= 3) return;
  const cluePath = currentSong.images[currentClue];
  document.getElementById("clueImage").src = cluePath;
}

function submitGuess() {
  const guess = document.getElementById("guessInput").value.trim().toLowerCase();
  const currentSong = songs[currentTeamIndex];
  const correctAnswer = currentSong.name.trim().toLowerCase();

  if (guess === correctAnswer) {
    clearInterval(timerInterval);
    const points = [5, 3, 1][currentClue];
    scores[currentTeamIndex] += points;
    showFeedback(`Correct! +${points} points`);
    showYouTube(currentSong.youtube);
  } else {
    currentClue++;
    if (currentClue >= 3) {
      clearInterval(timerInterval);
      showFeedback(`Wrong! The correct answer was: ${currentSong.name}`);
      showYouTube(currentSong.youtube);
    } else {
      showFeedback("Try again with next clue...");
      showClue();
      timeLeft = 15;
      startTimer();
    }
  }
}

function showYouTube(url) {
  const container = document.getElementById("youtubeContainer");
  container.innerHTML = `<iframe src="${url.replace("watch?v=", "embed/")}" allowfullscreen></iframe>`;
}

function showFeedback(message) {
  document.getElementById("feedback").textContent = message;
}

function nextTeam() {
  currentTeamIndex++;
  currentClue = 0;
  document.getElementById("guessInput").value = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("youtubeContainer").innerHTML = "";
  
  if (currentTeamIndex >= teams.length) {
    // Round complete
    alert("Round complete! Scores: " + scores.join(", "));
    round++;
    currentTeamIndex = 0;
  }
  
  updateTeamTurn();
  showClue();
  timeLeft = 15;
  startTimer();
}

document.addEventListener("DOMContentLoaded", loadGame);
