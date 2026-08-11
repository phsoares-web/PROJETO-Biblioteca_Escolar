import { Router } from "express";
import { randomUUID } from "crypto";
import { UsuarioRepository } from "../models/UsuarioRepository";

const router = Router();
const usuarioRepository = new UsuarioRepository();

router.get("/auth/registro", (req, res) => {
    res.render("auth/registro", { erro: null });
});

router.post("/auth/registro", async (req, res) => {
    try {
        const { nome, email, senha, matricula } = req.body;

        // Campo vazio no form vira string vazia, não null — normaliza aqui.
        const matriculaOuNull = matricula && matricula.trim() !== "" ? matricula.trim() : null;

        await usuarioRepository.criar(randomUUID(), nome, email, senha, matriculaOuNull);
        res.redirect("/auth/login");
    } catch (error: any) {
        res.status(400).render("auth/registro", { erro: error.message });
    }
});

router.get("/auth/login", (req, res) => {
    res.render("auth/login", { erro: null });
});

router.post("/auth/login", async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await usuarioRepository.autenticar(email, senha);

        if (!usuario) {
            res.status(401).render("auth/login", { erro: "E-mail ou senha inválidos" });
            return;
        }

        req.session.usuarioId = usuario.id;
        req.session.usuarioPapel = usuario.papel;
        res.redirect("/livros");
    } catch (error: any) {
        res.status(400).render("auth/login", { erro: error.message });
    }
});

router.post("/auth/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/auth/login");
    });
});

export default router;