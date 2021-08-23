const username = document.getElementById("username");
const saveScore = document.getElementById("saveScore");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

const highScores = JSON.parse(localStorage.getItem("highScores")) || []
console.log(highScores)

const max_high = 5
finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
  saveScore.disabled = !username.value;
});

saveHighScore = (e) => {
  e.preventDefault();

  const score = {
    score: Math.floor(Math.random() * 100),
    name: username.value
  }
  highScores.push(score);
  console.log(highScores)

  highScores.sort((a,b) => {
     return b.score - a.score
  })
  highScores.splice(5)

  localStorage.setItem("highscore", JSON.stringify(highScores))
  window.location.assign("/")
};
