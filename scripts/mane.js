const mineCountDiv = document.querySelector('#mineCount')
const timerDiv = document.querySelector('#timer')
const root = document.querySelector(".map")
const score = document.querySelector("#score")
const rule = document.querySelector("#rule")
const trall = document.querySelector(".trall")

const boardXSize = 9
const boardYSize = 9

const classes = {
    0: "section0",
    1: "section1",
    2: "section2",
    3: "section3",
    4: "section4",
    5: "section5",
    6: "section6",
    7: "section7",
    8: "section8",
}

const arr = []

let mineCount = 0
let second = 60
let minute = 59

function myCallback(){
    second--
    if(second <= 0){
        second = 59
        minute--
    }

    if(minute <= 0){
        second = 0
        minute = 0
        showAll();
    }
    timerDiv.innerHTML = `${minute.toString().padStart(2,'0')}:${second.toString().padStart(2,'0')}`
}
myCallback();

const timer = setInterval(myCallback, 1000)

function createBoard() {

    for (let index = 0; index < boardXSize * boardYSize; index++) {
        const item = document.createElement('div')

        const isMine = Math.random() >= 0.85
        item.className = "section"
        item.isMine = isMine
        item.weight = 0

        item.addEventListener('mousedown', e =>{
            if (e.button === 2) {
                 if(item.className == "section" || item.className == "section flag"){
                item.classList.toggle("flag")
                return
                }
            } else if (e.button === 0) {
                if (item.classList.contains("flag")) {
                    return
                }
                if (!item.isMine) {
                    item.innerText = item.weight
                    item.classList.add(classes[item.weight])
                }
                else {
                    showAll()
                }
            }
        })

        arr.push(item)
    }
}

window.addEventListener('contextmenu', e => {
    e.preventDefault()
})

function bindBoard() {
    arr.forEach((item, index) => {
        item.id = index
        if (item.isMine) {
            mineCount++
        }

        root.appendChild(item)
    })

    mineCountDiv.innerHTML =`Пехотинцев: ${mineCount}`
    score.innerHTML = `${Math.floor((second+minute)-(9*9 - mineCount)*(mineCount /100))}: Очков`
    rule.innerHTML = `Правила`
    rule.addEventListener('click', e =>{
        if(e.button === 0){
            trall.classList.add("trall")
            trall.classList.toggle("hidden")
            return
        }
    })
}

function calc() {
    for (let index = 0; index < arr.length; index++) {
        const item = arr[index]

        if (item.isMine) {
            continue
        }

        const col = index % boardXSize
        const row = Math.floor(index / boardYSize)

        // top
        if (row > 0) {
            item.weight += arr[index - boardXSize].isMine ? 1 : 0

            // top-left
            if (col > 0) {
                item.weight += arr[index - boardXSize - 1].isMine ? 1 : 0
            }

            // top-right
            if (col < boardXSize - 1) {
                item.weight += arr[index - boardXSize + 1].isMine ? 1 : 0
            }
        }

        // left
        if (col > 0) {
            item.weight += arr[index - 1].isMine ? 1 : 0
        }

        // bottom
        if (row < boardYSize - 1) {
            item.weight += arr[index + boardXSize].isMine ? 1 : 0

            // bottom-left
            if (col > 0) {
                item.weight += arr[index + boardXSize - 1].isMine ? 1 : 0
            }

            // bottom-right
            if (col < boardXSize - 1) {
                item.weight += arr[index + boardXSize + 1].isMine ? 1 : 0
            }
        }

        // right
        if (col < boardXSize - 1) {
            item.weight += arr[index + 1].isMine ? 1 : 0
        }
        
    }
}

function showAll() {
    arr.forEach((item) => {
        if (item.isMine) {
            item.innerText = "x"
            item.classList.add("mine")
        } 
    })
}

function showCloud(index) {
    const col = index % boardXSize
    const row = Math.floor(index / boardYSize)

    const item = arr[index]

    console.log(item, index);

    if (item.weight === 0) {
        item.innerText = item.weight
        item.classList.add(classes[item.weight])
    }

    if (item.weight !== 0) {
        item.innerText = item.weight
        item.classList.add(classes[item.weight])
        return
    }

    // top
    if (row > 0 && arr[index - boardXSize].weight === 0) {
        showCloud(index - boardXSize)
    }

    // left
    if (col > 0 && arr[index - 1].weight === 0) {
        showCloud(index - 1)
    }

    // bottom
    if (row < boardYSize - 1 && arr[index + boardXSize].weight === 0) {
        showCloud(index + boardXSize)
    }

    // right
    if (col < boardXSize - 1 && arr[index + 1].weight === 0) {
        showCloud(index + 1)
    }

   return
}

createBoard();

calc();

bindBoard();
