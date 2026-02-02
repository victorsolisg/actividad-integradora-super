// Organizador de Compras - JavaScript
// Victor Solis

// Aqui guardo todos los items
var listaItems = [];
var contadorId = 0;
var LLAVE = 'organizadorCompras'; // Para guardar en localStorage

// Agarro los elementos del HTML
var frm = document.getElementById('frm');
var txtNombre = document.getElementById('txtNombre');
var txtCantidad = document.getElementById('txtCantidad');
var aviso = document.getElementById('aviso');
var listado = document.getElementById('listado');
var numTotal = document.getElementById('numTotal');
var numListos = document.getElementById('numListos');
var numFaltan = document.getElementById('numFaltan');
var sinItems = document.getElementById('sinItems');

// Esta funcion crea un item nuevo con los datos
function crearItem(nombre, cantidad) {
    contadorId = contadorId + 1;
    var nuevoItem = {
        id: contadorId,
        nombre: nombre,
        cantidad: cantidad,
        listo: false
    };
    return nuevoItem;
}

// Limpio los errores visuales
function limpiarErrores() {
    aviso.textContent = '';
    aviso.style.color = '';
    txtNombre.style.border = '';
    txtCantidad.style.border = '';
}

// Muestro el mensaje de error
function mostrarAviso(texto, esError) {
    aviso.textContent = texto;
    if (esError) {
        aviso.style.color = '#d35f5f';
    } else {
        aviso.style.color = '#5a9a8a';
    }
}

// Valido el nombre en tiempo real
txtNombre.addEventListener('input', function() {
    var nombre = txtNombre.value.trim();

    if (nombre === '') {
        txtNombre.style.border = '2px solid #d35f5f';
        mostrarAviso('Debes escribir un nombre', true);
    } else if (nombre.length < 2) {
        txtNombre.style.border = '2px solid #d35f5f';
        mostrarAviso('El nombre debe tener al menos 2 caracteres', true);
    } else {
        txtNombre.style.border = '2px solid #5a9a8a';
        mostrarAviso('Nombre valido', false);
    }
});

// Valido la cantidad en tiempo real
txtCantidad.addEventListener('input', function() {
    var cantidad = txtCantidad.value;

    if (cantidad === '' || parseInt(cantidad) < 1) {
        txtCantidad.style.border = '2px solid #d35f5f';
        mostrarAviso('La cantidad debe ser mayor a cero', true);
    } else {
        txtCantidad.style.border = '2px solid #5a9a8a';
        mostrarAviso('Cantidad valida', false);
    }
});

// Reviso que los campos esten bien antes de enviar
function revisarCampos() {
    var nombre = txtNombre.value.trim();
    var cantidad = txtCantidad.value;

    // Si no escribio nada
    if (nombre === '') {
        txtNombre.style.border = '2px solid #d35f5f';
        txtNombre.focus();
        return 'Debes escribir un nombre';
    }

    // Si el nombre es muy corto
    if (nombre.length < 2) {
        txtNombre.style.border = '2px solid #d35f5f';
        txtNombre.focus();
        return 'El nombre debe tener al menos 2 caracteres';
    }

    // Si la cantidad no es valida
    if (cantidad === '' || parseInt(cantidad) < 1) {
        txtCantidad.style.border = '2px solid #d35f5f';
        txtCantidad.focus();
        return 'La cantidad debe ser mayor a cero';
    }

    return '';
}

// Cuento cuantos items hay y actualizo los numeros
function calcularNumeros() {
    var total = listaItems.length;
    var listos = 0;

    // Cuento los que estan listos
    for (var i = 0; i < listaItems.length; i++) {
        if (listaItems[i].listo === true) {
            listos = listos + 1;
        }
    }

    var faltan = total - listos;

    // Actualizo los numeros en pantalla
    numTotal.textContent = total;
    numListos.textContent = listos;
    numFaltan.textContent = faltan;

    // Muestro u oculto el mensaje de sin items
    if (total === 0) {
        sinItems.style.display = 'block';
    } else {
        sinItems.style.display = 'none';
    }
}

// Creo el elemento visual del item en la pagina
function dibujarItem(item) {
    // Creo el div principal
    var div = document.createElement('div');
    div.className = 'item';
    div.id = 'item-' + item.id;

    // Si ya esta listo le pongo la clase
    if (item.listo) {
        div.className = 'item listo';
    }

    // Creo la parte del texto
    var textoDiv = document.createElement('div');
    textoDiv.className = 'item-texto';
    textoDiv.innerHTML = item.nombre + ' <span>x' + item.cantidad + '</span>';

    // Cuando hago clic cambia el estado
    textoDiv.onclick = function() {
        cambiarEstado(item.id);
    };

    // Creo el boton de quitar
    var botonQuitar = document.createElement('button');
    botonQuitar.className = 'boton-quitar';
    botonQuitar.textContent = 'Quitar';

    // Cuando hago clic quita el item
    botonQuitar.onclick = function() {
        quitarItem(item.id);
    };

    // Junto todo y lo agrego al listado
    div.appendChild(textoDiv);
    div.appendChild(botonQuitar);
    listado.appendChild(div);
}

// Agrego un item nuevo a la lista
function agregarALista(nombre, cantidad) {
    var item = crearItem(nombre, cantidad);
    listaItems.push(item);
    dibujarItem(item);
    calcularNumeros();
    guardarDatos();
}

// Cambio si esta listo o no
function cambiarEstado(id) {
    for (var i = 0; i < listaItems.length; i++) {
        if (listaItems[i].id === id) {
            // Cambio el valor
            listaItems[i].listo = !listaItems[i].listo;

            // Cambio la clase en pantalla
            var elemento = document.getElementById('item-' + id);
            if (listaItems[i].listo) {
                elemento.className = 'item listo';
            } else {
                elemento.className = 'item';
            }

            break;
        }
    }
    calcularNumeros();
    guardarDatos();
}

// Quito un item de la lista
function quitarItem(id) {
    var nuevaLista = [];

    // Paso todos menos el que quiero quitar
    for (var i = 0; i < listaItems.length; i++) {
        if (listaItems[i].id !== id) {
            nuevaLista.push(listaItems[i]);
        }
    }

    listaItems = nuevaLista;

    // Lo quito de la pantalla
    var elemento = document.getElementById('item-' + id);
    elemento.remove();

    calcularNumeros();
    guardarDatos();
}

// Limpio los campos del formulario
function limpiarCampos() {
    txtNombre.value = '';
    txtCantidad.value = '';
    txtNombre.style.border = '';
    txtCantidad.style.border = '';
    txtNombre.focus();
    limpiarErrores();
}

// Guardo los datos en localStorage
function guardarDatos() {
    var texto = JSON.stringify(listaItems);
    localStorage.setItem(LLAVE, texto);
}

// Recupero los datos guardados
function recuperarDatos() {
    var texto = localStorage.getItem(LLAVE);

    // Si hay algo guardado lo cargo
    if (texto !== null) {
        var datos = JSON.parse(texto);

        for (var i = 0; i < datos.length; i++) {
            var item = datos[i];
            listaItems.push(item);
            dibujarItem(item);

            // Actualizo el contador para que no se repitan ids
            if (item.id > contadorId) {
                contadorId = item.id;
            }
        }
    }
}

// Cuando envian el formulario
frm.addEventListener('submit', function(evento) {
    evento.preventDefault();

    var error = revisarCampos();

    // Si hay error lo muestro
    if (error !== '') {
        mostrarAviso(error, true);
        return;
    }

    // Agarro los valores
    var nombre = txtNombre.value.trim();
    var cantidad = parseInt(txtCantidad.value);

    // Agrego y limpio
    agregarALista(nombre, cantidad);
    limpiarCampos();
    mostrarAviso('Producto agregado correctamente', false);
});

// Inicio la app
recuperarDatos();
calcularNumeros();
