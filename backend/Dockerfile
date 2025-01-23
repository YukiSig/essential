FROM python:3.12.6

WORKDIR /app
COPY . .

RUN pip install --upgrade pip && pip install pipenv
RUN pipenv sync

EXPOSE 5001
CMD ["pipenv", "run", "gunicorn", "-w", "2", "-b", "0.0.0.0:5001", "app:app"]