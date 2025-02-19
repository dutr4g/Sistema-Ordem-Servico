import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Config do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDn40cTliv864EldCgqB2dwi7zRb7JwAxg",
  authDomain: "ordemservicoapp-36ef7.firebaseapp.com",
  projectId: "ordemservicoapp-36ef7",
  storageBucket: "ordemservicoapp-36ef7.appspot.com",
  messagingSenderId: "585474303007",
  appId: "1:585474303007:web:b8570435f7f054fbc3a12a"
};

// Inicializa Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// logout
function logout() {
    signOut(auth)
        .then(() => {
            alert("Você saiu da conta.");
            window.location.href = "login.html";
        })
        .catch((error) => console.error("Erro ao sair:", error));
}

// Função para obter a data e hora atual formatada
function obterDataHoraAtual() {
    const agora = new Date();
    return agora.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

// Função para formatar data para o padrão dd/MM/yyyy
function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

// Função para carregar e exibir as ordens de serviço na tabela
async function carregarOrdens() {
    const tabelaOrdens = document.getElementById("order-list");
    tabelaOrdens.innerHTML = ""; 

    try {
        const querySnapshot = await getDocs(collection(db, "ordensServico"));
        querySnapshot.forEach((docSnap) => {
            const ordem = docSnap.data();
            const linha = document.createElement("tr");

            const statusAtual = ordem.statusHistorico.length > 0
                ? ordem.statusHistorico[ordem.statusHistorico.length - 1].status
                : "Status não disponível";

            linha.innerHTML = `
                <td>${ordem.cliente}</td>
                <td>${ordem.equipamento}</td>
                <td>${ordem.codigoAcompanhamento}</td>
                <td>${ordem.descricao}</td>
                <td>${formatarData(ordem.dataEntrada)}</td>
                <td>${statusAtual}</td>
                <td>
                    <input type="text" placeholder="Novo status" class="input-status">
                    <button class="atualizar-btn">Atualizar</button>
                    <button class="excluir-btn">Excluir</button>
                </td>
            `;

            // Pegando os botões e input da linha
            const inputStatus = linha.querySelector(".input-status");
            const botaoAtualizar = linha.querySelector(".atualizar-btn");
            const botaoExcluir = linha.querySelector(".excluir-btn");

            // Evento de atualização do status
            botaoAtualizar.addEventListener("click", () => {
                const novoStatus = inputStatus.value.trim();
                if (novoStatus) {
                    atualizarStatus(docSnap.id, novoStatus);
                } else {
                    alert("Digite um status válido!");
                }
            });

            // Evento de exclusão
            botaoExcluir.addEventListener("click", () => excluirOrdem(docSnap.id));

            // Adiciona a linha na tabela
            tabelaOrdens.appendChild(linha);
        });
    } catch (error) {
        console.error("Erro ao carregar ordens de serviço:", error);
    }
}

// Função para cadastrar nova ordem de serviço
async function cadastrarOrdem(event) {
    event.preventDefault();
    
    const cliente = document.getElementById("cliente").value;
    const equipamento = document.getElementById("equipamento").value;
    const descricao = document.getElementById("descricao").value;
    const dataEntrada = document.getElementById("dataEntrada").value;
    const status = document.getElementById("status").value;
    
    if (!cliente || !equipamento || !descricao || !dataEntrada || !status) {
        alert("Preencha todos os campos!");
        return;
    }
    
    const novaOrdem = {
        cliente,
        equipamento,
        descricao,
        dataEntrada,
        statusHistorico: [{ status, dataHora: obterDataHoraAtual() }],
        codigoAcompanhamento: Math.random().toString(36).substr(2, 9)
    };
    
    try {
        await addDoc(collection(db, "ordensServico"), novaOrdem);
        alert("Ordem cadastrada com sucesso!");
        document.getElementById("order-form").reset();
        carregarOrdens();
    } catch (error) {
        console.error("Erro ao cadastrar ordem:", error);
    }
}

// Função para atualizar status da ordem
async function atualizarStatus(id, novoStatus) {
    try {
        const ordemRef = doc(db, "ordensServico", id);
        const dataHora = obterDataHoraAtual();

        await updateDoc(ordemRef, {
            statusHistorico: [
                ...((await getDocs(collection(db, "ordensServico"))).docs.find(docSnap => docSnap.id === id).data().statusHistorico),
                { status: novoStatus, dataHora }
            ]
        });

        alert("Status atualizado com sucesso!");
        carregarOrdens();
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
    }
}

// Função para excluir ordem de serviço
async function excluirOrdem(id) {
    if (confirm("Tem certeza que deseja excluir esta ordem?")) {
        try {
            await deleteDoc(doc(db, "ordensServico", id));
            alert("Ordem excluída com sucesso!");
            carregarOrdens();
        } catch (error) {
            console.error("Erro ao excluir ordem:", error);
        }
    }
}

// Evento de submissão do formulário
document.getElementById("order-form").addEventListener("submit", cadastrarOrdem);

// Logout e redirecionamento pagina
document.getElementById("logout-btn").addEventListener("click", logout);

// Carregar ordens ao iniciar a página
document.addEventListener("DOMContentLoaded", carregarOrdens);
