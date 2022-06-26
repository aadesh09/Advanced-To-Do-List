let addBtn = document.querySelector('.add-btn')
let removeBtn = document.querySelector('.remove-btn')
let modalCont = document.querySelector('.modal-cont')
let mainCont = document.querySelector('.main-cont')
let allPriorityColors = document.querySelectorAll('.priority-color')
let taskareaCont = document.querySelector('.textarea-cont')
let toolBoxColors = document.querySelectorAll('.color')


let colors = ['lightpink', 'lightgreen', 'lightblue', 'black']
let modalPriorityColor = colors[colors.length - 1]

let addFlag = false
let removeFlag = false

let lockClass = 'fa-lock'
let unlockClass = 'fa-lock-open'

let ticketsArr = [];

//get all Tickets from local storage
if (localStorage.getItem('tickets')) {
    ticketsArr = JSON.parse(localStorage.getItem('tickets'))
    ticketsArr.forEach(function (ticket) {
        createTicket(ticket.ticketColor, ticket.textValue, ticket.ticketId)
    })
}

//Filter tickets with respect to Colors
for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener('click', function (e) {
        let currentToolBoxColor = toolBoxColors[i].classList[0]

        let filteredTickets = ticketsArr.filter(function (ticketObj) {
            return currentToolBoxColor == ticketObj.ticketColor
        })

        let allTickets = document.querySelectorAll('.ticket-cont')
        for (let i = 0; i < allTickets.length; i++) {
            allTickets[i].remove()
        }

        filteredTickets.forEach(function (filteredObj) {
            createTicket(filteredObj.ticketColor, filteredObj.textValue, filteredObj.ticketId)
        })
    })

    toolBoxColors[i].addEventListener('dblclick', function (e) {
        let allTickets = document.querySelectorAll('.ticket-cont')
        for (let i = 0; i < allTickets.length; i++) {
            allTickets[i].remove()
        }

        ticketsArr.forEach(function (filteredObj) {
            createTicket(filteredObj.ticketColor, filteredObj.textValue, filteredObj.ticketId)
        })

    })
}

//Display and hide of the modal
addBtn.addEventListener('click', function () {
    addFlag = !addFlag

    if (addFlag) {
        modalCont.style.display = 'flex'
    } else {
        modalCont.style.display = 'none'
    }

})

//Changing Priority Colors
allPriorityColors.forEach(function (colorElem) {
    colorElem.addEventListener('click', function (e) {
        allPriorityColors.forEach(function (priorityColorElem) {
            priorityColorElem.classList.remove('active')
        })
        colorElem.classList.add('active')
        modalPriorityColor = colorElem.classList[0]
    })
})

// Generating A Ticket
modalCont.addEventListener('keydown', function (e) {
    let key = e.key
    if (key == 'Shift') {

        createTicket(modalPriorityColor, taskareaCont.value)
        modalCont.style.display = 'none'
        addFlag = false
        taskareaCont.value = ''
    }
    if (e.keyCode == 27) {
        modalCont.style.display = 'none'
        addFlag = false
    }
})

function createTicket(ticketColor, textValue, ticketId) {
    let id = ticketId || shortid()
    let ticketCont = document.createElement('div')
    ticketCont.setAttribute('class', 'ticket-cont')

    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area" spellcheck="false">${textValue}</div>
    <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`

    mainCont.appendChild(ticketCont)
    handleRemoval(ticketCont, id)
    handleLock(ticketCont, id)
    handleColor(ticketCont, id)

    if (!ticketId) {
        ticketsArr.push({
            ticketColor,
            textValue,
            ticketId: id
        })

        localStorage.setItem('tickets', JSON.stringify(ticketsArr))
    }
}

//Remove Tickets
removeBtn.addEventListener('click', function () {
    removeFlag = !removeFlag
    if (removeFlag) {
        removeBtn.style.color = 'red'
    } else {
        removeBtn.style.color = '#d1d8e0'
    }
})

function handleRemoval(ticket, id) {
    ticket.addEventListener('click', function () {
        if (removeFlag) {
            ticketsArr = ticketsArr.filter(function (ticket) {
                return id != ticket.ticketId
            })
            localStorage.setItem('tickets', JSON.stringify(ticketsArr))
            ticket.remove()
        }
    })
}

//Lock and Unlock Tickets

function handleLock(ticket, id) {
    let ticketLockElem = ticket.querySelector('.ticket-lock')
    let ticketTaskArea = ticket.querySelector('.task-area')

    let ticketlock = ticketLockElem.children[0]

    ticketlock.addEventListener('click', function (e) {
        if (ticketlock.classList.contains(lockClass)) {
            ticketlock.classList.remove(lockClass)
            ticketlock.classList.add(unlockClass)
            ticketTaskArea.setAttribute('contenteditable', 'true')

        } else {
            ticketlock.classList.remove(unlockClass)
            ticketlock.classList.add(lockClass)
            ticketTaskArea.setAttribute('contenteditable', 'false')
        }

        let ticketIdx = getTicketIdx(id)
        ticketsArr[ticketIdx].textValue = ticketTaskArea.innerText
        localStorage.setItem('tickets', JSON.stringify(ticketsArr))

    });

}

function handleColor(ticket, id) {
    let ticketColorBand = ticket.querySelector('.ticket-color')

    ticketColorBand.addEventListener('click', function (e) {
        let currentTicketColor = ticketColorBand.classList[1]

        let currentTicketColoridx = colors.findIndex(function (color) {
            return currentTicketColor === color
        })

        currentTicketColoridx++
        let newTicketColor = colors[currentTicketColoridx % colors.length]

        ticketColorBand.classList.remove(currentTicketColor)
        ticketColorBand.classList.add(newTicketColor)

        let ticketIdx = getTicketIdx(id)
        ticketsArr[ticketIdx].ticketColor = newTicketColor
        localStorage.setItem('tickets', JSON.stringify(ticketsArr))

    })
}

function getTicketIdx(id) {
    let ticketIdx = ticketsArr.findIndex(function (ticket) {
        return ticket.ticketId == id
    })
    return ticketIdx
}