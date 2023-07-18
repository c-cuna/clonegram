## Deployment
### Deploying for Development
Run application
```$ docker compose up -d --build```
Get logs
```$ docker compose logs -f```
### Deploying for Production
Run application
```$ docker compose -f docker-compose.prod.yml up -d --build```
Run Database scripts
```
$ docker compose -f docker-compose.prod.yml exec web python manage.py migrate --noinput
$ docker compose -f docker-compose.prod.yml exec web python manage.py collectstatic --no-input --clear
```
Get logs
```$ docker compose logs -f```
