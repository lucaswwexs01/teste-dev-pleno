-- Arquivo de inicialização do MySQL
-- Este arquivo é executado automaticamente quando o container MySQL é criado

-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS test_dev_pleno CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados
USE test_dev_pleno;

-- Aplicar privilégios
FLUSH PRIVILEGES;