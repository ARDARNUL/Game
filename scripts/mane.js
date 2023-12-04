const newGame = document.querySelector("#newGame")
const newGameNoName = document.querySelector("#newGameNoneName")
const mineCountDiv = document.querySelector('#mineCount')
const timerDiv = document.querySelector('#timer')
const score = document.querySelector("#score")
const rule = document.querySelector("#rule")
const trall = document.querySelector(".trall")
const nav = document.querySelector(".nav")
const map = document.querySelector(".map")
const container = document.querySelector(".container")
const input = document.querySelector("#name")

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

let arr = []

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

function createBoard() {
    if(arr.length >= 81){
        arr = []
    }
    for (let index = 0; index < boardXSize * boardYSize; index++) {
        const item = document.createElement('div')

        const isMine = Math.random() >= 0.85
        item.classList.add("section")
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

        map.appendChild(item)
    })

    mineCountDiv.innerHTML =`Пехотинцев: ${mineCount}`
    score.innerHTML = `${Math.floor((second+minute)-(9*9 - mineCount)*(mineCount /100))}: Очков`
    rule.innerHTML = `Правила`
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
            item.classList.remove("section")
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
}

let timer
let test = false

map.addEventListener('mousedown', e =>{
    if(test == true){
        return
    }
    if(e.button === 0 && test == false){
        timer = setInterval(myCallback, 1000)
        test = true
        myCallback()
    }

    if(e.button === 2 && test == false){
        timer = setInterval(myCallback, 1000)
        test = true
        myCallback()
    }

})

function newMap(){
    if(test == true){
        clearInterval(timer)
        test = false
    }
    mineCount = 0
    second = 60
    minute = 59
    if (map.children.length !== 0) {
        while(map.lastElementChild){
            map.removeChild(map.lastElementChild);
        }
    
    } else {
    }
}

input.addEventListener('input', function(e) {

    newGameNoName.id = "newGame"

    newGameNoName.remove.id = "newGameNoName"

    newGameNoName.addEventListener('click', e =>{
        if(e.button === 0 && document.getElementById("newGame")){
    
            newMap();
    
            createBoard();
            
            calc();
    
            bindBoard();
    
            nav.classList.remove("hidden")
            map.classList.remove("hidden")
        }
    })
    
})

rule.addEventListener('click', e =>{
    if(e.button === 0){
        trall.classList.toggle("hidden")
        return
    }
})