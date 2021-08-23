const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText")
const progressbarfull = document.getElementById("progress-bar-full")
const scoreText = document.getElementById("score")
const loader = document.getElementById("loader")
const game = document.getElementById("game")

let currentQuestions = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=20&category=9&difficulty=medium&type=multiple")
.then(res => {
    return res.json()
})
.then(loadedQuestions => {
    console.log(loadedQuestions.results)
    questions = loadedQuestions.results.map(loadedQuestion => {
        const formattedQuestions = {
            question: loadedQuestion.question
        }
        const answerChoices = [... loadedQuestion.incorrect_answers]
        formattedQuestions.answer = Math.floor(Math.random() * 3) + 1
        answerChoices.splice(formattedQuestions.answer - 1, 0, loadedQuestion.correct_answer)

        answerChoices.forEach((option, index) => {
            formattedQuestions["option" + (index + 1)] = option
        })

        return formattedQuestions
    })
   
    startgame()
}).catch (err => {
    console.log(err)
})

const correct_bonus = 10;
const max_questions = 20;

startgame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden")
  loader.classList.add("hidden")
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= max_questions){
        localStorage.setItem("mostRecentScore", score)
        return window.location.assign("/end.html")
    }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter} / ${max_questions}`
  progressbarfull.style.width = `${(questionCounter / max_questions) * 100}%`

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestions = availableQuestions[questionIndex];
  question.innerText = currentQuestions.question;

  choices.forEach( option => {
    const number = option.dataset["number"];
    option.innerText = currentQuestions["option" + number];
  });

  availableQuestions.splice(questionIndex, 1)

  acceptingAnswers = true
};

choices.forEach(option => {
    option.addEventListener("click", e => {
        if (!acceptingAnswers) return

        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset["number"]

        const classToApply = selectedAnswer == currentQuestions.answer ? "correct" : "incorrect"
        
        if (classToApply === "correct") {
            incrementScore(correct_bonus)
        }

        selectedChoice.parentElement.classList.add(classToApply)

        setTimeout     (() => {
        selectedChoice.parentElement.classList.remove(classToApply)

        getNewQuestion()
        }, 1000)
       
    })
})

incrementScore = num => {
    score += num
    scoreText.innerText = score
}

