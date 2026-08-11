# PROJETO-Biblioteca_Escolar
# Projeto de informático focado em cria uma biblioteca escolar com a função de ajudar os alunos na leitura e no empréstino de livros Além de garantir o acesso gratuito a literatua  

##Componentes 

#João Victor = Back - end(Rotas, Controllers, Models, Auth, Validações) 

#Emanuel Guerra = Qa/testes(Jest, Documentação, Testes, Bugs, Readme) 

#Alice Gurgel = Front - end(Views Ejs, Css, js navegador(Fetch, Dom, loading)) 

#Paulo Henrique = Líder técnico(Estrutura mvc, Revisão de código, merge)  

#Tecnologias Que foram utilizadas

#Node.js 

#Typescript 

#Ejs 

#OOp(Classes) 

#Repository pattern 

#Mvc 

#Json 

#Bcrypt + session 

#Middleware auth  

#Multer  

#Fetch + Formdata  

#jest 

#Git/GitHub 

#Como executar  

#Git clone 

#Npm Install 

#Npm Run dev

#Como rodar testes  

#Npm testes 

#Estrutura de pastas 

projeto/  
src/  
entities/ 
_testes_/ 
models/  
_testes_/ 
routes/ 
_testes_/ 
middlewares/ 
views/ 
app.ts 
serve.ts 
public/ 
 ccs/ 
 js/ 
 uploads/ 
 dados/ 
 jest.config.js 
 package.json 
 readme.md 

 Tabela de rotas 
metedo    rota           Descrição       auth   status 
get      /api/produtos   Listar todos     sim     200 
post    /api/produtos     criar          sim     201/400 
put    /api/produtos/:id  atualizar      sim     200/404 
delete /api/produtos/:id  remover        admin   200/404 
post   /auth/registro     registra       não     201/400 
post   /auth/login        login          não     200/401  

Diagrama de caso e uso 

Admin 

#Log in 

#Add category  

#Add item

#Manage item 

#Manage order 

#Log out 

User 

#Registrantion 

#View item 

#Make order 

#Make payment 

#Update Profille 

#Log out
