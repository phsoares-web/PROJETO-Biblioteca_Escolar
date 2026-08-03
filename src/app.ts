// src/app.ts
// Configuração central do Express: middlewares, sessão, EJS, arquivos
// estáticos e as rotas do sistema. 
// Exporta o app pronto para o server.ts apenas dar o "listen".

import express from "express";
import session from "express-session";
import path from "path";

import AlunoRoute from "./routes/AlunoRoute";
import LivroRoute from "./routes/LivroRoute";
import EmprestimoRoute from "./routes/EmprestimoRoute";
import AuthRoute from "./routes/AuthRoute";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "sua-chave-secreta",
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.use(AuthRoute);
app.use(AlunoRoute);
app.use(LivroRoute);
app.use(EmprestimoRoute);

app.get("/", (req, res) => {
  res.redirect("/Livros");
});

export default app;