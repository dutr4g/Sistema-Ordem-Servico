import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDn40cTliv864EldCgqB2dwi7zRb7JwAxg",
  authDomain: "ordemservicoapp-36ef7.firebaseapp.com",
  projectId: "ordemservicoapp-36ef7",
  storageBucket: "ordemservicoapp-36ef7.firebasestorage.app",
  messagingSenderId: "585474303007",
  appId: "1:585474303007:web:b8570435f7f054fbc3a12a"
};

// Inicializa Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("buscarStatus").addEventListener("click", async function () {
    const codigo = document.getElementById("codigoAcompanhamento").value.trim();
    const resultadoStatus = document.getElementById("resultadoStatus");

    if (!codigo) {
        resultadoStatus.textContent = "Por favor, digite um código de acompanhamento.";
        resultadoStatus.style.color = "red";
        return;
    }

    try {
        const q = query(collection(db, "ordensServico"), where("codigoAcompanhamento", "==", codigo));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            resultadoStatus.textContent = "Código não encontrado. Verifique e tente novamente.";
            resultadoStatus.style.color = "red";
        } else {
            querySnapshot.forEach((doc) => {
                const ordem = doc.data();
                if (ordem.statusHistorico.length > 0) {
                    const ultimoStatus = ordem.statusHistorico[ordem.statusHistorico.length - 1];
                    resultadoStatus.innerHTML = `Status Atual: <strong>${ultimoStatus.status}</strong><br>Última Atualização: <strong>${ultimoStatus.dataHora}</strong>`;
                } else {
                    resultadoStatus.innerHTML = "Status não disponível.";
                }
                resultadoStatus.style.color = "green";
            });
        }
    } catch (error) {
        console.error("Erro ao buscar status:", error);
        resultadoStatus.textContent = "Erro ao buscar status. Tente novamente mais tarde.";
        resultadoStatus.style.color = "red";
    }
});

// Botão para voltar à tela de login
document.getElementById("voltarLogin").addEventListener("click", function () {
    window.location.href = "login.html";
});
