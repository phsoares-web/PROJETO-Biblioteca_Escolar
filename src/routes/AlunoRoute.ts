import { Router } from "express";
import { AlunoRepository } from "../models/AlunoRepository";

const router = Router();
const alunoRepository = new AlunoRepository();

// Rota de listagem
router.get("/", async (req, res) => {
  try {
    const alunos = await alunoRepository.listar();
    res.render("alunos/index", { alunos });
  } catch (error) {
    res.status(500).send("Erro ao listar alunos");
  }
});

// Rota para formulário de novo aluno
router.get("/novo", (req, res) => {
  res.render("alunos/novo");
});

// Rota para formulário de edição
router.get("/:id/editar", async (req, res) => {
  try {
    const aluno = await alunoRepository.buscarPorId(req.params.id);
    if (!aluno) {
      return res.status(404).send("Aluno não encontrado");
    }
    res.render("alunos/editar", { aluno });
  } catch (error) {
    res.status(500).send("Erro ao buscar aluno");
  }
});

export default router; 