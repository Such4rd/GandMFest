
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = '';
  toast.classList.add(type, 'show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3500);
}


document.addEventListener("keydown", function(e) {
     
    const tecla = e.key ? e.key.toLowerCase() : "";
    //f12
    if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        showToast("No hagas el mal a tus amigos, maldito picacodigos");
        return false;
    }   
    //ctrl + shift + I
    if (e.ctrlKey && e.shiftKey && tecla === "i") {
        e.preventDefault();
        e.stopPropagation();
        showToast("No inspecciones a tus amigos, maldito picacodigos");
        return false;
    }
    //ctrl + shift + J
    if (e.ctrlKey && tecla === "j") {
        e.preventDefault();
        e.stopPropagation();
        showToast("No abras la consola, maldito picacodigos");
        return false;
    }
    // ctrl + U
    if (e.ctrlKey && tecla === "u") {
        e.preventDefault();
        e.stopPropagation();    
        showToast("No mires el código fuente, maldito picacodigos");
        return false;
    }    
});



