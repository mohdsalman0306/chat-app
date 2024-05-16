// making socket.io connection
const socket = io()

const $messageForm = document.querySelector('#chat_form')
const $messageFormInput = document.querySelector('#type_message')
const $messageFormButton = document.querySelector('#submit')

const $locationButton = document.querySelector('#send-location')

// updated count
socket.on('countUpdated', (count) => {
    console.log('The count has been updated!', count)
})

//button click count increment
document.querySelector('#increment').addEventListener('click', () => {
    console.log('clicked!')
    socket.emit('increment')
})

// starting a welcome on joining
socket.on('message', (message) => {
    console.log(message)
})

//sharing message from the form
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.type_message.value
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error) {
            return console.log(error)
        }
        console.log('Message has been delivered! ')
    })
})


// sharing location
document.querySelector('#send-location').addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geo location is not supported by your browser.');
    }
    $locationButton.setAttribute('disabled', 'disabled')
    
    navigator.geolocation.getCurrentPosition(({coords, timestamp}) => {
        
        socket.emit('sendLocation', {
            'latitude': coords.latitude,
            'longitude': coords.longitude
        }, () => {
            $locationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})