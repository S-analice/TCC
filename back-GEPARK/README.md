# TCC – BACK GEPARK


Iniciar o XAMPP
**Instalação do Projeto**
```bash
git pull
cd back-GEPARK
npm install
node scripts/seedIbge.js
npm run dev
```
Acessar: http://localhost/phpmyadmin


**Variáveis de Ambiente**
Crie um arquivo **.env** na raiz do projeto:

PORT=3001

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gepark

JWT_SECRET=gepark_secret_key_2026_@TCC

VITE_API_URL=https://api.openweathermap.org/data/2.5
VITE_API_KEY=ad5c2867dcf6cc19700761baeb1b120c

**Estrutura Atual**
Total de arquivos no projeto: 40/44



**Registro de Desenvolvimento**

**12/05**
* Criação da arquitetura MVC  + CSR


**16/05**
* Criando as tabelas e os inserts


**23/05**
* Implementando Funcionário e Empresa


**26/05**
* Implementando Motorista e Movimentação


**28/05**
* Arrumando fotos e pdfs


**06/06**
* Adicionando o Checklist



**Tecnologias Utilizadas**
* XAMPP
* phpMyAdmin
* MySQL
* Node.js
* Express
* Axios
* API IBGE
* Bcryptjs
* JSON Web Token
* Dotenv
* Cors
* Multer
* Sharp
* Html-pdf-node
* Handlebars
* Nodemailer
