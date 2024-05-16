const socket = io()

socket.on('countUpdated', (count) => {
    console.log('The count has been updated!', count)
})

document.querySelector('#increment').addEventListener('click', () => {
    console.log('clicked!')
    socket.emit('increment')
})

socket.on('message', (message) => {
    console.log(message)
})
document.querySelector('#chat_form').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.type_message.value
    socket.emit('sendMessage', message)
})

document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geo location is not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition(({coords, timestamp}) => {
        console.log(coords)
        console.log(timestamp)
    })
})