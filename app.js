const screens = [...document.querySelectorAll(".screen")];
const toast = document.getElementById("toast");

const phoneInput = document.getElementById("phoneInput");
const consent = document.getElementById("consent");
const phoneError = document.getElementById("phoneError");
const otpSubtitle = document.getElementById("otpSubtitle");
const otpInput = document.getElementById("otpInput");
const otpError = document.getElementById("otpError");
const otpDeliveryNote = document.getElementById("otpDeliveryNote");
const passInput = document.getElementById("passInput");
const passError = document.getElementById("passError");
const emailInput = document.getElementById("emailInput");
const emailPassInput = document.getElementById("emailPassInput");
const emailError = document.getElementById("emailError");
const callbackPhoneInput = document.getElementById("callbackPhoneInput");
const callbackError = document.getElementById("callbackError");
const timerLabel = document.getElementById("timer");
const resendBtn = document.getElementById("resendBtn");

let countdown = 30;
let countdownTimer = null;
let resendRequests = 0;

const showScreen = (name) => {
  screens.forEach((screen) => {
    const active = screen.dataset.screen === name;
    screen.classList.toggle("is-active", active);
  });
};

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2200);
};

const normalizePhone = (value) => value.replace(/\D/g, "");
const normalizeRussianPhone = (value) => {
  const digits = normalizePhone(value);
  if (!digits) return "";
  if (digits.startsWith("7")) return `7${digits.slice(1, 11)}`;
  if (digits.startsWith("8")) return `7${digits.slice(1, 11)}`;
  return `7${digits.slice(0, 10)}`;
};

const formatPhone = (digits) => {
  const d = digits.slice(0, 11);
  return d ? `+${d}` : "";
};

phoneInput.addEventListener("input", () => {
  const digits = normalizeRussianPhone(phoneInput.value);
  if (!digits) {
    phoneInput.value = "";
    phoneInput.classList.remove("input-error");
    phoneError.textContent = "";
    return;
  }
  phoneInput.value = formatPhone(digits);
  phoneInput.classList.remove("input-error");
  phoneError.textContent = "";
});

callbackPhoneInput.addEventListener("input", () => {
  const digits = normalizeRussianPhone(callbackPhoneInput.value);
  if (!digits) {
    callbackPhoneInput.value = "";
    callbackPhoneInput.classList.remove("input-error");
    callbackError.textContent = "";
    return;
  }
  callbackPhoneInput.value = formatPhone(digits);
  callbackPhoneInput.classList.remove("input-error");
  callbackError.textContent = "";
});

const validatePhoneStep = () => {
  const digits = normalizePhone(phoneInput.value);

  if (digits.length !== 11 || !digits.startsWith("7")) {
    phoneInput.classList.add("input-error");
    phoneError.textContent = "Принимаем только российские номера в формате +79991234567.";
    return false;
  }

  if (!consent.checked) {
    phoneError.textContent = "Примите условия, чтобы продолжить.";
    return false;
  }

  phoneError.textContent = "";
  phoneInput.classList.remove("input-error");
  return true;
};

const startCountdown = () => {
  clearInterval(countdownTimer);
  countdown = 30;
  resendBtn.disabled = true;
  timerLabel.textContent = `Повторная отправка через 00:${String(countdown).padStart(2, "0")}`;

  countdownTimer = setInterval(() => {
    countdown -= 1;
    if (countdown <= 0) {
      clearInterval(countdownTimer);
      timerLabel.textContent = "Можно запросить код повторно";
      resendBtn.disabled = false;
      return;
    }

    timerLabel.textContent = `Повторная отправка через 00:${String(countdown).padStart(2, "0")}`;
  }, 1000);
};

document.getElementById("continueBtn").addEventListener("click", () => {
  if (!validatePhoneStep()) return;
  otpSubtitle.textContent = `Отправили код через push или SMS: ${phoneInput.value}`;
  otpDeliveryNote.textContent = "При следующем запросе отправим код через push или SMS.";
  otpInput.value = "";
  otpError.textContent = "";
  resendRequests = 0;
  showScreen("otp");
  startCountdown();
});

document.getElementById("verifyBtn").addEventListener("click", () => {
  const value = otpInput.value.trim();
  otpInput.classList.remove("input-error");
  otpError.textContent = "";

  if (!/^\d{6}$/.test(value)) {
    otpInput.classList.add("input-error");
    otpError.textContent = "Введите 6 цифр из сообщения.";
    return;
  }

  if (value === "000000") {
    otpError.textContent = "Срок кода истёк. Запросите новый.";
    return;
  }

  if (value !== "123456") {
    otpError.textContent = "Код не совпал. Попробуйте ещё раз.";
    return;
  }

  showScreen("password");
});

document.getElementById("wrongNumberBtn").addEventListener("click", () => {
  showScreen("phone");
});

resendBtn.addEventListener("click", () => {
  resendRequests += 1;

  if (resendRequests >= 3) {
    callbackPhoneInput.value = phoneInput.value;
    callbackError.textContent = "";
    showScreen("callback");
    return;
  }

  otpInput.value = "";
  if (resendRequests === 1) {
    otpDeliveryNote.textContent = "Если запросите код ещё раз, отправим его также на e-mail.";
    showToast("Готово, повторно отправили код через push или SMS.");
  }

  if (resendRequests === 2) {
    otpDeliveryNote.textContent = "Отправили код через push/SMS и на e-mail.";
    showToast("Отправили код через push/SMS и дополнительно на e-mail.");
  }

  startCountdown();
});

document.getElementById("loginBtn").addEventListener("click", () => {
  const pass = passInput.value;
  passError.textContent = "";
  passInput.classList.remove("input-error");

  if (pass.length < 8) {
    passInput.classList.add("input-error");
    passError.textContent = "Пароль должен быть не короче 8 символов.";
    return;
  }

  if (pass.toLowerCase() === "blocked123") {
    passError.textContent = "Аккаунт временно заблокирован. Обратитесь в поддержку.";
    return;
  }

  showScreen("success");
});

document.getElementById("resetPassBtn").addEventListener("click", () => {
  showToast("Отправили ссылку на восстановление.");
});

document.getElementById("emailLoginBtn").addEventListener("click", () => {
  const email = emailInput.value.trim().toLowerCase();
  const password = emailPassInput.value;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  emailError.textContent = "";
  emailInput.classList.remove("input-error");
  emailPassInput.classList.remove("input-error");

  if (!emailPattern.test(email)) {
    emailInput.classList.add("input-error");
    emailError.textContent = "Проверьте email. Пример: name@example.com";
    return;
  }

  if (password.length < 8) {
    emailPassInput.classList.add("input-error");
    emailError.textContent = "Пароль должен быть не короче 8 символов.";
    return;
  }

  if (password.toLowerCase() === "blocked123") {
    emailError.textContent = "Аккаунт временно заблокирован. Обратитесь в поддержку.";
    return;
  }

  showScreen("success");
});

document.getElementById("helpBtn").addEventListener("click", () => showScreen("support"));
document.getElementById("noCodeHelpBtn").addEventListener("click", () => showScreen("support"));
document.getElementById("contactSupportBtn").addEventListener("click", () => {
  showToast("Чат поддержки откроем в следующем обновлении.");
});
document.getElementById("otherRegionBtn").addEventListener("click", () => {
  emailInput.value = "";
  emailPassInput.value = "";
  emailError.textContent = "";
  showScreen("email");
});

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.back));
});

document.querySelectorAll(".support-item").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.support;
    const messages = {
      sms: "Проверьте папку спама и блокировку SMS от коротких номеров.",
      blocked: "Проверяем аккаунт. Обычно это занимает до 15 минут.",
      abroad: "Открываем вход по email."
    };
    if (key === "abroad") {
      emailInput.value = "";
      emailPassInput.value = "";
      emailError.textContent = "";
      showScreen("email");
      showToast(messages[key]);
      return;
    }
    showToast(messages[key]);
  });
});

document.getElementById("callbackBtn").addEventListener("click", () => {
  const digits = normalizePhone(callbackPhoneInput.value);
  callbackPhoneInput.classList.remove("input-error");
  callbackError.textContent = "";

  if (digits.length !== 11 || !digits.startsWith("7")) {
    callbackPhoneInput.classList.add("input-error");
    callbackError.textContent = "Принимаем только российские номера в формате +79991234567.";
    return;
  }

  showToast("Заявка принята. Сотрудник скоро свяжется с вами.");
  showScreen("phone");
});
