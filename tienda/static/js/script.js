document.addEventListener("DOMContentLoaded", function () {
    var nombreInput = document.getElementById("nombre");
    var emailInput = document.getElementById("email");
    var celularInput = document.getElementById("celular");
    var asuntoSelect = document.getElementById("asunto");
    var mensajeTextarea = document.getElementById("mensaje");
    var enviarBtn = document.getElementById("enviarBtn");

    if (nombreInput) {
        nombreInput.addEventListener("input", function () {
            validarNombre();
        });
    }

    if (emailInput) {
        emailInput.addEventListener("input", function () {
            validarEmail();
        });
    }

    if (celularInput) {
        celularInput.addEventListener("input", function () {
            validarCelular();
        });
    }

    if (asuntoSelect) {
        asuntoSelect.addEventListener("change", function () {
            validarAsunto();
        });
    }

    if (mensajeTextarea) {
        mensajeTextarea.addEventListener("input", function () {
            validarMensaje();
        });
    }

    if (enviarBtn) {
        enviarBtn.addEventListener("click", function () {
            validarFormulario();
        });
    }

    function validarNombre() {
        var nombre = nombreInput.value.trim();
        var nombreError = document.getElementById("nombreError");

        if (/\d/.test(nombre)) {
            nombreInput.value = nombre.replace(/\d/g, '');
            nombreError.textContent = "El nombre no puede contener números.";
            nombreInput.classList.add("error");
            nombreError.classList.add("mostrar-error");
        } else if (nombre.length < 3) {
            nombreError.textContent = "El nombre debe tener al menos 3 letras.";
            nombreInput.classList.add("error");
            nombreError.classList.add("mostrar-error");
        } else {
            nombreInput.classList.remove("error");
            nombreError.classList.remove("mostrar-error");
            nombreError.textContent = "";
        }
    }

    function validarEmail() {
        var email = emailInput.value.trim();
        var emailError = document.getElementById("emailError");

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            emailError.textContent = "El correo electrónico ingresado no es válido.";
            emailInput.classList.add("error");
            emailError.classList.add("mostrar-error");
        } else {
            emailInput.classList.remove("error");
            emailError.classList.remove("mostrar-error");
            emailError.textContent = "";
        }
    }

    function validarCelular() {
        var celular = celularInput.value.trim();
        var celularError = document.getElementById("celularError");

        if (!/^\+?[0-9]*$/.test(celular)) {
            celularInput.value = celular.replace(/\D/g, '').replace(/^(\+).*\+/, '$1');
            celularError.textContent = "El número de celular no es válido.";
            celularInput.classList.add("error");
            celularError.classList.add("mostrar-error");
        } else if (celular.length < 8) {
            celularError.textContent = "El número de celular debe tener al menos 8 dígitos.";
            celularInput.classList.add("error");
            celularError.classList.add("mostrar-error");
        } else if (celular.length >= 15) {
            celularInput.value = celular.substring(0, 15);
            celularError.textContent = "El número de celular no puede tener más de 15 dígitos.";
            celularInput.classList.add("error");
            celularError.classList.add("mostrar-error");
        } else {
            celularInput.classList.remove("error");
            celularError.classList.remove("mostrar-error");
            celularError.textContent = "";
        }
    }

    function validarAsunto() {
        var asunto = asuntoSelect.value;
        var asuntoError = document.getElementById("asuntoError");

        if (asunto === "") {
            asuntoError.textContent = "Por favor selecciona un asunto.";
            asuntoSelect.classList.add("error");
            asuntoError.classList.add("mostrar-error");
        } else {
            asuntoSelect.classList.remove("error");
            asuntoError.classList.remove("mostrar-error");
            asuntoError.textContent = "";
        }
    }

    function validarMensaje() {
        var mensaje = mensajeTextarea.value.trim();
        var mensajeError = document.getElementById("mensajeError");

        if (mensaje.split(/\s+/).length < 5) {
            mensajeError.textContent = "El mensaje debe tener al menos 5 palabras.";
            mensajeTextarea.classList.add("error");
            mensajeError.classList.add("mostrar-error");
        } else {
            mensajeTextarea.classList.remove("error");
            mensajeError.classList.remove("mostrar-error");
            mensajeError.textContent = "";
        }
    }

    function validarFormulario() {
        validarNombre();
        validarEmail();
        validarCelular();
        validarAsunto();
        validarMensaje();
    }
});

function valorDolar() {
    fetch('https://mindicador.cl/api')
        .then(function(response) {
            return response.json();
        })
        .then(function(dailyIndicators) {
            preciodolar = dailyIndicators.dolar.valor;
        })
        .catch(function(error) {
            console.log('Error en la solicitud:', error);
        });
}

function actualizarContadorCarrito() {
    $.ajax({
        url: '/obtener-cantidad-carrito/',
        type: 'GET',
        success: function(data) {
            $('.contador-carrito').text(data.cantidad_carrito);
        },
        error: function(error) {
            console.error('Error al obtener la cantidad del carrito:', error);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
});

window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("volverArriba").classList.add("mostrar");
    } else {
        document.getElementById("volverArriba").classList.remove("mostrar");
    }
}

document.getElementById("volverArriba")?.addEventListener("click", function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

function agregarAlCarrito(id) {
    fetch(`/agregar/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    }).then(response => {
        if (response.ok) {
            // Mostrar la modal después de que la solicitud sea exitosa
            $('#exampleModal').modal('show');
            // Actualizar el contador del carrito después de agregar el producto
            actualizarContadorCarrito();
        } else {
            console.error('Error al agregar al carrito');
        }
    }).catch(error => {
        console.error('Error en la solicitud:', error);
    });
}

function eliminarProducto(id) {
    fetch(`/eliminar/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    }).then(response => {
        if (response.ok) {
            actualizarContadorCarrito();
            window.location.reload();
        } else {
            console.error('Error al eliminar del carrito');
        }
    });
}
function formatoPesosChilenos(numero) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(numero);
}

function limpiarCarrito() {
    fetch('/limpiar/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    }).then(response => {
        if (response.ok) {
            window.location.reload();
        } else {
            console.error('Error al limpiar el carrito');
        }
    });
}

function sumarCantidad(itemId, accion) {
    let cantidad = 0;

    if (accion === 'sumar') {
        console.log(accion);
        cantidad = 1;
    }

    fetch(`/sumar-cantidad/${itemId}/${cantidad}/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cantidad }) 
      })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Error al actualizar la cantidad del producto');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.cantidad_actualizada === 0) {
            document.getElementById(`item-${itemId}`).remove();
        } else {
            let cantidadElemento = document.getElementById(`cantidad-${itemId}`);
            if (cantidadElemento) {
                cantidadElemento.textContent = data.cantidad_actualizada;
            } else {
                console.error('Elemento de cantidad no encontrado');
            }
        }

        document.getElementById('total-carrito').textContent = data.total_clp;
        document.getElementById('total-carrito2').textContent = data.total_usd;

        actualizarContadorCarrito();
    })
    .catch(error => alert('Error: Producto con stock Limitado', error.message));
}

function restarCantidad(itemId, accion) {
    let cantidad = 0;

    if (accion === 'restar') {
        console.log(accion);
        cantidad = 1;
    }

    fetch(`/restar-cantidad/${itemId}/${cantidad}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Error al actualizar la cantidad del producto');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);

        if (data.cantidad_actualizada === 0) {
            const itemElement = document.getElementById(`item-${itemId}`);
            if (itemElement) {
                itemElement.remove();
            } else {
                console.error('Elemento de item no encontrado');
            }
        } else {
            let cantidadElemento = document.getElementById(`cantidad-${itemId}`);
            if (cantidadElemento) {
                cantidadElemento.textContent = data.cantidad_actualizada;
            } else {
                console.error('Elemento de cantidad no encontrado');
            }
        }

        const totalCarrito = document.getElementById('total-carrito');
        const totalCarrito2 = document.getElementById('total-carrito2');

        if (totalCarrito && totalCarrito2) {
            totalCarrito.textContent = data.total_clp;
            totalCarrito2.textContent = data.total_usd;
        } else {
            console.error('Elemento de total del carrito no encontrado');
        }

        actualizarContadorCarrito();
    })
    .catch(error => alert('Error: Producto con stock Limitado:', error.message));
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

