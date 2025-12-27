async function loadPage(page, hash = null) {
  const response = await fetch(`src/pages/${page}.html`);
  const content = await response.text();

  document.getElementById("app").innerHTML = content;

  if (page === "contato") {
    initContatoPage();
  }

  if (hash) {
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPage("inicio");
});

function initContatoPage() {
  const app = document.getElementById("app");
  if (!app) return;

  const form = app.querySelector("form");
  if (!form) return;

  const serviceInput = form.querySelector("#serviceType");
  const serviceButtons = form.querySelectorAll(".servico-btn");

  serviceButtons.forEach((btn) => {
    const clone = btn.cloneNode(true);
    btn.replaceWith(clone);
  });

  const freshButtons = form.querySelectorAll(".servico-btn");
  let selectedService = null;

  freshButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedService = btn.innerText.trim();

      if (serviceInput) serviceInput.value = selectedService;

      freshButtons.forEach((b) => {
        b.classList.remove("selected-service");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("selected-service");
      btn.setAttribute("aria-pressed", "true");
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameEl = form.querySelector("#nameID");
    const emailEl = form.querySelector("#EmailID");
    const messageEl = form.querySelector("textarea[name='message']");

    const name = nameEl?.value?.trim() || "";
    const email = emailEl?.value?.trim() || "";
    const message = messageEl?.value?.trim() || "";

    if (!name || !email || !message) {
      alert("Preencha todos os campos.");
      return;
    }

    if (!serviceInput?.value) {
      alert("Selecione um tipo de serviço!");
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("opacity-50", "cursor-not-allowed");
    }

    try {
      await emailjs.send("service_ctupi2l", "template_fwjutrx", {
        from_name: name,
        from_email: email,
        service_type: serviceInput.value,
        message: message,
      });

      alert("Mensagem enviada com sucesso!");
      form.reset();
      freshButtons.forEach((b) => {
        b.classList.remove("selected-service");
        b.setAttribute("aria-pressed", "false");
      });
    } catch (err) {
      console.error("Erro emailjs:", err);
      alert("Erro ao enviar mensagem. Tente novamente mais tarde.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
      }
    }
  });
}

