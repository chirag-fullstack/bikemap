import json

from django.test import TestCase
from django.test import Client


class RouteTestCase(TestCase):
    """
    Route API test for CRUD actions
    """

    def setUp(self):
        self.client = Client()
        self.path = {
            "type": "MultiLineString",
            "coordinates": [[
                [16.354, 48.27571], [16.35444, 48.27522], [16.35327, 48.27473]
            ]]
        }

    def test_routes_api(self):
        # test route create api
        response = self.client.post('/api/routes/', data=json.dumps({
            "name": "Route 1",
            "paths": self.path
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # Below test cases are dependent on above post call
        # If we want to remove this dependency we can use db fixtures
        # test route list api
        response = self.client.get('/api/routes/', content_type='application/json')
        data = response.data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["name"], "Route 1")

        route_id = data[0]["id"]

        # test route update api
        response = self.client.put(f'/api/routes/{route_id}/', data=json.dumps({
            "name": "Route 2",
            "paths": self.path
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # test route get api and verify update
        response = self.client.get(f'/api/routes/{route_id}/', content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Route 2")

        # test route delete api
        response = self.client.delete(f'/api/routes/{route_id}/')
        self.assertEqual(response.status_code, 204)

        # verify route delete api
        response = self.client.get(f'/api/routes/{route_id}/', content_type='application/json')
        self.assertEqual(response.status_code, 404)
