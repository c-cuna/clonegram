# Clonegram
A simple clone of instagram written in django and nextjs.
Light Mode            |  Dark Mode
:-------------------------:|:-------------------------:
![home-light](https://github.com/c-cuna/clonegram/assets/122253189/f1e9df89-471d-4d02-9af2-6f9173ddd3e6) |  ![site-example-dark](https://github.com/c-cuna/clonegram/assets/122253189/bc2c50c0-1fe4-49f1-b734-e5d86890c0fd)

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
* Unit Testing
* Celery Integraton
* User specific Dark/Light Mode

## Quick Start
### Deploying for Development
Run application
```
$ docker compose up -d --build
```

Load server's static images
```
$ docker compose exec server python manage.py collectstatic --no-input --clear
```

Get logs
```
$ docker compose logs -f
```

Run Next.Js Server
```
$ cd /client
$ npm run dev
```

Swagger/Redoc URLs
```
/api/v1/swagger/
/api/v1/redoc/
/api/v1/swagger.<format>/ # yaml/json
```


### Deploying for Production
Run application
```
$ docker compose -f docker-compose.prod.yml up -d --build
```

Run Database scripts
```
$ docker compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
```

Load server's static images
```
$ docker compose exec server python manage.py collectstatic --no-input --clear
```

Get logs
```
$ docker compose logs -f
```

## License
[MIT](https://github.com/c-cuna/clonegram/blob/main/LICENSE) (c) 2023 c-cuna
