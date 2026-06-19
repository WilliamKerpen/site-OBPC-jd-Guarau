document.addEventListener("DOMContentLoaded", () => {

    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("menu");

    if (hamburger && menu) {

        hamburger.addEventListener("click", () => {
            menu.classList.toggle("show");
        });

        // Fecha ao clicar em um link
        document.querySelectorAll(".menu a").forEach(link => {
            link.addEventListener("click", () => {
                menu.classList.remove("show");
            });
        });

    }

});
//Validar formulario
function validateForm() {
    let valid = true;

    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const pedido = document.getElementById('pedido');
    const lgpd = document.getElementById('lgpd');
    const honeypot = document.getElementById('website');

    // honeypot
    if (honeypot.value) {
      return false;
    }

    // nome
    if (!nome.value || nome.value.trim().length < 3) {
      setError('nome', 'Informe seu nome completo.');
      valid = false;
    } else {
      setError('nome', '');
    }

    // email (opcional, mas se tiver, valida)
    if (email.value) {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(email.value)) {
        setError('email', 'Informe um e-mail válido ou deixe em branco.');
        valid = false;
      } else {
        setError('email', '');
      }
    } else {
      setError('email', '');
    }

    // pedido
    if (!pedido.value || pedido.value.trim().length < 10) {
      setError('pedido', 'Descreva seu pedido de oração com mais detalhes.');
      valid = false;
    } else {
      setError('pedido', '');
    }

    // LGPD
    if (!lgpd.checked) {
      valid = false;
      mensagemRetorno.textContent = 'Você precisa aceitar o uso dos dados conforme a LGPD.';
      mensagemRetorno.style.color = '#b00020';
    } else if (valid) {
      mensagemRetorno.textContent = '';
    }

    return valid;
  }

  function isRateLimited() {
    const last = localStorage.getItem(STORAGE_KEY_LAST_REQUEST);
    if (!last) return false;
    const lastDate = new Date(last);
    const diffMs = Date.now() - lastDate.getTime();
    const diffMin = diffMs / 1000 / 60;
    return diffMin < RATE_LIMIT_MINUTES;
  }

  function setRateLimitTimestamp() {
    localStorage.setItem(STORAGE_KEY_LAST_REQUEST, new Date().toISOString());
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isRateLimited()) {
      mensagemRetorno.textContent =
        `Você já enviou um pedido recentemente. Tente novamente em alguns minutos.`;
      mensagemRetorno.style.color = '#b00020';
      return;
    }

    btnEnviar.disabled = true;
    mensagemRetorno.textContent = 'Enviando seu pedido...';
    mensagemRetorno.style.color = '';

    const payload = {
      nome: document.getElementById('nome').value.trim(),
      email: document.getElementById('email').value.trim(),
      pedido: document.getElementById('pedido').value.trim(),
    };

    try {
      // depois vamos apontar isso para o backend real
      const resp = await fetch('/api/pedido-oracao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error('Erro ao enviar pedido');
      }

      setRateLimitTimestamp();
      mensagemRetorno.textContent = 'Pedido enviado com sucesso. Deus abençoe você!';
      mensagemRetorno.style.color = 'green';
      form.reset();
    } catch (err) {
      mensagemRetorno.textContent =
        'Não foi possível enviar seu pedido agora. Tente novamente mais tarde.';
      mensagemRetorno.style.color = '#b00020';
    } finally {
      btnEnviar.disabled = false;
    }
});