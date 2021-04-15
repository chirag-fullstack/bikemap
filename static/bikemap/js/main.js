
routes = {}

function errorCallback(err) {
    alert('Got an error');
}

function plotRouteMap(event) {
    // function for plotting map for each route
    if (isActive(event.target)) return false;
    active_route = document.getElementsByClassName('active');
    if (active_route.length > 0)
        active_route[0].classList.remove('active');
    route_id = event.target.id;
    document.getElementById(route_id).classList.add('active');
    document.getElementById('active-route-name').innerHTML = routes[route_id].name;
    createMap(routes[route_id]["coordinates"]);
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
    el.addEventListener('click', plotRouteMap);

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

