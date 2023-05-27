const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();

const app = express();
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Rota para registro de usuário
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar se o usuário já existe no banco de dados
    const [rows] = await db.query(
      "SELECT * FROM tb_users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (rows.length > 0) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir o novo usuário no banco de dados
    await db.query(
      "INSERT INTO tb_users (username, email,password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    return res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

// Rota para autenticação e geração de token JWT
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe no banco de dados
    const [rows] = await db.query("SELECT * FROM tb_users WHERE  email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // Comparar a senha fornecida com o hash armazenado no banco de dados
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // Gerar um token JWT
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro no servidor" });
  }
});

// Middleware para verificar o token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }

    req.user = decoded;
    next();
  });
};

// Rota protegida para teste
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Rota protegida acessada com sucesso", user: req.user });
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log("Servidor iniciado na porta");
});
