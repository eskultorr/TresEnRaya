const gameBoard = document.querySelector("#gameBoard");
const info = document.querySelector("#info");

var circleCotain = document.querySelector('#circleCotain');
var crossCotain = document.querySelector('#crossCotain');
circleCotain.textContent = 0;
crossCotain.textContent = 0;

var endGame = false;

const btn = document.querySelector("#btn");
const btn2 = document.querySelector("#btn2");
var playerVsCpu = false;

const starCells = ["", "", "", "", "", "", "", "", ""];

if(confirm("quieres jugar contra la cpu"))
{
    playerVsCpu = true;
    console.log("1 player");
}
else
{
    playerVsCpu = false;
    if(confirm("quieres jugar contra otro jugador"))
    {
        console.log("2players")
    }
    else
    {
        alert("opcion no valida ");
        location.reload();
    }
    
}

var go = "circle";
info.textContent = ("circle goes first");

// Al iniciar el juego, comprobar si hay puntuación guardada en localStorage y establecerla
if (localStorage.getItem("circleScore"))
{
    circleCotain.textContent = localStorage.getItem("circleScore");
}
//cruces
if (localStorage.getItem("crosScore"))
{
    crossCotain.textContent = localStorage.getItem("crosScore");
}


//crear tablero 
function createBoard()
{
    starCells.forEach((cell, index) =>
    {
        const cellsElement = document.createElement('div');
        cellsElement.classList.add('square');
        cellsElement.id = index;
        cellsElement.addEventListener('click', addGo);
        gameBoard.append(cellsElement);
    });
    // reiniciar juego 
    btn.addEventListener('click', function()
    {
        location.reload();
    });

}

createBoard();


//crear varios platers o cpu

function addGo(e)
{
    if(endGame){return};
    const goDisplay = document.createElement('div');
    goDisplay.classList.add(go);
    e.target.append(goDisplay);
    e.target.removeEventListener('click', addGo);
    checkScore();
    if (playerVsCpu && go === 'circle' && !endGame)
    {
        setTimeout(cpuMove, 3000);
    }
    go = go === "circle" ? "crosses": "circle";
    info.textContent = "it is now " + go + "'s turn.";
    // console.log(e.target)
}

// chekear puntuacion y combinacion ganadora 
function checkScore()
{
    const allSquares = document.querySelectorAll('.square');
    // console.log(allSquares);

    const winningCombos = 
    [
        [0,1,2], [3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
    ]

    winningCombos.forEach(Array =>
        {
            const circleWins = Array.every(cell => allSquares[cell].firstChild?.classList.contains('circle'));

            if(circleWins)
            {
                allSquares.forEach(square => square.replaceWith(square.cloneNode(true)));
                // Cuando se produce una victoria, actualizar la puntuación y guardarla en localStorage
                circleCotain.textContent++;
                localStorage.setItem("circleScore", circleCotain.textContent);
                endGame = true;
                info.textContent = "circle wins";
                return;
            }
        });

    winningCombos.forEach(Array =>
        {
            const crossWins = Array.every(cell => allSquares[cell].firstChild?.classList.contains('cross'));

            if(crossWins)
            {
                info.textContent = "crosses wins";
                allSquares.forEach(square => square.replaceWith(square.cloneNode(true)));
                crossCotain.textContent++;
                localStorage.setItem("crosScore", crossCotain.textContent);
                endGame = true;
                return;
            }
        });
}


// En el botón para reiniciar el juego, borrar la puntuación guardada en localStorage
btn2.addEventListener("click", function()
{
    if(confirm("estas seguro de reiniciar el juego se perdera toda la informacion de puntos"))
    {
    localStorage.removeItem("circleScore");
    localStorage.removeItem("crosScore");
    location.reload();
    }
    
});

// movimiento cpu 
function cpuMove()
{
    const emptyCells = Array.from(document.querySelectorAll('.square:not(:has(div))'));

        // Evaluar si la CPU puede ganar en el siguiente movimiento
        for(let i = 0; i < emptyCells.length; i++)
        {
            const cellIndex = emptyCells[i].id;
            const newBoard = [...starCells];
            newBoard[cellIndex] = 'cross';
            if(checkScore(newBoard, 'cross'))
            {
                const goDisplay = document.createElement('div');
                goDisplay.classList.add('cross');
                emptyCells[i].append(goDisplay);
                emptyCells[i].removeEventListener('click', addGo);
                checkScore();
                go = 'circle';
                info.textContent = "It is now " + go + "'s turn.";
                return;
            }
        }
    
        // Evaluar si el jugador humano puede ganar en el siguiente movimiento y bloquearlo
        for(let i = 0; i < emptyCells.length; i++)
        {
            const cellIndex = emptyCells[i].id;
            const newBoard = [...starCells];
            newBoard[cellIndex] = 'circle';
            if (checkScore(newBoard, 'circle'))
            {
                const goDisplay = document.createElement('div');
                goDisplay.classList.add('cross');
                emptyCells[i].append(goDisplay);
                emptyCells[i].removeEventListener('click', addGo);
                checkScore();
                go = 'circle';
                info.textContent = "It is now " + go + "'s turn.";
                return;
            }
        }
    
        // Si no se puede ganar en el siguiente movimiento, hacer un movimiento aleatorio
        const cellIndex = Math.floor(Math.random() * emptyCells.length);
        const selectedCell = emptyCells[cellIndex];
        const goDisplay = document.createElement('div');
        goDisplay.classList.add('cross');
        selectedCell.append(goDisplay);
        selectedCell.removeEventListener('click', addGo);
        checkScore();
        go = 'circle';
        info.textContent = "It is now " + go + "'s turn.";
}



