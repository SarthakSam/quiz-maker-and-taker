const readlineSync = require('readline-sync');
const fs = require('fs');
const chalk = require('chalk');

function input(question) {
    let val = "";
    while( !val ) 
        val = readlineSync.question(question);
    return val;    
} 

function randomColor(text) {
    let red = Math.floor( Math.random() * 255 );
    let green = Math.floor( Math.random() * 255 );
    let blue = Math.floor( Math.random() * 255 );
    if( red < 50) 
        red += 50;
    if( green < 50) 
        red += 50;
    if( blue < 50) 
        red += 50;
        
    
    return chalk.bold.rgb(red, green, blue)(text);
}

// Code for making quiz starts

function createQuestion() {
    console.log( randomColor( '-'.repeat(process.stdout.columns) ) );
    let statement = input( randomColor("Enter question statement... \n") );
    let noOfOptions = readlineSync.questionInt( chalk.bold.cyanBright("Enter number of options you want for this question? ") );
    let options = [];
    for(let i = 0;i < noOfOptions;i++) {
        options.push( input( chalk.bold.cyanBright(`Enter option ${i + 1} \n`) ) );
    }
    let answerIndex = readlineSync.keyInSelect(options, chalk.underline.bold.italic( randomColor( "Enter answer for this question ") ) );
    return {
        statement,
        options,
        answerIndex
    }
}

// Code for saving quiz

function saveQuiz(quiz) {

    const path = `./store/${quiz[0].quizName}by${name}_${availableQuiz.length}.json`
    try {
       if (fs.existsSync(path)) {
            //file exists
            console.log('file exists');
        }
    } catch(err) {
            console.error(err)
    }
    fs.writeFileSync(path, JSON.stringify( quiz ) );
    console.log('quiz saved succesfully.');
    getAllQuiz();
}

function makeQuiz() {
    let quiz = [];
    let quizName = input(chalk.bold.greenBright("Enter title of your quiz ") );
    quiz.push( { quizName });
    let noOfQuestions = readlineSync.questionInt( chalk.bold.greenBright("Enter number of questions you want in quiz? ") );
    for(let i = 0;i < noOfQuestions;i++) {
        quiz.push( createQuestion() );
    }
    return quiz;
}   

// Code for taking quiz

function takeQuiz(quiz) {
    // console.log(quiz);
    let score = 0;
    let metaDataObj = quiz.splice(0, 1);
    console.log( randomColor(`${ metaDataObj.quizName }`) );
    quiz.forEach(question => {
        console.log( chalk.underline.bold.italic( randomColor(question.statement) ) );
        let options = question.options.map( option => randomColor(option));
        let ans = readlineSync.keyInSelect(options,chalk.bold("Enter your choice") );
        if(ans == question.answerIndex) {
            score++;
            console.log( chalk.bold.greenBright("Your answer is correct") );
        }
        else {
            console.log( chalk.red( "Your answer is wrong") );
            console.log("correct ans is " + (question.answerIndex + 1));
            score--;
        }
        console.log( randomColor( '-'.repeat(process.stdout.columns) ) );
        console.log("\n\n");
    });
    return score;
}

// Function for selecting exisitng quiz

function selectQuiz() {
    let quizes = availableQuiz.map( quiz => quiz.substring(0, quiz.lastIndexOf("_") ) );
    // console.log(availableQuiz);
    let choice = readlineSync.keyInSelect(quizes, "Select any quiz from all the available quizes to take");
    return JSON.parse( fs.readFileSync(`./store/${ availableQuiz[choice] }`,'utf-8') );
}


function getAllQuiz() {
    availableQuiz = fs.readdirSync('./store');
}

getAllQuiz();
let name = input( randomColor("Please enter your name ") );
let choice = 0;
do {
    choice = readlineSync.keyIn( randomColor("Press \n 1. for creating your own quiz, \n 2. for taking existing quiz and \n 3. for exiting", {limit: '$<1-3>'}) );
    if(choice == 1) {
        let quiz = makeQuiz();
        saveQuiz(quiz);
    }
    else if(choice == 2) {
       let quiz = selectQuiz(); 
       let score = takeQuiz(quiz);
       console.log(`Your score is ${score}`);
    }
    else {
        console.log( "You are now exiting.");
    }
} while( choice != 3);

// let name = input("Enter your name? ");
// console.log(chalk.bold.cyan(`\nHI ${name} lets test your football knowledge with this awesome quiz`) );

// let score = takeQuiz(quiz);

// console.log( chalk.bold.green(`${name}, your score score is ${score}`) );
