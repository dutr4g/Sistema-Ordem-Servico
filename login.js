import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDn40cTliv864EldCgqB2dwi7zRb7JwAxg",
  authDomain: "ordemservicoapp-36ef7.firebaseapp.com",
  projectId: "ordemservicoapp-36ef7",
  storageBucket: "ordemservicoapp-36ef7.firebasestorage.app",
  messagingSenderId: "585474303007",
  appId: "1:585474303007:web:b8570435f7f054fbc3a12a"
};

// Inicializa Firebase e Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Captura o formulário de login
document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtém os valores do formulário
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const mensagem = document.getElementById("mensagem");

    // Tenta fazer login
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            mensagem.textContent = "Login bem-sucedido! Redirecionando...";
            mensagem.style.color = "green";
            setTimeout(() => {
                window.location.href = "index.html"; // Página após login
            }, 2000);
        })
        .catch((error) => {
            mensagem.textContent = "Erro: " + error.message;
            mensagem.style.color = "red";
        });
});

// Redireciona para a página de verificação de status
document.getElementById("check-status").addEventListener("click", function () {
    window.location.href = "verificar-status.html";
});
