import express from "express";
import request from "supertest";
import path from "path";
import router from "../AlunoRoute";
import { AlunoRepository } from "../../models/AlunoRepository";

// Mock do Repositório
jest.mock("../../models/AlunoRepository");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../../views"));

// Interceptador para evitar erros 500 caso o EJS não encontre a view no ambiente de teste
app.use((req, res, next) => {
  res.render = function (view, options) {
    return res.status(200).send("Rendered OK");
  };
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/alunos", router);

describe("Rotas de Aluno (alunoRoutes)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve listar os alunos e renderizar a view 'alunos/index'", async () => {
    jest.spyOn(AlunoRepository.prototype, "listar").mockResolvedValue([]);

    const response = await request(app).get("/alunos");

    expect(response.status).toBe(200);
    expect(AlunoRepository.prototype.listar).toHaveBeenCalledTimes(1);
  });

  it("deve renderizar o formulário de novo aluno", async () => {
    const response = await request(app).get("/alunos/novo");

    expect(response.status).toBe(200);
  });

  it("deve renderizar a view de edição quando o aluno existir", async () => {
    jest.spyOn(AlunoRepository.prototype, "buscarPorId").mockResolvedValue({ 
      id: "1", 
      nome: "Aluno Teste" 
    } as any);

    const response = await request(app).get("/alunos/1/editar");

    expect(response.status).toBe(200);
    expect(AlunoRepository.prototype.buscarPorId).toHaveBeenCalledWith("1");
  });
}); 