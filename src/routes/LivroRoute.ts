// src/routes/livroRoutes.ts
// Rotas de Livro: inclui upload de capa via Multer nas rotas de
// criar/atualizar (o middleware precisa ser passado antes da rota).

import { Router } from "express";
import { randomUUID } from "crypto";
import { Livro } from "../entities/Livro";
import { LivroRepository } from "../models/LivroRepository";
import { upload } from "../middlewares/upload";
import { UsuarioRepository } from "../models/UsuarioRepository";

const router = Router();
const livroRepository = new LivroRepository();
const usuarioRepository = new UsuarioRepository();

router.get("/livros", (req, res) => {
    try {
        const livros = livroRepository.listar();
        const usuario = req.session?.usuarioId
            ? usuarioRepository.buscarPorId(req.session.usuarioId)
            : null;

        res.render("livros/index", { 
            titulo: "Catálogo dos Livros",
            usuario,
            livros
        });
    } catch (error) {
        res.status(500).send("Erro ao listar livros.");
    }
});

router.get("/livros/novo", (req, res) => {
    res.render("livros/form", { livro: null, erro: null });
});

router.get("/livros/:id/editar", (req, res) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
        res.status(400).send("ID inválido.");
        return;
    }

    const livro = livroRepository.buscarPorId(id);
    if (!livro) {
        res.status(404).send("Livro não encontrado.");
        return;
    }

    res.render("livros/form", { livro, erro: null });
});

router.post("/livros", upload.single("capa"), (req, res) => {
    try {
        const { titulo, autor } = req.body;

        // capaUrl vem do Multer: req.file só existe se o usuário enviou uma imagem.
        // Um livro novo sempre começa disponível (true).
        const capaUrl = req.file ? `/public/uploads/${req.file.filename}` : null;
        const livro = new Livro(randomUUID(), titulo, autor, true, capaUrl);

        livroRepository.criar(livro);
        res.redirect("/livros");
    } catch (error: any) {
        res.status(400).render("livros/form", { livro: req.body, erro: error.message });
    }
});

router.put("/livros/:id", upload.single("capa"), (req, res) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
        res.status(400).send("ID inválido.");
        return;
    }

    try {
        const { titulo, autor } = req.body;

        // Só troca a capa se um novo arquivo foi enviado; senão mantém a atual.
        const dados: any = { titulo, autor };
        if (req.file) {
            dados.capaUrl = `/uploads/${req.file.filename}`;
        }

        const atualizado = livroRepository.atualizar(id, dados);
        if (!atualizado) {
            res.status(404).send("Livro não encontrado.");
            return;
        }

        res.redirect("/livros");
    } catch (error: any) {
        res.status(400).render("livros/form", { livro: req.body, erro: error.message });
    }
});

router.delete("/livros/:id", (req, res) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
        res.status(400).json({ mensagem: "ID inválido." });
        return;
    }

    const removido = livroRepository.remover(id);

    if (!removido) {
        res.status(404).json({ mensagem: "Livro não encontrado." });
        return;
    }

    res.status(200).json({ mensagem: "Livro removido com sucesso." });
});

// Busca livros por título via fetch (usado no campo de busca com debounce).
router.get("/api/livros/busca", (req, res) => {
    const termo = String(req.query.busca ?? "");
    const livros = livroRepository.buscarPorTitulo(termo);
    res.status(200).json(livros.map(livro => livro.toJSON()));
});

export default router;