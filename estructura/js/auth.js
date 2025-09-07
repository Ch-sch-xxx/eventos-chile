// Al hacer clic en “Regístrate” muestra registro y oculto login
document.getElementById('link-register').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('login').classList.add('oculto');
    document.getElementById('register').classList.remove('oculto');
});
// Al hacer clic en “Inicia sesión” muestra login y oculta registro
document.getElementById('link-login').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('register').classList.add('oculto');
    document.getElementById('login').classList.remove('oculto');
});