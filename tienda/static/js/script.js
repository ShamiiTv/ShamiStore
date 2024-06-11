document.addEventListener("DOMContentLoaded", function () {
    var nombreInput = document.getElementById("nombre");
    var emailInput = document.getElementById("email");
    var celularInput = document.getElementById("celular");
    var asuntoSelect = document.getElementById("asunto");
    var mensajeTextarea = document.getElementById("mensaje");
    var enviarBtn = document.getElementById("enviarBtn");

    nombreInput.addEventListener("input", function () {
        validarNombre();
    });

    emailInput.addEventListener("input", function () {
        validarEmail();
    });

    celularInput.addEventListener("input", function () {
        validarCelular();
    });

    asuntoSelect.addEventListener("change", function () {
        validarAsunto();
    });

    mensajeTextarea.addEventListener("input", function () {
        validarMensaje();
    });

    enviarBtn.addEventListener("click", function () {
        validarFormulario();
    });

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
            mostrarProductosCarrito();
        })
        .catch(function(error) {
            console.log('Error en la solicitud:', error);
        });
}

function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let contador = document.querySelector('.carro span');

    if (contador) {
        contador.textContent = carrito.length;
    } else {
        document.querySelector('.carro').innerHTML += `<span class="badge bg-primary">${carrito.length}</span>`;
    }
}

actualizarContadorCarrito();

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

document.getElementById("volverArriba").addEventListener("click", function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

function agregarAlCarrito(id,nombre, precio,precioDolar, imagen) {
    $('#exampleModal').modal('show');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let productoExistente = carrito.find(producto => producto.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    } else {
        carrito.push({ id: id, nombre: nombre, precio: precio, precioDolar: precioDolar, imagen: imagen, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarProductosCarrito();
}

window.onload = function() {
    valorDolar();
};

function mostrarProductosCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let listaProductos = document.getElementById('lista-productos');
    let totalCarritoCLP = document.getElementById('total-carrito');
    let totalCarritoUSD = document.getElementById('total-carrito2');
    let totalCLP = 0;
    let totalUSD = 0;

    listaProductos.innerHTML = '';

    carrito.forEach(function(producto, index) {
        producto.cantidad = producto.cantidad || 1;

        let divProducto = document.createElement('div');
        divProducto.classList.add('product');
        console.log(producto);

        // Formatear el precio en CLP
        let precioCLPFormateado = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(producto.precio);
        
        divProducto.innerHTML = `
    <img src="/static/${producto.imagen}" alt="${producto.imagen}">
    <div class="product-details">
        <h6>ID Producto : ${producto.id}</h6>
        <h2>${producto.nombre}</h2>
        <p>Precio: ${precioCLPFormateado}</p>
        <p>Precio USD: ${producto.precioDolar}</p>
        <p>Cantidad: ${producto.cantidad}</p>
        <button onclick="eliminarProducto(${index})" class="btn btn-danger">Eliminar</button>
        <button onclick="aumentarCantidad(${index})" class="btn btn-primary">+</button>
        <button onclick="disminuirCantidad(${index})" class="btn btn-primary">-</button>
    </div>
`;
        listaProductos.appendChild(divProducto);

        // Calcular y sumar el total en CLP y USD
        totalCLP += producto.precio * producto.cantidad;
        totalUSD += producto.precioDolar * producto.cantidad;
    });
    
    // Mostrar el total del carrito en CLP y USD
    totalCarritoCLP.textContent = "Total CLP: " + new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalCLP);
    totalCarritoUSD.textContent = "Total USD: " + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalUSD);
}

function eliminarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarProductosCarrito();
    actualizarContadorCarrito();
}

function aumentarCantidad(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let encontrado = false;
    carrito.forEach(function(producto) {
        if (producto.nombre === carrito[index].nombre) {
            producto.cantidad = (producto.cantidad || 1) + 1;
            encontrado = true;
        }
    });
    if (!encontrado) {
        carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarProductosCarrito();
}

function disminuirCantidad(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarProductosCarrito();
    }
}

function limpiarCarrito() {      
    localStorage.removeItem('carrito');
    mostrarProductosCarrito();
    actualizarContadorCarrito();
}

document.querySelector('.limpiar-carrito').addEventListener('click', limpiarCarrito);
