import { quizItems } from "./questions.js";

let board = ['', '', '', '', '', '', '', '', ''];
let askedQuizItems = [];

displayStartGameButton(); 

function displayStartGameButton() {
  const gameContainer = document.querySelector('.js-game-container');
  const gameContainerOriginalHTML = document.querySelector('.js-game-container').innerHTML;  
  
  gameContainer.innerHTML = ''; 

  let timeOutId; 
  
  timeOutId = setInterval(()=> {
    if (gameContainer.innerHTML === '') {
      gameContainer.innerHTML = `
        <button class="start-game-button js-start-game-button">
          CLICK TO PLAY
        </button>`;

      document.querySelector('.js-start-game-button')
        .addEventListener('click', ()=> {
          gameContainer.innerHTML = gameContainerOriginalHTML;
          clearInterval(timeOutId);   
          gameIntro();
        });
      
    } else {
      gameContainer.innerHTML = '';      
    }
  }, 1000); 
}

function gameIntro() {  
  const gameText = document.querySelector('.js-game-text');

  setTimeout(() => {
    gameText.innerHTML = `
      <p>Welcome to <span class="bold">TIC · TAC · KNOW</span></p>
    `;    
  }, 1000);   

  setTimeout(() => {
    gameText.innerHTML = `
      <p>The game where you test your <span class="bold">Tic Tac Toe</span> and</p>
      <p><span class="bold">General Knowledge</span> skills at the same time</p>
    `;
  }, 4000);   

  setTimeout(() => {
    gameText.innerHTML = `<p>Good Luck!</p>`;    
  }, 10000); 

  setTimeout(() => {    
    playGame(gameText);
  }, 14000); 
}

function playGame(gameText) {  
  let turn = 1;
  let player = 'Player 1';
  let play = 'O';  
  let gameOver = false; 
  let timeOutId;

  activateSpotsButtons();
  askForMove(gameText, player);  

  // Sets the event listeners for the buttons as the nine spots in the board
  document.querySelectorAll('.js-board-button')
    .forEach((spot, index) => {  
      spot.addEventListener('click', () => {        
        clearTimeout(timeOutId);        
        
        // Marks a temporary play and asks a random question if the spot is available in the board
        if (!board[index]) {
          deactivateSpotsButtons();
          updateBoard(play, index);
          renderBoard();

          const randomQuizItem = getRandomQuizItem();       
          const question = randomQuizItem.question; 
          const answer = randomQuizItem.answer;

          gameText.innerHTML = `            
            <div class="question">${question}</div>
            <button class="answer-button js-answer-button">True</button>
            <button class="answer-button js-answer-button">False</button>                  
          `;

          // Sets the event listeners for the answer buttons as 'True' and 'False'
          document.querySelectorAll('.js-answer-button')
            .forEach((button) => {
              button.addEventListener('click', ()=> {            
                const playerAnswer = getPlayerAnswer(button, answer); 

                // Confirms the move in the board if the answer is correct
                if (playerAnswer) { 
                  gameText.innerHTML = 'You are right!';                
                  spot.classList.add('board-button-confirmed-play');               

                  // Checks if the the game is over after each play                                    
                  gameOver = checkGameOver(gameText, player);  
                  
                  if (gameOver) {           
                    deactivateSpotsButtons();
                    
                    setTimeout(() => {
                      gameText.innerHTML = `<p>GAME OVER</p>`;
                    }, 4000); 
        
                    setTimeout(() => {
                      gameText.innerHTML = '';
                      restartGame();  
                    }, 8000); 
                  
                    return;
                  }                   
                  
                // The current player loses the turn if the answer is incorrect 
                } else {
                  gameText.innerHTML = 'Wrong answer!';  
                  updateBoard('', index);
                  renderBoard();
                }                                
                
                // Changes the player's turn to play
                turn *= -1;
                player = getPlayer(turn);
                play = getPlay(turn);
                
                setTimeout(() => {                  
                  askForMove(gameText, player); 
                  activateSpotsButtons();              
                }, 3000);                
              });        
            });       
        
        // Play again if the spot is already taken
        } else {
          gameText.innerHTML = `<p>That spot is already taken!</p>`;

          timeOutId = setTimeout(() => {
            askForMove(gameText, player);            
          }, 3000);
        }       
      });
    });  
}

function askForMove(gameText, player) {
  gameText.innerHTML = `<p>It's your turn, <span class="bold">${player}</span></p>`;  
}

function getPlayer(turn) {  
  return turn === 1? 'Player 1' : 'Player 2';
}

function getPlay(turn) {
  return turn === 1? 'O' : 'X';
}

function getRandomQuizItem() {
  let randomQuizItem;
  
  while (true) {
    randomQuizItem = quizItems[(Math.floor(Math.random() * quizItems.length))];    

    // Checks if the question has already been asked
    if (!askedQuizItems.includes(randomQuizItem)) {      
      askedQuizItems.push(randomQuizItem);      

      // The asked questions list is reset if all the questons have been asked
      askedQuizItems = askedQuizItems.length === quizItems.length ? [randomQuizItem] : askedQuizItems;      
      
      return randomQuizItem;
    }      
  }   
}

function getPlayerAnswer(button, answer) {  
  return button.innerText === answer ? true : false;       
}

function updateBoard(play, index) {
  board[index] = play;
}

function renderBoard() {  
  document.querySelectorAll('.js-board-button')
    .forEach((spot, index) => {
      spot.innerHTML = board[index];  
    }); 
}

function activateSpotsButtons() {
  document.querySelectorAll('.js-board-button')
    .forEach((spot) => {
      spot.disabled = false;
      spot.classList.add('board-button-ON');
      spot.classList.add('board-button-ON:hover');
      spot.classList.add('board-button-ON:active');
    });
}

function deactivateSpotsButtons() {
  document.querySelectorAll('.js-board-button')
    .forEach((spot) => {
      spot.disabled = true; 
      spot.classList.remove('board-button-ON');
      spot.classList.remove('board-button-ON:hover');
      spot.classList.remove('board-button-ON:active');
    });
}

function removeConfirmedPlayCSS() {
  document.querySelectorAll('.js-board-button')
    .forEach((spot, index) => {
      spot.classList.remove('board-button-confirmed-play');  
    });   
};  

function checkGameOver(gameText, player) {  
  // Checks Win   
  if (
    // Checks horizontal lines
    (board[0] === board[1] && board[0] === board[2] && board[0] != '') || (board[3] === board[4] && board[3] === board[5] && board[3] != '') || (board[6] === board[7] && board[6] === board[8] && board[6] != '') ||
    // Checks vertical lines
    (board[0] === board[3] && board[0] === board[6] && board[0] != '') || (board[1] === board[4] && board[1] === board[7] && board[1] != '') || (board[2] === board[5] && board[2] === board[8] && board[2] != '') ||
    // Checks diagonal lines
    (board[0] === board[4] && board[0] === board[8] && board[0] != '') || (board[2] === board[4] && board[2] === board[6] && board[2] != '')
  ) {    
    gameText.innerHTML = `<p>${player} Wins!</p>`;    

    return true;
  
    //Checks tie
  } else if (!board.includes('')) {
    gameText.innerHTML = `<p>It's a draw!</p>`;   
    
    return true;  
  }
}

function restartGame() {  
  board = ['', '', '', '', '', '', '', '', ''];   
  renderBoard();  
  removeConfirmedPlayCSS();  
  displayStartGameButton();
}
