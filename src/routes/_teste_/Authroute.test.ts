import express from "express";
import request from "supertest";
import router from "../AuthRoute";
import { UsuarioRepository } from "../../models/UsuarioRepository";

jest.mock("../../models/UsuarioRepository");

describe("Rotas de Autenticação (authRoutes)", () => {
  let app: express.Express;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Mock do gerenciador de sessão
    app.use((req: any, res, next) => {
      req.session = { usuarioId: undefined, destroy: (cb: Function) => cb && cb() };
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

  it("deve abrir tela de login", async () => {
    const response = await request(app).get("/auth/login");
    expect(response.status).toBe(200);
  });
});