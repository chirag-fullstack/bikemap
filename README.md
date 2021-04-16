# BikeMap

BikeMap is a route renderer app for plotting geometric coordinates on leaflet maps.

## Requirements

Following are the requirements to run this app.

- [PostgreSQL-11] - database server with gis support
- [postgis] - postgis extension must be enable in postgres db
- [Python3.8]  - python 3
- [Django-3.2] - App is built on Django framework.
- [DRF-3.12] - Django Rest Framework for Rest APIs.

## Installation

```bash
# Create virtual environment
virtualenv -p /usr/bin/python3.8 bikemap-venv
source bikemap-venv/bin/activate

# Clone the app from its repo
git clone https://github.com/chirag-fullstack/bikemap
cd bikemap
pip3 install -r requirements.txt

# other dependencies on Ubuntu
sudo apt install gdal-bin libgdal-dev
sudo apt install python3-gdal
sudo apt install binutils libproj-dev
sudo apt install postgis postgresql-11-postgis-3

# migrate db migrations
python3 manage.py migrate
```

## Runserver

```bash
python3 manage.py runserver
```

## Tests

DB user must be postgres for running tests. This is required for the creation of postgis extension on the test database.
```bash
python3 manage.py test
```
