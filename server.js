const express = require("express");
const cors = require("cors");
const db = require("./database");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ══════════════════════════════
//         PRODUTOS (COM /api)
// ══════════════════════════════

app.get("/api/produtos", (req, res) => {
  db.query("SELECT * FROM produtos", (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

app.post("/api/produtos", (req, res) => {
  const { nome, descricao, categoria, preco, disponivel, estoque } = req.body;
  db.query(
    "INSERT INTO produtos (nome, descricao, categoria, preco, disponivel, estoque) VALUES (?,?,?,?,?,?)",
    [nome, descricao, categoria, preco, disponivel, estoque],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

app.put("/api/produtos/:id", (req, res) => {
  const { nome, descricao, categoria, preco, disponivel, estoque } = req.body;
  db.query(
    "UPDATE produtos SET nome=?, descricao=?, categoria=?, preco=?, disponivel=?, estoque=? WHERE id=?",
    [nome, descricao, categoria, preco, disponivel, estoque, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ sucesso: true });
    }
  );
});

app.delete("/api/produtos/:id", (req, res) => {
  db.query("DELETE FROM produtos WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ sucesso: true });
  });
});

// ══════════════════════════════
//         CLIENTES (COM /api)
// ══════════════════════════════

app.get("/api/clientes", (req, res) => {
  db.query("SELECT * FROM clientes", (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

app.post("/api/clientes", (req, res) => {
  const { nome, telefone, email, endereco } = req.body;
  db.query(
    "INSERT INTO clientes (nome, telefone, email, endereco) VALUES (?,?,?,?)",
    [nome, telefone, email, endereco],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

app.put("/api/clientes/:id", (req, res) => {
  const { nome, telefone, email, endereco, totalCompras, numPedidos } = req.body;
  db.query(
    "UPDATE clientes SET nome=?, telefone=?, email=?, endereco=?, totalCompras=?, numPedidos=? WHERE id=?",
    [nome, telefone, email, endereco, totalCompras, numPedidos, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ sucesso: true });
    }
  );
});

app.delete("/api/clientes/:id", (req, res) => {
  const clienteId = req.params.id;

  db.query(
    "DELETE ip FROM itens_pedido ip INNER JOIN pedidos p ON ip.pedidoId = p.id WHERE p.clienteId = ?",
    [clienteId],
    (err) => {
      if (err) {
        console.error("Erro ao excluir itens_pedido:", err);
        return res.status(500).json({ erro: err.message });
      }

      db.query("DELETE FROM pedidos WHERE clienteId = ?", [clienteId], (err2) => {
        if (err2) {
          console.error("Erro ao excluir pedidos:", err2);
          return res.status(500).json({ erro: err2.message });
        }

        db.query("DELETE FROM clientes WHERE id = ?", [clienteId], (err3) => {
          if (err3) {
            console.error("Erro ao excluir cliente:", err3);
            return res.status(500).json({ erro: err3.message });
          }
          res.json({
            sucesso: true,
            mensagem: "Cliente e todos os seus pedidos foram excluídos com sucesso!",
          });
        });
      });
    }
  );
});

// ══════════════════════════════
//         PEDIDOS (COM /api)
// ══════════════════════════════

app.get("/api/pedidos", (req, res) => {
  db.query("SELECT * FROM pedidos", (err, pedidos) => {
    if (err) return res.status(500).json({ erro: err.message });
    db.query("SELECT * FROM itens_pedido", (err2, itens) => {
      if (err2) return res.status(500).json({ erro: err2.message });
      const resultado = pedidos.map((p) => ({
        ...p,
        itens: itens.filter((i) => i.pedidoId === p.id),
      }));
      res.json(resultado);
    });
  });
});

app.post("/api/pedidos", (req, res) => {
  const { clienteId, clienteNome, tipo, obs, itens, subtotal, taxa, total, status } = req.body;
  db.query(
    "INSERT INTO pedidos (clienteId, clienteNome, tipo, obs, subtotal, taxa, total, status, criadoEm) VALUES (?,?,?,?,?,?,?,?,NOW())",
    [clienteId, clienteNome, tipo, obs, subtotal, taxa, total, status],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });
      const pedidoId = result.insertId;
      const valores = itens.map((i) => [pedidoId, i.prodId, i.nome, i.preco, i.quantidade]);
      db.query(
        "INSERT INTO itens_pedido (pedidoId, prodId, nome, preco, quantidade) VALUES ?",
        [valores],
        (err2) => {
          if (err2) return res.status(500).json({ erro: err2.message });
          res.json({ id: pedidoId, ...req.body });
        }
      );
    }
  );
});

app.put("/api/pedidos/:id", (req, res) => {
  const { status } = req.body;
  db.query("UPDATE pedidos SET status=? WHERE id=?", [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ sucesso: true });
  });
});

app.delete("/api/pedidos/:id", (req, res) => {
  db.query("DELETE FROM itens_pedido WHERE pedidoId=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: err.message });
    db.query("DELETE FROM pedidos WHERE id=?", [req.params.id], (err2) => {
      if (err2) return res.status(500).json({ erro: err2.message });
      res.json({ sucesso: true });
    });
  });
});

// ══════════════════════════════
//         INICIAR SERVIDOR
// ══════════════════════════════

app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});