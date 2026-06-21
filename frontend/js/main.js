document.addEventListener("DOMContentLoaded", () => {

    // MENU MOBILE
    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("menu");

    if (hamburger && menu) {
        hamburger.addEventListener("click", () => {
            menu.classList.toggle("show");
        });

        document.querySelectorAll(".menu a").forEach(link => {
            link.addEventListener("click", () => {
                menu.classList.remove("show");
            });
        });
    }

    // FORM
    const form = document.getElementById("form-oracao");
    const btnEnviar = document.getElementById("btnEnviar");
    const mensagemRetorno = document.getElementById("mensagemRetorno");

    // Timestamp anti-bot
    document.getElementById("inicio").value = Date.now();

    // Rate limit local
    const STORAGE_KEY_LAST_REQUEST = "ultimaRequisicao";
    const RATE_LIMIT_MINUTES = 5;

    function isRateLimited() {
        const last = localStorage.getItem(STORAGE_KEY_LAST_REQUEST);
        if (!last) return false;
        const diffMin = (Date.now() - new Date(last).getTime()) / 1000 / 60;
        return diffMin < RATE_LIMIT_MINUTES;
    }

    function setRateLimitTimestamp() {
        localStorage.setItem(STORAGE_KEY_LAST_REQUEST, new Date().toISOString());
    }

    // Validação simples
    function validateForm() {
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const pedido = document.getElementById('pedido').value.trim();
        const lgpd = document.getElementById('lgpd').checked;
        const honeypot = document.getElementById('website').value;

        if (honeypot) return false;
        if (nome.length < 3) return false;
        if (pedido.length < 10) return false;
        if (!lgpd) return false;

        if (email) {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(email)) return false;
        }

        return true;
    }

    // Envio do formulário
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            mensagemRetorno.textContent = "Verifique os campos e tente novamente.";
            mensagemRetorno.style.color = "#b00020";
            return;
        }

        if (isRateLimited()) {
            mensagemRetorno.textContent = "Você já enviou um pedido recentemente. Tente novamente em alguns minutos.";
            mensagemRetorno.style.color = "#b00020";
            return;
        }

        btnEnviar.disabled = true;
        mensagemRetorno.textContent = "Enviando...";
        mensagemRetorno.style.color = "";

        const payload = {
            nome: document.getElementById('nome').value.trim(),
            email: document.getElementById('email').value.trim(),
            pedido: document.getElementById('pedido').value.trim(),
            lgpd: document.getElementById('lgpd').checked,
            website: document.getElementById('website').value,
            inicio: document.getElementById('inicio').value
        };
//CHAMA API
        try {
            const resp = await fetch('http://localhost:8080/api/pedido-oracao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await resp.json();

            if (!resp.ok) {
                mensagemRetorno.textContent = data.erro || "Erro ao enviar pedido.";
                mensagemRetorno.style.color = "#b00020";
                throw new Error();
            }

            setRateLimitTimestamp();
            mensagemRetorno.textContent = "Pedido enviado com sucesso. Deus abençoe você!";
            mensagemRetorno.style.color = "green";
            form.reset();

        } catch (err) {
            mensagemRetorno.textContent = "Não foi possível enviar seu pedido agora. Tente novamente mais tarde.";
            mensagemRetorno.style.color = "#b00020";
        } finally {
            btnEnviar.disabled = false;
        }
    });

});
