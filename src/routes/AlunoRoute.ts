// src/routes/alunoRoutes.ts
// Rotas de Aluno: aqui já fica toda a lógica de tratamento de requisição
// (listar, formulário, criar, editar, atualizar, remover, buscar).


import { Router } from "express";
import { randomUUID } from "crypto";
import { Aluno } from "../entities/Aluno";
import { AlunoRepository } from "../models/AlunoRepository";

const router = Router();
const alunoRepository = new AlunoRepository();

router.get("/alunos", (req, res) => {
    try {
        const alunos = alunoRepository.listar();
        res.render("alunos/index", { alunos });
    } catch (error) {
        res.status(500).send("Erro ao listar alunos.");
    }
});

router.get("/alunos/novo", (req, res) => {
    res.render("alunos/form", { aluno: null, erro: null });
});

router.get("/alunos/:id/editar", (req, res) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
        res.status(400).send("ID inválido.");
        return;
    }

    const aluno = alunoRepository.buscarPorId(id);
    if (!aluno) {
        res.status(404).send("Aluno não encontrado.");
        return;
    }

    res.render("alunos/form", { aluno, erro: null });
});

router.post("/alunos", (req, res) => {
    try {
        const { nome, matricula } = req.body;

        // Não usamos Aluno.fromJSON aqui: ele exige um "id" já pronto,
        // mas o id de um aluno novo é gerado agora, pelo servidor.
        const aluno = new Aluno(randomUUID(), nome, matricula);
        alunoRepository.criar(aluno);

        res.redirect("/alunos");
    } catch (error: any) {
        res.status(400).render("alunos/form", { aluno: req.body, erro: error.message });
    }
});

router.put("/alunos/:id", (req, res) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
        res.status(400).send("ID inválido.");
        return;
    }

    try {
        const { nome, matricula } = req.body;
        const atualizado = alunoRepository.atualizar(id, { nome, matricula });

        if (!atualizado) {
            res.status(404).send("Aluno não encontrado.");
            return;
        }

        res.redirect("/alunos");
    } catch (error: any) {
        res.status(400).render("alunos/form", { aluno: req.body, erro: error.message });
    }
});

// Remove um aluno via fetch (DELETE), sem recarregar a página.
// Responde em JSON porque quem chama é o JavaScript do navegador,
// não um <form> tradicional.
router.delete("/alunos/:id", (req, res) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
        res.status(400).json({ mensagem: "ID inválido." });
        return;
    }

    const removido = alunoRepository.remover(id);

    if (!removido) {
        res.status(404).json({ mensagem: "Aluno não encontrado." });
        return;
    }

    res.status(200).json({ mensagem: "Aluno removido com sucesso." });
});

// Busca alunos por nome via fetch (usado no campo de busca com debounce).
router.get("/api/alunos/busca", (req, res) => {
    const termo = String(req.query.nome ?? "");
    const alunos = alunoRepository.buscarPorNome(termo);
    res.status(200).json(alunos.map(aluno => aluno.toJSON()));
});

export default router;