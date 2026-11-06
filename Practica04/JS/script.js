/* MecaGest — Wizard, validaciones y estados de campos (Vanilla JS) */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#registroForm");
    if (!form) return;

    const steps = Array.from(form.querySelectorAll(":scope > fieldset"));
    const stepItems = Array.from(document.querySelectorAll("#wizardSteps [data-step]"));
    const progressBar = document.querySelector("#wizardBarra");
    const progressTrack = document.querySelector(".wizard-track");
    const progressText = document.querySelector("#wizardResumen");
    const progressPercent = document.querySelector("#wizardPorcentaje");
    const nextButton = document.querySelector("#wizardSiguiente");
    const previousButton = document.querySelector("#wizardAnterior");
    const submitButton = document.querySelector("#btnEnviar");
    const birthInput = document.querySelector("#FNacimiento");
    const ageFeedback = document.querySelector("#edadResultado");
    const password = document.querySelector("#contrasena");
    const passwordConfirm = document.querySelector("#confirmarCont");

    const todayLocal = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
    };

    // Fecha máxima: hoy. También se valida por JS para evitar fechas futuras manipuladas.
    if (birthInput) birthInput.max = todayLocal();

    // Corrige validación nativa y muestra feedback consistente.
    const getAge = (dateString) => {
        const birth = new Date(`${dateString}T00:00:00`);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    function validateBirthDate() {
        if (!birthInput || !ageFeedback) return true;
        const value = birthInput.value;
        birthInput.setCustomValidity("");

        if (!value) {
            ageFeedback.textContent = "Ingresa tu fecha de nacimiento para calcular tu edad.";
            ageFeedback.className = "field-feedback";
            return !birthInput.required;
        }

        if (value > todayLocal()) {
            birthInput.setCustomValidity("La fecha de nacimiento no puede ser futura.");
            ageFeedback.textContent = "Error: la fecha de nacimiento no puede ser futura.";
            ageFeedback.className = "field-feedback is-error";
            return false;
        }

        const age = getAge(value);
        if (age < 0 || !Number.isFinite(age)) {
            birthInput.setCustomValidity("Ingresa una fecha de nacimiento válida.");
            ageFeedback.textContent = "Error: ingresa una fecha válida.";
            ageFeedback.className = "field-feedback is-error";
            return false;
        }

        const condition = age < 18 ? "menor de edad" : "mayor de edad";
        ageFeedback.textContent = `Tienes ${age} ${age === 1 ? "año" : "años"} y eres ${condition}.`;
        ageFeedback.className = "field-feedback is-success";
        return true;
    }

    function validatePasswords() {
        if (!password || !passwordConfirm) return true;
        passwordConfirm.setCustomValidity("");
        if (passwordConfirm.value && password.value !== passwordConfirm.value) {
            passwordConfirm.setCustomValidity("Las contraseñas no coinciden.");
            return false;
        }
        return true;
    }

    // Estilo activo y validación visual para todos los controles editables.
    const controls = Array.from(form.querySelectorAll("input, select, textarea"))
        .filter(control => !["submit", "reset", "button", "image", "hidden"].includes(control.type));

    controls.forEach(control => {
        control.addEventListener("focus", () => {
            control.closest(".form-group")?.classList.add("is-focused");
            control.classList.add("is-focused");
            const label = form.querySelector(`label[for="${CSS.escape(control.id)}"]`);
            label?.classList.add("label-focused");
        });
        control.addEventListener("blur", () => {
            control.closest(".form-group")?.classList.remove("is-focused");
            control.classList.remove("is-focused");
            const label = form.querySelector(`label[for="${CSS.escape(control.id)}"]`);
            label?.classList.remove("label-focused");
            if (control.type !== "checkbox" && control.type !== "radio") {
                control.classList.toggle("has-value", Boolean(control.value));
            }
        });
        control.addEventListener("input", refresh);
        control.addEventListener("change", refresh);
    });

    birthInput?.addEventListener("input", validateBirthDate);
    birthInput?.addEventListener("change", validateBirthDate);
    passwordConfirm?.addEventListener("input", validatePasswords);
    password?.addEventListener("input", validatePasswords);

    function isControlValid(control) {
        if (control.disabled) return true;
        if (control.type === "checkbox" && control.required) return control.checked;
        if (control.type === "radio") {
            const group = form.querySelectorAll(`input[type="radio"][name="${CSS.escape(control.name)}"]`);
            if (control.required) return Array.from(group).some(item => item.checked);
            return true;
        }
        if (control.type === "file" && control.required) return control.files.length > 0;
        if (control.required && !control.value.trim()) return false;
        if (control.value && !control.checkValidity()) return false;
        return true;
    }

    function sectionComplete(fieldset) {
        const sectionControls = Array.from(fieldset.querySelectorAll("input, select, textarea"))
            .filter(control => !control.disabled &&
                !["submit", "reset", "button", "image", "hidden"].includes(control.type));

        if (!sectionControls.length) return false;

        const requiredControls = sectionControls.filter(control => control.required);
        const allRequiredValid = requiredControls.every(isControlValid);
        const hasAnyValue = sectionControls.some(control => {
            if (control.type === "checkbox" || control.type === "radio") return control.checked;
            if (control.type === "file") return control.files.length > 0;
            return Boolean(control.value && control.value.trim());
        });

        // Un apartado sin campos obligatorios se completa al capturar al menos un dato.
        return allRequiredValid && (requiredControls.length > 0 || hasAnyValue);
    }

    let currentStep = 0;

    function updateWizard() {
        let completed = 0;

        steps.forEach((fieldset, index) => {
            const done = sectionComplete(fieldset);
            fieldset.classList.toggle("wizard-complete", done);
            fieldset.classList.toggle("wizard-current", index === currentStep);
            if (done) completed++;

            const item = stepItems[index];
            if (item) {
                item.classList.toggle("is-complete", done);
                item.classList.toggle("is-current", index === currentStep);
                item.setAttribute("aria-current", index === currentStep ? "step" : "false");
            }
        });

        const percent = steps.length ? Math.round((completed / steps.length) * 100) : 0;
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(percent));
        if (progressText) progressText.textContent = `${completed} de ${steps.length} apartados completados`;
        if (progressPercent) progressPercent.textContent = `${percent}%`;

        if (previousButton) previousButton.disabled = currentStep === 0;
        if (nextButton) {
            nextButton.textContent = currentStep === steps.length - 1 ? "Ir al inicio" : "Siguiente apartado";
        }

        // El envío se habilita cuando los campos obligatorios y validaciones globales son correctos.
        const requiredValid = Array.from(form.querySelectorAll("[required]")).every(isControlValid);
        const ageValid = validateBirthDate();
        const passwordsValid = validatePasswords();
        if (submitButton) submitButton.disabled = !(requiredValid && ageValid && passwordsValid);
    }

    function showStep(index) {
        if (!steps.length) return;
        currentStep = Math.max(0, Math.min(index, steps.length - 1));
        steps.forEach((fieldset, i) => {
            fieldset.classList.toggle("wizard-hidden", i !== currentStep);
        });
        updateWizard();
        steps[currentStep].scrollIntoView({ behavior: "smooth", block: "start" });
    }

    nextButton?.addEventListener("click", () => {
        if (currentStep < steps.length - 1) showStep(currentStep + 1);
        else showStep(0);
    });
    previousButton?.addEventListener("click", () => showStep(currentStep - 1));

    // Permite navegar al apartado haciendo clic en su indicador.
    stepItems.forEach((item, index) => {
        item.tabIndex = 0;
        item.setAttribute("role", "button");
        item.addEventListener("click", () => showStep(index));
        item.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                showStep(index);
            }
        });
    });

    form.addEventListener("input", refresh);
    form.addEventListener("change", refresh);
    form.addEventListener("reset", () => {
        window.setTimeout(() => {
            validateBirthDate();
            showStep(0);
            refresh();
        }, 0);
    });

    form.addEventListener("submit", event => {
        validateBirthDate();
        validatePasswords();
        if (!form.checkValidity()) {
            event.preventDefault();
            const invalid = form.querySelector(":invalid");
            const owner = invalid?.closest("fieldset");
            const index = steps.indexOf(owner);
            if (index >= 0) showStep(index);
            invalid?.focus();
            form.reportValidity();
        }
    });

    function refresh() {
        validateBirthDate();
        validatePasswords();
        updateWizard();
    }

    // Inicia mostrando el primer apartado y calcula el estado inicial.
    showStep(0);
    refresh();
});