FROM python:3.12

WORKDIR /app

# Dépendances système (psycopg, etc.)
RUN apt-get update && apt-get install -y gcc libpq-dev netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copier requirements et installer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le code
COPY . .

# Copier l'entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh
RUN chmod +x /entrypoint.sh
RUN python -m app.scripts.seed_role
ENTRYPOINT ["/entrypoint.sh"]