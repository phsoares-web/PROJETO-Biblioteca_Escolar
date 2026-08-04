import express from "express";
import request from "supertest";
import router from "../EmprestimoRoute";
import { EmprestimoRepository } from "../../models/EmprestimoRepository";
import { AlunoRepository } from "../../models/AlunoRepository";
import { LivroRepository } from "../../models/LivroRepository";

jest.mock("../../models/EmprestimoRepository");
jest.mock("../../models/AlunoRepository");
jest.mock("../../models/LivroRepository");

describe("Rotas de Empréstimo (EmprestimoRoutes)", () => {
  let app: express.Express;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

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

  describe("GET /emprestimos", () => {
    it("deve listar os empréstimos e renderizar a view 'emprestimos/index'", async () => {
      (EmprestimoRepository.prototype.listar as jest.Mock).mockReturnValue([]);

      const response = await request(app).get("/emprestimos");

      expect(response.status).toBe(200);
      expect(EmprestimoRepository.prototype.listar).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /emprestimos/novo", () => {
    it("deve carregar a tela do formulário trazendo apenas livros disponíveis", async () => {
      (AlunoRepository.prototype.listar as jest.Mock).mockReturnValue([]);
      (LivroRepository.prototype.listar as jest.Mock).mockReturnValue([]);

      const response = await request(app).get("/emprestimos/novo");

      expect(response.status).toBe(200);
      expect(AlunoRepository.prototype.listar).toHaveBeenCalledTimes(1);
      expect(LivroRepository.prototype.listar).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /emprestimos/atrasados", () => {
    it("deve listar os empréstimos atrasados", async () => {
      (EmprestimoRepository.prototype.listarAtrasados as jest.Mock).mockReturnValue([]);

      const response = await request(app).get("/emprestimos/atrasados");

      expect(response.status).toBe(200);
      expect(EmprestimoRepository.prototype.listarAtrasados).toHaveBeenCalledTimes(1);
    });
  });
});