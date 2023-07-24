# Clonegram
A simple clone of instagram written in django and nextjs.

## Key Features
* User authentication and authorization
* Post and Profile Picture Image Uploading
* Infinite scroll feed page
* Modal pop-up posts
* User functionalities for comments, likes, and follow
* Notification for comment, likes or follow
* Light and Dark mode
* Extensive API written in Django

## Missing Features
* Chat Component
* User specific Dark/Light Mode
* Celery Integraton

## Quick Start
### Deploying for Development
Run application
```
$ docker compose up -d --build
```

Get logs
```
$ docker compose logs -f
```
### Deploying for Production
Run application
```
$ docker compose -f docker-compose.prod.yml up -d --build
```

Run Database scripts
```
$ docker compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
$ docker compose -f docker-compose.prod.yml exec web python manage.py collectstatic --no-input --clear
```

Get logs
```
$ docker compose logs -f
```
