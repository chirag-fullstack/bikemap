
routes = {}

function errorCallback(err) {
    alert('Got an error');
}


function createRouteElement(route) {
    // function to create element for list
    cont_el = document.createElement('div');
    cont_el.className = 'route-container';

    routes[route.id] = {
        "name": route.name,
        "coordinates": route.paths.coordinates
    }
    el = document.createElement('div');
    el.innerHTML = route.name;
    el.id = route.id;
    el.className = 'route';

    cont_el.appendChild(el);
    return cont_el
}

function loadRoutes() {
    // function to list routes from the route api
    fetch(ROUTE_URL)
    .then(response => response.json())
    .then(data => {
        data.map(route => {
            document.getElementById('route-list').appendChild(createRouteElement(route));

            // Active first route
            routeElements = document.getElementsByClassName('route');
            if (routeElements.length > 0) routeElements[0].click();
        })
    })
    .catch(errorCallback);
}

loadRoutes();

