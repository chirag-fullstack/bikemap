
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function isActive(el, activeClass='active') {
    active = false;
    el.classList.forEach(function(value) {
        active = value === activeClass;
    });
    return active;
}

function readFile(file) {
  return new Promise(resolve => {
    const fr = new FileReader();
    fr.onload = e => {
      resolve(e.target.result);
    };
    fr.readAsText(file)
  })
}

function reverseCoordinates(coordinates) {
    // reversing coordinates for L map
    for(let i=0; i < coordinates.length; i++) {
        coordinates[i].forEach(coordinate => coordinate.reverse());
    }
    return coordinates
}