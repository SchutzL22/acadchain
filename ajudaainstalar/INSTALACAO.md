# Guia de Instalação e Execução — AcadChain

Este guia orienta a configuração do ambiente de desenvolvimento no **Windows 11**.

---

## 1. Pré-requisitos
- **Windows 11** de 64 bits.
- **Node.js 24+ LTS** (o AcadChain utiliza o módulo nativo `node:sqlite`).
- **Git** instalado.

---

## 2. Instalação com Um Clique
Abra o prompt de comando (CMD) ou PowerShell na raiz da pasta `criptografia` e execute:
```cmd
instalar.bat
```
O script realizará:
1. Verificação da versão do Node.js, npm e Git.
2. Instalação das dependências nos workspaces (`client` e `backend`).
3. Criação da pasta de banco de dados (`dados/`).
4. Execução dos scripts SQL para criar as tabelas e inserir os dados sintéticos.

---

## 3. Inicialização dos Servidores
Para iniciar a API do backend e a interface do frontend:
```cmd
iniciar.bat
```
Após a inicialização, acesse:
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3001/api/health](http://localhost:3001/api/health)

---

## 4. Parada dos Serviços
Para encerrar os servidores do AcadChain sem fechar outros processos do Node.js:
```cmd
parar.bat
```

---

## 5. Restauração dos Dados de Demonstração
Se desejar retornar o banco ao estado original de fábrica com dados fictícios:
```cmd
resetar-demo.bat
```
O script solicitará confirmação antes de recriar o arquivo `dados/acadchain.sqlite`.
