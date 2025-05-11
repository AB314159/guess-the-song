// teamManager.js
let teamList = [];

function loadTeams() {
  teamList = JSON.parse(localStorage.getItem("teams")) || [];
  renderTeamInputs();
}

function addTeam() {
  if (teamList.length >= 6) return alert("Maximum of 6 teams allowed.");
  const teamName = `Team ${teamList.length + 1}`;
  teamList.push(teamName);
  saveTeams();
  renderTeamInputs();
}

function removeTeam() {
  if (teamList.length <= 1) return alert("At least 1 team required.");
  teamList.pop();
  saveTeams();
  renderTeamInputs();
}

function renderTeamInputs() {
  const container = document.getElementById("team-list");
  container.innerHTML = "";
  teamList.forEach((team, index) => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = team;
    input.onchange = (e) => {
      teamList[index] = e.target.value;
      saveTeams();
    };
    container.appendChild(input);
  });
}

function saveTeams() {
  localStorage.setItem("teams", JSON.stringify(teamList));
}

document.addEventListener("DOMContentLoaded", loadTeams);
