import { Router } from "express";
import { randomUUID } from "crypto";
import { UsuarioRepository } from "../models/UsuarioRepository";
import { PapelUsuario } from "../entities/Usuario";

const router = Router();
const usuarioRepository = new UsuarioRepository();

router.get("/auth/registro", (req, res) => {
    res.render("auth/registro", { erro: null });
});

router.post("/auth/registro", async (req, res) => {
    try {
        const { nome, email, senha, matricula, chaveAdmin } = req.body;

        const matriculaOuNull = matricula && matricula.trim() !== "" ? matricula.trim() : null;

        // Se passar a senha secreta de admin, vira bibliotecario. Senão, vira aluno.
        const CHAVE_BIBLIOTECARIO = "admin123"; 

        let papel: PapelUsuario = "aluno";
        if (chaveAdmin && chaveAdmin === CHAVE_BIBLIOTECARIO) {
            papel = "bibliotecario";
        }

        // Se tentar se cadastrar sem senha de admin e sem matrícula, o Repository vai lançar um erro
        await usuarioRepository.criar(randomUUID(), nome, email, senha, matriculaOuNull, papel);
        
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