
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

function showUpdateRouteModal(id) {
    // function to update bootstrap modal on edit a route
    $('.route-id').text('#' + id);
    $('#updated-route-id').val(id);
    $('#updated-name').val(routes[id].name);
    $('#updateRouteModal').modal('show');
}

function createRouteElement(route) {
    // function to create element for list
    cont_el = document.createElement('div');
    cont_el.className = 'route-container';

    routes[route.id] = {
        "name": route.name,
        "coordinates": reverseCoordinates(route.paths.coordinates) // L map coordinate are reverse of what django use
    }
    el = document.createElement('div');
    el.innerHTML = route.name;
    el.id = route.id;
    el.className = 'route';
    el.addEventListener('click', plotRouteMap);

    edit_el = document.createElement('div');
    edit_el.innerHTML = '<i class="fas fa-edit"></i>';
    edit_el.className = 'route-edit';
    edit_el.addEventListener('click', function() {
        showUpdateRouteModal(route.id);
    });

    cont_el.appendChild(el);
    cont_el.appendChild(edit_el);
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

function saveRoute(method, request_data, id=null) {
    url = id ? `${ROUTE_URL}${id}/` : ROUTE_URL;
    fetch(url, {
        method,
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(request_data) // body data type must match "Content-Type" header
    })
    .then(response => location.reload())
    .catch(errorCallback);
}

function createRoute() {
    // function for create route from createRoute modal
    name = document.querySelector('#create-route-form #name').value;
    coordinate_file = document.querySelector('#create-route-form #coordinates').files[0];
    if (coordinate_file && name) {
        readFile(coordinate_file)
        .then(content => JSON.parse(content))
        .then(coordinates => {
            saveRoute('POST', {
                "name": name,
                "paths": {
                    "type": "MultiLineString",
                    "coordinates": JSON.parse(coordinates.polyline)
                }
            });
        })
        .catch(err => console.log(err));
    } else {
        if (!name) document.getElementById('name_error').innerHTML = 'Name is required.';
        if (!coordinate_file) document.getElementById('coordinates_error').innerHTML = 'Coordinate file is required.';
    }
}

function updateRoute() {
    id = document.querySelector('#update-route-form #updated-route-id').value;
    name = document.querySelector('#update-route-form #updated-name').value;
    coordinates = document.querySelector('#update-route-form #updated-coordinates').files[0];
    if (name && !coordinates && name !== routes[id].name) {
        saveRoute('PATCH', {
            "id": + id,
            "name": name
        }, id)
    } else if (coordinates && name) {
        readFile(coordinates)
        .then(content => JSON.parse(content))
        .then(coordinates => {
            saveRoute('PATCH', {
                "id": + id,
                "name": name,
                "paths": {
                    "type": "MultiLineString",
                    "coordinates": JSON.parse(coordinates.polyline)
                }
            }, id);
        })
        .catch(errorCallback);
    } else {
        if (!name) document.getElementById('updated_name_error').innerHTML = 'Name is required.';
    }
}

loadRoutes();

