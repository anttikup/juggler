let timeout;


function hide() {
    document.getElementById('message').style.display = 'none';
    clearTimeout(timeout);
    timeout = null;
}

function setMessage(title, body) {
    document.getElementById('message-title').textContent = title;
    document.getElementById('message-body').textContent = body;
    document.getElementById('message').style.display = 'block';

    if ( timeout ) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
        hide();
    }, 3000);
}

function keep() {
    clearTimeout(timeout);
}


export default {
    setMessage,
    hide,
    keep,
};
