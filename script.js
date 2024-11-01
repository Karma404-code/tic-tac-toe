
const  gameBoard= (function(){
    // 3x3 grid, O = 0 & X = 1
    let grid = [
        {0: null, 1: null, 2: null},
        {0: null, 1: null, 2: null},
        {0: null, 1: null, 2: null},
    ];

    //undo stack to keep track of previous moves;
    let gridStack = [];

    // print current grid. It is passed as reference of object (grid).
    const showGrid = function(){
        console.log(grid);
    }

    // Enter Move
    const enter = function(row,col,val){
        // accept data in empty cell only
        if(grid[row][col] === null){
            grid[row][col] = val;
            gridStack.push({row,col}); //Store move in stack
            return true;
        }
        else{
            /* Invalid move should not increment moveCount */
            console.log("Invalid position. Try Again");  
            return false; 
        }
    };

    // Undo last move
    const undoGrid = function(){
        if(gridStack.length != 0){  // handle underflow 
            const {row,col} = gridStack.pop();
            grid[row][col] = null;
        }
        else{
            console.log("Empty array!");
        }
    };

    // Win condition
    const gameStateEnd = (function(){
        let i;
        let state = false;
        const isSame = function(l,m,r){
            if(l === m && m === r && l!==null && m!==null && r!==null){
                state = true;
            }
        };

        // For Horizontol and Vertical
        for(i=0;i<3;i++){
            isSame(grid[i][0],grid[i][1],grid[i][2]);
            isSame(grid[0][i],grid[1][i],grid[2][i]);
        }
        // for diagonal
            isSame(grid[0][0],grid[1][1],grid[2][2]);
            isSame(grid[0][2],grid[1][1],grid[2][0]);

        return state;
    }); 

    const eraseGrid = function(){
        let i,j;

        for(i=0;i<3;i++){
            for(j=0;j<3;j++){
                grid[i][j] = null;
            }
        }
        gridStack = [];
    };
    return {
        enter,undoGrid,gameStateEnd,showGrid,eraseGrid
    };
})();

const Player = function(val){
    const {enter} = gameBoard;
    let score = 0;
    let name;

    const setName = function(player){
        name = player;
    }

    const getName = function(){
        return name;
    }
    // player move (O or X)
    const play = function(row,col){
        return enter(row,col,val);
    }

    const increaseScore = () => score++;
    const getScore = () => score;

    return {
        play, increaseScore, getScore, setName, getName
    };
};

const playerOne = Player(0); // move = O
// playerOne.setName(prompt("Name for player one: "));
playerOne.setName("O");

const playerTwo = Player(1); // move = X
//playerTwo.setName(prompt("Name for player two: "))
playerTwo.setName("X");

const winner = (function(){
    const pos = document.querySelector(".gameState");
    const banner = document.createElement("h3");
    banner.className = "winner";
    pos.appendChild(banner);
    
    const printWinner = function(name){
        banner.textContent = `Winner : ${name}`;
    };
    
    const removeWinner = function(){
        banner.textContent = "";
    };

    return {printWinner,removeWinner};
})();


const endGame = function(){   // reset grid,moveCount and ouput
    const {eraseGrid} = gameBoard;
    const {resetCount} = playGame;
    const {removeGrid} = manipulateDOM;
    const {resetStack} = manipulateDOM;
    const {removeWinner} = winner;
    // const {resetName} = showTurn;
    // const {resetWinner} = winner;

    eraseGrid();
    resetCount();
    resetStack();
    removeGrid();
    removeWinner();
}

const playGame = (function(){
    const  {gameStateEnd,showGrid}= gameBoard;
    const {printWinner} = winner;

    let moveCount = 0; 

    const getMove = function(){
        return moveCount;
    };

    const addMove = function(){
        moveCount++;
    };

    const undoMove = function(){
        moveCount--;
    }

    const resetCount = function(){
        moveCount = 0;
    }

    const gameOver = function(){
        if(gameStateEnd()){
            // check winner based on last moveCount
            if(moveCount % 2 === 0){
                console.log("Player One Wins");
                printWinner(playerOne.getName());
            }
            else{
                console.log("Player Two Wins");
                printWinner(playerTwo.getName());
            }
        }
    };

    return {
        getMove,gameOver,addMove,resetCount,undoMove
    };
})();
  
const displayMove = function(move, node){
    // const svgCricle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // const cross = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const svgCircle = document.createElement("img");
//    svgCircle.setAttribute("src","")
    svgCircle.src = "./pic/circle.svg";

    const svgCross = document.createElement("img");
    svgCross.src =  "./pic/cross.svg";
    if(move === "O"){
        return node.appendChild(svgCircle);
    }
    else if(move = "X"){
        return node.appendChild(svgCross);
    }
}
// takes moveCount as argument for undo mid-game
const writeMove = (function(cell){
    const {gameStateEnd} = gameBoard;
    const {getMove,gameOver,addMove} = playGame;

 

    let moveCount = getMove();
    let posX;
    let posY;

    // convert row into index
    if(cell.parentElement.className === "top"){
        posX = 0;
    }
    if(cell.parentElement.className === "middle"){
        posX = 1;
    }
    if(cell.parentElement.className === "bottom"){
        posX = 2;
    }

    // convert column into index
    if(cell.className === "left"){
        posY = 0;
    }
    if(cell.className === "mid"){
        posY = 1;
    }
    if(cell.className === "right"){
        posY = 2;
    }


    // max possible move = 9
    if(!gameStateEnd()){
        if(moveCount % 2 === 0){
            if(playerOne.play(posX,posY)){
                displayMove("O",cell);
                gameOver();
                addMove();
                // showTurn(playerTwo.getName());
            };
        }
        else{
            if(playerTwo.play(posX,posY)){
                displayMove("X",cell);
                gameOver();
                addMove();
                // showTurn(playerOne.getName());
            };
        }
        if(moveCount == 8){
            console.log("Its a draw");
        };
    };
}); 

const undoMove = function(){
    const {undoGrid} = gameBoard;
    const {gameStateEnd} = gameBoard;
    const {undoDisplay} = manipulateDOM;
    const {undoMove} = playGame;

    if(!gameStateEnd()){
        undoGrid(); // remove last move from grid
        undoMove();
        undoDisplay(); // remove from DOM
    }
}   

const manipulateDOM = (function(){
    let i;
    let displayStack = [];

    const divGrid = document.querySelectorAll(".grid > * > *");
    const undoButton = document.querySelector(".undo");
    const resetButton = document.querySelector(".reset");

    const writeInGrid = function(){
        divGrid.forEach((element) => {
            element.addEventListener("click", () => {
                writeMove(element);
                displayStack.push(element);
                console.log(displayStack);
            })
        });
    };

    const removeGrid = function(){
        divGrid.forEach((element) => {
                element.textContent = "";
        });
    };

    undoButton.addEventListener("click", () => {
        undoMove();
    });

    resetButton.addEventListener("click", () => {
        endGame();
    })

    const resetStack = function(){
        displayStack = [];
    }

    const undoDisplay = function(){
        if(displayStack.length != 0){
            displayStack.pop().textContent = "";
        };
    };

    writeInGrid(); // Start game
    return {
        writeInGrid,removeGrid,resetStack,undoDisplay
    };
})();

/*const showTurn = function(name){
    const turn = document.querySelector(".turn");
    turn.textContent = `Current Turn : ${name}`;

    const resetName = function(){
        turn.textContent = `Current Turn : O`;
    }

    return {resetName};
};
*/


