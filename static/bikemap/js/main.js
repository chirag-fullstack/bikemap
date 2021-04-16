// holds all the routes details like name and coordinates
// Used for map plotting and route update
routes = {}

function errorCallback(err) {
    alert('Got an error');
}

function plotRouteMap(event) {
    // function for plotting map for each route
    // also mark the selected route as active
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

    del_el = document.createElement('div');
    del_el.innerHTML = '<i class="far fa-trash-alt"></i>';
    del_el.className = 'route-del';
    del_el.addEventListener('click', function() {
        if (window.confirm('Are you sure to delete this route?'))
            deleteRoute(route.id);
    });

    cont_el.appendChild(el);
    cont_el.appendChild(edit_el);
    cont_el.appendChild(del_el);
    return cont_el
}

function loadRoutes() {
    // function to list routes from the route api
    fetch(ROUTE_URL)
    .then(response => response.json())
    .then(data => {
        data.map(route => {
            // Update routes data store
            routes[route.id] = {
                "name": route.name,
                "coordinates": reverseCoordinates(route.paths.coordinates) // L map coordinate are reverse of what django use
            }

            // append list element of each route
            document.getElementById('route-list').appendChild(createRouteElement(route));

            // Active first route
            routeElements = document.getElementsByClassName('route');
            if (routeElements.length > 0) routeElements[0].click();
        })
    })
    .catch(errorCallback);
}

function saveRoute(method, request_data, id=null) {
    // function for saving route details
    // param: method (POST, PUT, PATCH)
    // param: request_data ({name, paths: {type: "MultiLineString", coordinates: [[[lat1, long1], [lat2, long2],]]}})
    // param: id (Required on update method)
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
        // Read the content of json file to format it for route api
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
    // function to update route
    id = document.querySelector('#update-route-form #updated-route-id').value;
    name = document.querySelector('#update-route-form #updated-name').value;
    coordinates = document.querySelector('#update-route-form #updated-coordinates').files[0];
    if (name && !coordinates && name !== routes[id].name) {
        // update name only if changed
        saveRoute('PATCH', {
            "id": + id,
            "name": name
        }, id)
    } else if (coordinates && name) {
        // Read the content of json file to format it for route api
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

function deleteRoute(id) {
    // function to delete a route
    fetch(`${ROUTE_URL}${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    .then(response => {
        response.ok ? location.reload() : errorCallback()
    })
    .catch(errorCallback);
}

// Stuffs on document load
(function() {
    // load route list
    loadRoutes();

    // bootstrap modal events
    $('#createRouteModal').on('show.bs.modal, hide.bs.modal', function (e) {
        document.getElementById('create-route-form').reset();
        Array.from(document.querySelectorAll('#create-route-form small.error')).forEach(el=> el.innerHTML = '');
    });
    $('#updateRouteModal').on('hide.bs.modal', function (e) {
        document.getElementById('update-route-form').reset();
        Array.from(document.querySelectorAll('#update-route-form small.error')).forEach(el=> el.innerHTML = '');
    });
})();
