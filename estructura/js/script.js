function mostrarForm(id) {
  document.getElementById('login').hidden = id !== 'login';
  document.getElementById('register').hidden = id !== 'register';
}
document.getElementById('link-register')
  .addEventListener('click', function(e) {
    e.preventDefault();
    mostrarForm('register');
  });
document.getElementById('link-login')
  .addEventListener('click', function(e) {
    e.preventDefault();
    mostrarForm('login');
  });


function validarPassword(password) {
  // Requisitos: mínimo 8 caracteres, una mayúscula, un carácter especial (.,!@#$%^&*)
  const regex = /^(?=.*[A-Z])(?=.*[.,!@#$%^&*]).{8,}$/;
  return regex.test(password);
}

const passwordInput = document.getElementById('register-password');
const passwordError = document.getElementById('password-error');

passwordInput.addEventListener('input', function() {
  if (passwordInput.value.length > 0 && !validarPassword(passwordInput.value)) {
    passwordError.textContent = 
      'La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.';
  } else {
    passwordError.textContent = '';
  }
});