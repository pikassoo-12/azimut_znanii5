(() => {
  "use strict";

  const form = document.getElementById("request-form");
  if (!form) return;

  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById("form-status");
  const nextPage = document.getElementById("application-next");
  const sourceField = document.getElementById("application-source");
  const phone = document.getElementById("phone");

  if (!button || !status || !nextPage || !phone) {
    return;
  }

  const isWebPage =
    location.protocol === "http:" ||
    location.protocol === "https:";

  if (!isWebPage) {
    button.disabled = false;

    status.textContent =
      "Откройте сайт через Live Server в VS Code.";

    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    return;
  }

  nextPage.value = new URL("diagnostic.html", location.href).href;
  nextPage.disabled = true;

  if (sourceField) {
    sourceField.value = location.origin + location.pathname;
  }

  function resetButton() {
    button.disabled = false;
    button.textContent = "Отправить заявку";

    status.textContent =
      "Заявка будет передана через FormSubmit на почту директора.";
  }

  function validatePhone() {
    const value = phone.value.trim();
    const digits = Array.from(value).filter(
      (character) => character >= "0" && character <= "9"
    );

    const allowed = "+0123456789 ()-";

    const charactersValid = Array.from(value).every(
      (character, index) =>
        allowed.includes(character) &&
        (character !== "+" || index === 0)
    );

    const lengthValid = digits.length >= 10 && digits.length <= 15;

    phone.setCustomValidity(
      charactersValid && lengthValid
        ? ""
        : "Укажите телефон с кодом страны, например +7 999 123-45-67."
    );
  }

  phone.addEventListener("input", validatePhone);

  form.addEventListener("submit", (event) => {
    validatePhone();

    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }

    button.disabled = true;
    button.textContent = "Переходим к отправке…";

    status.textContent =
      "Пройдите проверку от спама, если она появится.";

    // Форму отправляет браузер.
    // Здесь нет самостоятельного перехода на диагностику.
  });

  window.addEventListener("pageshow", resetButton);

  resetButton();
})();