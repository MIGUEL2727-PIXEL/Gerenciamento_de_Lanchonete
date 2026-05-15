-- Apagar banco existente e recriar
DROP DATABASE IF EXISTS fastfood;
CREATE DATABASE fastfood;
USE fastfood;

-- Tabela produtos
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(255),
  categoria VARCHAR(50),
  preco DECIMAL(10,2) NOT NULL,
  disponivel BOOLEAN DEFAULT true,
  estoque INT DEFAULT 0
);

-- Tabela clientes (CORRIGIDO: totalCompra sem S)
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100),
  endereco VARCHAR(255),
  totalCompra DECIMAL(10,2) DEFAULT 0,
  numPedidos INT DEFAULT 0
);

-- Tabela pedidos
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clienteId INT,
  clienteNome VARCHAR(100),
  tipo VARCHAR(20),
  obs VARCHAR(255),
  subtotal DECIMAL(10,2),
  taxa DECIMAL(10,2),
  total DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'aguardando',
  criadoEm DATETIME DEFAULT NOW(),
  FOREIGN KEY (clienteId) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Tabela itens_pedido
CREATE TABLE itens_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedidoId INT,
  prodId INT,
  nome VARCHAR(100),
  preco DECIMAL(10,2),
  quantidade INT,
  FOREIGN KEY (pedidoId) REFERENCES pedidos(id) ON DELETE CASCADE
);

-- Inserir dados iniciais
INSERT INTO clientes (nome) VALUES ('Cliente Balcão');
INSERT INTO clientes (nome, telefone) VALUES ('João Silva', '(11) 99999-1234');

INSERT INTO produtos (nome, descricao, categoria, preco, estoque) VALUES
('X-Burger', 'Pão, hambúrguer, queijo', 'lanche', 15.90, 50),
('Coca-Cola', 'Lata 350ml', 'bebida', 5.90, 100),
('Batata Frita', 'Porção média', 'adicional', 8.90, 60),
('Sorvete', 'Creme com calda', 'sobremesa', 7.90, 40),
('X-Tudo', 'Completo com bacon e ovo', 'lanche', 24.90, 30);

-- Verificar dados
SELECT * FROM produtos;
SELECT * FROM clientes;
SELECT * FROM pedidos;
SELECT * FROM itens_pedido;