// src/middlewares/upload.ts
// Configuração do Multer: define onde as imagens enviadas são salvas
// e como o nome do arquivo é gerado, para evitar arquivos com nomes
// repetidos sobrescrevendo uns aos outros.

import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.resolve("uploads"));
    },
    filename: (req, file, callback) => {
        // Prefixa com um UUID para nunca colidir com outro upload,
        // mas mantém a extensão original (.jpg, .png etc.).
        const extensao = path.extname(file.originalname);
        callback(null, `${randomUUID()}${extensao}`);
    }
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB, evita upload de arquivo gigante
    fileFilter: (req, file, callback) => {
        // Aceita só imagens comuns — barra qualquer outro tipo de arquivo.
        const tiposPermitidos = /jpeg|jpg|png|webp/;
        const valido = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());

        if (!valido) {
            callback(new Error("Apenas imagens (jpg, png, webp) são permitidas."));
            return;
        }
        callback(null, true);
    }
});