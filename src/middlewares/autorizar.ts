// src/middlewares/autorizar.ts
// Middleware que restringe rotas por papel do usuário logado.
// Deve ser usado SEMPRE depois do middleware "autenticar" nas rotas,
// já que depende de req.session.usuarioPapel já estar definido
// (isso só acontece depois de um login bem-sucedido).

import { Request, Response, NextFunction } from "express";
import { PapelUsuario } from "../entities/Usuario";

export function autorizar(...papeisPermitidos: PapelUsuario[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const papel = req.session.usuarioPapel;

        if (!papel || !papeisPermitidos.includes(papel)) {
            res.status(403).send("Você não tem permissão para acessar esta página.");
            return;
        }

        next();
    };
}