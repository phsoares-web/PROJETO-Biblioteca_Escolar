import express from "express";
import request from "supertest";
import router from "../LivroRoute";
import { LivroRepository } from "../../models/LivroRepository";

jest.mock("../../models/LivroRepository");

// Mock do Multer se houver rotas com upload de arquivo
jest.mock("multer", () => {
  const multerMock = () => ({
    single: () => (req: any, res: any, next: any) => next(),
  });
  multerMock.diskStorage = jest.fn();
  return multerMock;
});

describe("Rotas de Livro (livroRoutes)", () => {
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

  describe("GET /livros", () => {
    it("deve listar os livros e renderizar a view 'livros/index'", async () => {
      (LivroRepository.prototype.listar as jest.Mock).mockReturnValue([]);

      const response = await request(app).get("/livros");

      expect(response.status).toBe(200);
      expect(LivroRepository.prototype.listar).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /livros/novo", () => {
    it("deve renderizar a tela de formulário de novo livro", async () => {
      const response = await request(app).get("/livros/novo");
      expect(response.status).toBe(200);
    });
  });

  describe("GET /livros/:id/editar", () => {
    it("deve renderizar a view de edição quando o livro existir", async () => {
      const mockLivro = { id: "1", titulo: "Dom Casmurro" };
      (LivroRepository.prototype.buscarPorId as jest.Mock).mockReturnValue(mockLivro);

      const response = await request(app).get("/livros/1/editar");

      expect(response.status).toBe(200);
      expect(LivroRepository.prototype.buscarPorId).toHaveBeenCalledWith("1");
    });
  });
});