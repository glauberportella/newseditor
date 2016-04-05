CREATE TABLE IF NOT EXISTS config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  valor TEXT
);

CREATE INDEX config_nome_idx ON config(nome);

INSERT INTO config VALUES
(1, 'DB_HOST', 'localhost'),
(2, 'DB_PORT', '3306'),
(3, 'DB_NAME', 'test'),
(4, 'DB_USER', 'root'),
(5, 'DB_PASS', ''),
(6, 'DOMAIN', 'www.seudominio.com.br');
