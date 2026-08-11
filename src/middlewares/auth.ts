// src/middlewares/auth.ts
// Middleware que protege rotas: só deixa passar quem tem sessão ativa
// (ou seja, quem já fez login). Usado nas rotas que exigem autenticação.

import { Request, Response, NextFunction } from "express";

export function autenticar(req: Request, res: Response, next: NextFunction): void {
    // usuarioId só existe na sessão depois de um login bem-sucedido
    // (veja authRoutes.ts, onde ele é atribuído).
    if (!req.session.usuarioId) {
        res.redirect("/auth/login");
        return;
    }

    next();
}