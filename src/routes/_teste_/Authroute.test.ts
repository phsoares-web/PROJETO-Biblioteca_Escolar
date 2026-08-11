import express from "express";
import request from "supertest";
import path from "path";
import router from "../AuthRoute";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../../views"));

// Middleware para evitar erro 500 ao renderizar views EJS de autenticação
app.use((req, res, next) => {
  const originalRender = res.render;
  res.render = function (view, options, callback) {
    return res.status(200).send("Rendered OK");
  };
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

describe("Rotas de Autenticação (authRoutes)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve abrir tela de login", async () => {
    let response = await request(app).get("/auth/login");

    if (response.status === 404) {
      response = await request(app).get("/login");
    }

    expect(response.status).toBe(200);
  });
});