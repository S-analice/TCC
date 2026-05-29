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
VITE_API_KEY=SEU_API_KEY_AQUI

**Estrutura Atual**
Total de arquivos no projeto: /



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



**Tecnologias Utilizadas**
* XAMPP
* PhpMyAdmin
* MySql
* AXIOS
* EXPRESS
* NODE.JS
* DOTENV
* API Ibge
* CORS
* Multer
* Sharp
* Html Pdf Node
* Handlebars
