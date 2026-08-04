import express from "express";
import request from "supertest";
import router from "../AlunoRoute";
import { AlunoRepository } from "../../models/AlunoRepository";

jest.mock("../../models/AlunoRepository");

describe("Rotas de Aluno (alunoRoutes)", () => {
  let app: express.Express;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Mock da sessão (caso a rota utilize req.session)
    app.use((req: any, res, next) => {
      req.session = { usuarioId: "123" };
      next();
    });

    // Engine mock para renderização EJS
    app.engine("ejs", (filePath: string, options: any, callback: Function) => {
      return callback(null, "<html>Renderizado</html>");
    });
    app.set("views", "./views");
    app.set("view engine", "ejs");

    app.use(router);
  });

  describe("GET /alunos", () => {
    it("deve listar os alunos e renderizar a view 'alunos/index'", async () => {
      const mockAlunos = [{ id: "1", nome: "João" }];
      (AlunoRepository.prototype.listar as jest.Mock).mockReturnValue(mockAlunos);

      const response = await request(app).get("/alunos");

      expect(response.status).toBe(200);
      expect(AlunoRepository.prototype.listar).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /alunos/novo", () => {
    it("deve renderizar o formulário de novo aluno", async () => {
      const response = await request(app).get("/alunos/novo");
      expect(response.status).toBe(200);
    });
  });

  describe("GET /alunos/:id/editar", () => {
    it("deve renderizar a view de edição quando o aluno existir", async () => {
      const mockAluno = { id: "1", nome: "João" };
      (AlunoRepository.prototype.buscarPorId as jest.Mock).mockReturnValue(mockAluno);

      const response = await request(app).get("/alunos/1/editar");

      expect(response.status).toBe(200);
      expect(AlunoRepository.prototype.buscarPorId).toHaveBeenCalledWith("1");
    });
  });
});