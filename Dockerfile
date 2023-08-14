FROM python:3.10.6-alpine
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev
COPY Pipfile Pipfile.lock /app/
RUN pip install pipenv &&  pipenv install --system
COPY ./scripts/entrypoint.sh .
RUN sed -i 's/\r$//g' /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
COPY . .
EXPOSE 8080
EXPOSE 9000

ENTRYPOINT ["/app/entrypoint.sh"]
