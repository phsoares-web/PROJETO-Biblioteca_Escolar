// src/types/session.d.ts
import "express-session";
import { PapelUsuario } from "../entities/Usuario";

declare module "express-session" {
    interface SessionData {
        usuarioId?: string;
        usuarioPapel?: PapelUsuario;
    }
}