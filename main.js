// 변수 선언
const gameTime = 60;

let score = 0;
let time = gameTime;
let isPlaying = false;
let timeInterval;
let checkInterval;
let words = [];

const wordInput = document.querySelector('.word-input');
const wordDisplay = document.querySelector('.word-display');
const wpmDisplay = document.querySelector('.wpm');
const scoreDisplay = document.querySelector('.score');
const timeDisplay = document.querySelector('.time');
const button = document.querySelector('.button');


function init(){
    buttonChange('Loading Game...')
    getWords();
    wordInput.addEventListener('input', checkMatch);
}


// 게임 실행
function run(){
    if(isPlaying){
        return;
    }
    isPlaying = true;
    time = gameTime;
    wordInput.focus();
    score = 0;
    scoreDisplay.innerText = score;
    wpmDisplay.innerText = 0;
    timeInterval = setInterval(countDown, 1000);
    checkInterval = setInterval(checkStatus, 50);
    buttonChange('Playing...')
}


function checkStatus(){
    if(!isPlaying && time === 0){
        updateWPM();
        buttonChange('Start Game')
        clearInterval(checkInterval)
    }
}


// 단어 불러오기
function getWords(){
    fetch('https://random-word-api.herokuapp.com/word?number=100')
    .then(response => response.json())
    .then(data => {
        data.forEach(word => {
            if (word.length < 8) {
                words.push(word);
            }
        });
        buttonChange('Start Game');
    })
    .catch(error => {
        console.error('Error fetching words:', error);
    });
}


// 단어 일치 체크
function checkMatch() {
    if (wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()){
        wordInput.value = "";
        if(!isPlaying){
            return;
        }
        score++;
        scoreDisplay.innerText = score;

        updateWPM();

        const randomIndex = Math.floor(Math.random() * words.length);
        wordDisplay.innerText = words[randomIndex];
    }
}


function countDown(){
    time > 0 ? time-- : isPlaying = false;
    if(!isPlaying){
        clearInterval(timeInterval)
    }
    timeDisplay.innerText = time;
}


function buttonChange(text){
    button.innerText = text;
    text === 'Start Game' ? button.classList.remove('loading') : button.classList.add('loading')
}


function updateWPM() {
    const elapsedTime = gameTime - time;
    const minutes = elapsedTime / 60;
    const wpm = minutes > 0 ? Math.round(score / minutes) : 0;
    wpmDisplay.innerText = wpm;
}


document.addEventListener('DOMContentLoaded', () => {
    init();
    document.getElementById("run").addEventListener("click", () => run());
});