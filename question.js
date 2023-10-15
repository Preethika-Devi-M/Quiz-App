let questions = [];
const ques_element = document.getElementById("question");
const ans_element = document.getElementById("answer-btn");
const nextbutton = document.getElementById("nxt-btn");
const pabutton = document.getElementById("pa-btn");
const backbutton = document.getElementById("back-btn");
const ques_loading = document.querySelector(".loading");
const timer = document.getElementById("time");
const timeUp = document.getElementById('timeUp');
let counter = 20;
const urlParams = new URLSearchParams(window.location.search);
const cat = urlParams.get('category');

let currentquestionindex = 0;
let score = 0;
let intervalId;

function startQuiz(){
    currentquestionindex = 0;
    score = 0;
    nextbutton.innerHTML= "Next";
    showQuestion();
}



function showQuestion(){
    resetState();
    counter = 20;
    timeUp.style.display = 'none';
    timer.style.display = 'block';
    pabutton.style.display = "none";
    backbutton.style.display = 'none';
    let currentquestion = questions[currentquestionindex];
    let ques_number = currentquestionindex+1;
    ques_element.innerHTML = ques_number + "." + currentquestion.question;

    currentquestion.answer.forEach(answer =>{
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        ans_element.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click",selectAnswer);

    });
    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(function() {
        timer.innerHTML = counter + ' sec';
        if (counter <= 5) {
            timer.style.color = 'red';
        }
        else{
            timer.style.color = '#2B4162';
        }
        if (counter == 0) {
            timeUp.style.display = 'block';
            showAnswer();
            clearInterval(intervalId);
        }
        counter--;
    }, 1000);
}

function showAnswer(){
    for(let i of ans_element.childNodes){
        if(i.dataset.correct){
            i.classList.add("correct");
        }
        
        i.disabled = true;
    }
    nextbutton.style.display= "block";
}

function resetState(){
    nextbutton.style.display = "none";
    while(ans_element.firstChild){
        ans_element.removeChild(ans_element.firstChild);
    }
}

function selectAnswer(a){
    clearInterval(intervalId);
    const selectedBtn = a.target;
    const isCorrect = selectedBtn.dataset.correct == "true";
    if (isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }
    else{
        selectedBtn.classList.add("incorrect");
    }
    Array.from(ans_element.children).forEach(button =>{
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextbutton.style.display= "block";
}

function showScore(){
    resetState();
    clearInterval(intervalId)
    ques_element.innerHTML = `you scored ${score} out of ${10}`;
    pabutton.style.display = "block";
    backbutton.style.display = "block";
    nextbutton.style.display = 'none';
    timer.style.display = 'none';

}

function handleNextButton(){
    currentquestionindex++;
    if (currentquestionindex< questions.length){
        showQuestion();
    }
    else{
        showScore();
    }
}

nextbutton.addEventListener("click",()=>{
    if (currentquestionindex< questions.length){
        handleNextButton();
    }
    else{
        startQuiz;
    }
})

function endQuiz(){
    showScore();
}


const api = () => {
    ques_loading.style.display = "block";
    fetch(`https://opentdb.com/api.php?amount=10&category=${cat}&type=multiple`)
.then(resp => resp.json())
.then( data =>{
    console.log(data);
    questions = [];
    for(let entity of data['results']){
        let arr = [];
        for( let i of entity['incorrect_answers'])
        arr.push({
            'text': i,
            'correct': false
        });
        arr.push({
            'text': entity['correct_answer'],
            'correct': true
        });
        questions.push({
            'question': entity['question'],
            'answer': shuffle(arr)
        });
    }
    console.log(questions);
    ques_loading.style.display = "none";
    startQuiz();
} )
}

const shuffle = (arr) => {
    const n = Math.floor(Math.random()*8);
    for(let j=0;j<n;j++){
        for(let i=0;i<arr.length-1;i++){
            let temp = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = temp;
        }
    }
    return arr;
}

//sign in js

const forms = document.querySelector(".forms"),
      pwShowHide = document.querySelectorAll(".eye-icon"),
      links = document.querySelectorAll(".link");

pw