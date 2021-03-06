document.addEventListener("DOMContentLoaded", () => {
    const userGrid = document.querySelector('.grid-user');
    const computerGrid = document.querySelector('.grid-computer')
    const displayGrid = document.querySelector('.grid-display')
    const ships = document.querySelectorAll('.ship')
    const destroyer = document.querySelector('.destroyer-container')
    const submarine = document.querySelector('.submarine-container')
    const cruiser = document.querySelector('.cruiser-container')
    const battleship = document.querySelector('.battleship-container')
    const carrier = document.querySelector('.carrier-container')
    const startButton = document.querySelector("#start")
    const rotateButton = document.querySelector("#rotate")
    const turnDisplay = document.querySelector("#whose-turn")
    const infoDisplay = document.querySelector("#info")
    let isHorizontal = true
    let isGameOver = false
    let currentPlayer = 'user'

    const userSquares = [];
    const computerSquares = [];
    const width = 10;
    //Create Board
    function createBoard(grid, squares) {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.dataset.id = i;
            grid.appendChild(square);
            squares.push(square)
        }
    }
    createBoard(userGrid, userSquares)
    createBoard(computerGrid, computerSquares)

    //ships array
    const shipArray = [
        {
            name: "destroyer",
            directions: [
                [0, 1],
                [0, width]
            ]
        },
        {
            name: "submarine",
            directions: [
                [0, 1, 2],
                [0, width, width * 2]
            ]
        },
        {
            name: "cruiser",
            directions: [
                [0, 1, 2],
                [0, width, width * 2]
            ]
        },
        {
            name: "battleship",
            directions: [
                [0, 1, 2, 3],
                [0, width, width * 2, width * 3]
            ]
        },
        {
            name: "carrier",
            directions: [
                [0, 1, 2, 3, 4],
                [0, width, width * 2, width * 3, width * 4]
            ]
        },
    ]


    //Draw the computers ships in random locations
    function generateShip(ship) {
        let randomDirection = Math.floor(Math.random() * ship.directions.length)
        let current = ship.directions[randomDirection]
        if (randomDirection === 0) direction = 1
        if (randomDirection === 1) direction = 10
        let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction)))

        const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains("taken"))
        const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
        const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)

        if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name))

        else generateShip(ship)
    }

    generateShip(shipArray[0])
    generateShip(shipArray[1])
    generateShip(shipArray[2])
    generateShip(shipArray[3])
    generateShip(shipArray[4])

    function rotate() {
        if (isHorizontal) {
            destroyer.classList.toggle("destroyer-container-vertical")
            cruiser.classList.toggle("cruiser-container-vertical")
            battleship.classList.toggle("battleship-container-vertical")
            carrier.classList.toggle("carrier-container-vertical")
            submarine.classList.toggle("submarine-container-vertical")
            isHorizontal = false
            return
        }
        if (!isHorizontal) {
            destroyer.classList.toggle("destroyer-container-vertical")
            cruiser.classList.toggle("cruiser-container-vertical")
            battleship.classList.toggle("battleship-container-vertical")
            carrier.classList.toggle("carrier-container-vertical")
            submarine.classList.toggle("submarine-container-vertical")
            isHorizontal = true
            return
        }
    }

    rotateButton.addEventListener('click', rotate)

    //move around user ships
    ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragover', dragOver))
    userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
    userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
    userSquares.forEach(square => square.addEventListener('drop', dragDrop))
    userSquares.forEach(square => square.addEventListener('dragend', dragEnd))

    ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
        selectShipNameWithIndex = e.target.id
    }))

    function dragStart() {
        draggedShip = this
        draggedShipLength = this.childNodes.length

    }

    function dragOver(e) {
        e.preventDefault()
    }

    function dragEnter(e) {
        e.preventDefault()
    }

    function dragLeave() {

    }

    function dragDrop() {
        let shipNameWithLastId = draggedShip.lastChild.id
        let shipClass = shipNameWithLastId.slice(0, -2)
        let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
        let shipLastId = lastShipIndex + parseInt(this.dataset.id)
        const notAllowedHorizontal = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 12, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 43, 53, 63, 73, 83, 93]
        const notAllowedVertical = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60]

        let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
        let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)

        selectedShipIndex = parseInt(selectShipNameWithIndex.substr(-1))

        shipLastId = shipLastId - selectedShipIndex

        if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
            for (let i = 0; i < draggedShipLength; i++) {
                userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass)
            }
        } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
            for (let i = 0; i < draggedShipLength; i++) {
                userSquares[parseInt(this.dataset.id) - selectedShipIndex + width * i].classList.add('taken', shipClass)
            }
        } else return

        displayGrid.removeChild(draggedShip)
    }  

    function dragEnd() {
        console.log('dragend')
    }

    function playGame() {
        if (isGameOver) return
        if (currentPlayer === 'user') {
            turnDisplay.innerHTML = 'Your Turn'
            computerSquares.forEach(square => square.addEventListener('click', function(e) {
                revealSquare(square)
            }))
        }

        if (currentPlayer === 'computer') {
            turnDisplay.innerHTML = "Computers Turn"
            setTimeout (computerGo, 1000)
        }
    }
    startButton.addEventListener('click', playGame)

    let destroyerCount = 0
    let submarineCount = 0
    let carrierCount = 0
    let battleshipCount = 0
    let cruiserCount = 0

    function revealSquare(square) {
        if (!square.classList.contains('hit')) {
        if (square.classList.contains('destroyer')) destroyerCount++
        if (square.classList.contains('carrier')) carrierCount++
        if (square.classList.contains('submarine')) submarineCount++
        if (square.classList.contains('battleship')) battleshipCount++
        if (square.classList.contains('cruiser')) cruiserCount++
        }
        if (square.classList.contains('taken')) {
            square.classList.add('hit')
        } else {
            square.classList.add('miss')
        }
        checkForWins()
        currentPlayer = 'computer'
        playGame()
    }

    let cpudestroyerCount = 0
    let cpusubmarineCount = 0
    let cpucarrierCount = 0
    let cpubattleshipCount = 0
    let cpucruiserCount = 0

    function computerGo() {
        let random = Math.floor(Math.random() * userSquares.length)
        if (!userSquares[random].classList.contains('hit')) {
            userSquares[random].classList.add('hit')
            if (userSquares[random].classList.contains('destroyer')) cpudestroyerCount++
            if (userSquares[random].classList.contains('carrier')) cpucarrierCount++
            if (userSquares[random].classList.contains('submarine')) cpusubmarineCount++
            if (userSquares[random].classList.contains('battleship')) cpubattleshipCount++
            if (userSquares[random].classList.contains('cruiser')) cpucruiserCount++
            checkForWins()
        } else computerGo()
        currentPlayer = 'user'
        turnDisplay.innerHTML = "Your turn"
    }

    function checkForWins(){
        if (destroyerCount===2) {
            infoDisplay.innerHTML = "You sunk their Destroyer!"
            destroyerCount = 10
        }
        if (submarineCount===3) {
            infoDisplay.innerHTML = "You sunk their Submarine!"
            submarineCount = 10
        }
        if (carrierCount===5) {
            infoDisplay.innerHTML = "You sunk their Carrier!"
            carrierCount = 10
        }
        if (cruiserCount===3) {
            infoDisplay.innerHTML = "You sunk their Cruiser!"
            cruiserCount = 10
        }
        if (battleshipCount===4) {
            infoDisplay.innerHTML = "You sunk their Battleship!"
            battleshipCount = 10
        }
        if (cpudestroyerCount===2) {
            infoDisplay.innerHTML = "You sunk their Destroyer!"
            destroyerCount = 10
        }
        if (cpusubmarineCount===3) {
            infoDisplay.innerHTML = "You sunk their Submarine!"
            submarineCount = 10
        }
        if (cpucarrierCount===5) {
            infoDisplay.innerHTML = "You sunk their Carrier!"
            carrierCount = 10
        }
        if (cpucruiserCount===3) {
            infoDisplay.innerHTML = "You sunk their Cruiser!"
            cruiserCount = 10
        }
        if (cpubattleshipCount===4) {
            infoDisplay.innerHTML = "You sunk their Battleship!"
            battleshipCount = 10
        }
        if ((destroyerCount + submarineCount + cruiserCount + carrierCount +battleshipCount) === 50) {
            infoDisplay.innerHTML = "YOU WIN"
            gameOver()
        }
        if ((cpudestroyerCount + cpusubmarineCount + cpucruiserCount + cpucarrierCount + cpubattleshipCount) === 50) {
            infoDisplay.innerHTML = "YOU LOSE"
            gameOver()
        }
    }
    function gameOver() {
        isGameOver = true
        startButton.removeEventListener('click', playGame)
    }
})