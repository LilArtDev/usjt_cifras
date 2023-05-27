const express = require("express");
const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());



// Configuração do banco de dados
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados: ", err);
  } else {
    console.log("Conexão bem-sucedida ao banco de dados");
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.userId = decoded.userId;
    next();
  });
};

// Rotas CRUD
// Rota para criar uma música
app.post("/musics", verifyToken, (req, res) => {
  const { user_id, title, author, letter } = req.body;
  const id = uuidv4(); // Gera um novo ID único usando o UUID

  const sql =
    "INSERT INTO tb_musics (id, user_id, title, author, letter, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())";
  const values = [id, user_id, title, author, letter];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Erro ao inserir música: ", err);
      res.status(500).json({ error: "Erro ao inserir música" });
    } else {
      res.status(201).json({ id, user_id, title, author, letter });
    }
  });
});

// Rota para obter todas as músicas
app.get("/musics", verifyToken, (req, res) => {
  const sql = "SELECT * FROM tb_musics";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao obter músicas: ", err);
      res.status(500).json({ error: "Erro ao obter músicas" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Rota para obter uma música por ID
app.get("/musics/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM tb_musics WHERE id = ?";
  const values = [id];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Erro ao obter música: ", err);
      res.status(500).json({ error: "Erro ao obter música" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Música não encontrada" });
    } else {
      res.status(200).json(results[0]);
    }
  });
});

// // Rota para atualizar uma música por ID
// app.put("/musics/:id", (req, res) => {
//   const { id } = req.params;
//   const { user_id, title, author, letter } = req.body;
//   const sql =
//     "UPDATE tb_musics SET user_id = ?, title = ?, author = ?, letter = ?, updated_at = NOW() WHERE id = ?";
//   const values = [user_id, title, author, letter, id];

//   db.query(sql, values, (err) => {
//     if (err) {
//       console.error("Erro ao atualizar música: ", err);
//       res.status(500).json({ error: "Erro ao atualizar música" });
//     } else {
//       res.status(200).json({ id, user_id, title, author, letter });
//     }
//   });
// });

// Rota para deletar uma música por ID
app.delete("/musics/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { token } = req.headers.to;
  const sql = "DELETE FROM tb_musics WHERE id = ?";
  const values = [id];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Erro ao deletar música: ", err);
      res.status(500).json({ error: "Erro ao deletar música" });
    } else {
      res.status(204).send();
    }
  });
});



// Inicia o servidor
app.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000");
});
