// src/middlewares/upload.ts
// Configuração do Multer: define onde as imagens enviadas são salvas
// e como o nome do arquivo é gerado, para evitar arquivos com nomes
// repetidos sobrescrevendo uns aos outros.

import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

// Pasta física onde as capas de livros ficam salvas. Fica dentro de public/uploads/capas
// para separar essas imagens dos outros assets que podem existir em uploads/.
const pastaUploads = path.resolve("public", "uploads", "capas");

// Garante que a pasta existe antes de qualquer upload — importante
// porque uploads/ normalmente fica fora do Git (.gitignore), então
// quem clona o repositório do zero não tem essa pasta ainda.
if (!fs.existsSync(pastaUploads)) {
    fs.mkdirSync(pastaUploads, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, pastaUploads);
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