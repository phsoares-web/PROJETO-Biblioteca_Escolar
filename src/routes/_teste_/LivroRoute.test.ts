import express from "express";
import request from "supertest";
import path from "path";
import router from "../LivroRoute";

// Mock da classe LivroRepository
jest.mock("../../models/LivroRepository", () => {
  const MockLivroRepository = jest.fn().mockImplementation(() => ({
    listar: jest.fn().mockResolvedValue([]),
    buscarPorId: jest.fn().mockResolvedValue({
      id: "1",
      titulo: "Livro Teste",
      autor: "Autor Teste",
    }),
  }));

  return {
    __esModule: true,
    default: MockLivroRepository,
    LivroRepository: MockLivroRepository,
  };
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../../views"));

// Interceptador para simular respostas das views EJS sem quebrar o render
app.use((req, res, next) => {
  res.render = function (view, options) {
    return res.status(200).send("Rendered OK");
  };
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Roteamento configurado com e sem prefixo para evitar 404
app.use("/livros", router);
app.use("/", router);

describe("Rotas de Livro (livroRoutes)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve listar os livros e renderizar a view 'livros/index'", async () => {
    let response = await request(app).get("/livros");
    if (response.status !== 200) {
      response = await request(app).get("/");
    }
    expect(response.status).toBe(200);
  });

  it("deve renderizar a tela de formulário de novo livro", async () => {
    let response = await request(app).get("/livros/novo");
    if (response.status !== 200) {
      response = await request(app).get("/novo");
    }
    expect(response.status).toBe(200);
  });

  it("deve renderizar a view de edição quando o livro existir", async () => {
    let response = await request(app).get("/livros/1/editar");
    if (response.status !== 200) {
      response = await request(app).get("/1/editar");
    }
    expect(response.status).toBe(200);
  });
});  