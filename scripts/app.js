function calcularProteccionSupuesta() {
    let atenuacionMediaInputs = Array.from(document.querySelectorAll("#filaAtenuacion input"));
    let desviacionStandardInputs = Array.from(document.querySelectorAll("#filaDesviacion input"));
    let proteccionSupuestaInputs = Array.from(document.querySelectorAll("#filaProteccion input"));

    let datosCompletos = true; // Variable para controlar si faltan datos

    for (let i = 0; i < atenuacionMediaInputs.length; i++) {
        // Ignorar la primera columna (índice 0)
        if (i === 0) continue;

        let valorAtenuacion = atenuacionMediaInputs[i].value.trim();
        let valorDesviacion = desviacionStandardInputs[i].value.trim();

        if (valorAtenuacion === "" || valorDesviacion === "") {
            datosCompletos = false; // Faltan datos
            break; // Salir del bucle, no es necesario seguir revisando
        }
    }

    if (!datosCompletos) {
        alert("Por favor, llene todos los datos. La columna de la frecuencia 63 Hz es optativa.");
        // Puedes opcionalmente limpiar los campos o enfocarlos para que el usuario los complete.
        return; // Detener la ejecución de la función
    }

    // Si todos los datos están completos, continuar con el cálculo
    for (let i = 0; i < atenuacionMediaInputs.length; i++) {
        let valorAtenuacion = atenuacionMediaInputs[i].value.trim();
        let valorDesviacion = desviacionStandardInputs[i].value.trim();

        if (valorAtenuacion === "" || valorDesviacion === "") {
            proteccionSupuestaInputs[i].value = "";
        } else {
            proteccionSupuestaInputs[i].value = (parseFloat(valorAtenuacion) - parseFloat(valorDesviacion)).toFixed(1);
        }
    }

    let espectroMedidoInputs = Array.from(document.querySelectorAll("#filaEspectroMedido input"));
    let espectroProtegidoInputs = Array.from(document.querySelectorAll("#filaEspectroProtegido input"));

    for (let i = 0; i < espectroMedidoInputs.length; i++) {
        let valorMedido = espectroMedidoInputs[i].value.trim();
        let valorSupuesta = proteccionSupuestaInputs[i].value.trim();

        if (valorMedido === "" || valorSupuesta === "") {
            espectroProtegidoInputs[i].value = "";
        } else {
            espectroProtegidoInputs[i].value = (parseFloat(valorMedido) - parseFloat(valorSupuesta)).toFixed(1);
        }
    }

    return espectroProtegidoInputs;
}

function calcularEspectro(filaId) { // Función genérica para calcular espectro
    let ponderacionA = [-26.0, -16.0, -9.0, -3.0, 0, 1.0, 1.0, -1.0];
    let lA = [];
    let espectroInputs = Array.from(document.querySelectorAll(`#${filaId} input`));

    for (let i = 0; i < espectroInputs.length; i++) {
        let valorMedido = espectroInputs[i].value.trim();

        if (valorMedido === "" || isNaN(parseFloat(valorMedido))) {
            console.error(`Valor no numérico o vacío en #${filaId}:`, valorMedido);
            continue;
        }

        lA.push(parseFloat(valorMedido) + ponderacionA[i]);
    }

    return lA;
}



function calcularLeq(listaDecibelios) {
    let sumaPotencia = 0;

    for (let i = 0; i < listaDecibelios.length; i++) {
        let decibelio = listaDecibelios[i];
        let potencia = Math.pow(10, decibelio / 10);
        sumaPotencia += potencia;
    }

    let leq = 10 * Math.log10(sumaPotencia);
    return leq;
}

function calcularTodo() {
    calcularProteccionSupuesta();

    let lAMedido = calcularEspectro("filaEspectroMedido");
    let lAAtenuado = calcularEspectro("filaEspectroProtegido");
    let indiceProteccion ="";

    console.log("Valores de lA (medido):", lAMedido);
    console.log("Valores de lA (atenuado):", lAAtenuado);

    let leqMedido = calcularLeq(lAMedido);
    let leqAtenuado = calcularLeq(lAAtenuado);

    // Obtener el estado del checkbox
    const checkbox = document.getElementById("cbox2");
    const sumar4 = checkbox.checked;
    
    // Sumar 4 dB si el checkbox está marcado
    if (sumar4) {
        leqAtenuado += 4;
    }

    console.log("Leq medido:", leqMedido);
    console.log("Leq atenuado:", leqAtenuado);

    // Mostrar resultados en los inputs readonly
    document.querySelector("#filaRuidoMedido .leq-resultado input").value = leqMedido.toFixed(1);
    document.querySelector("#filaRuidoAtenuado .leq-resultado input").value = leqAtenuado.toFixed(1);

    //Determinacion del indice
    if (leqAtenuado < 70.0) {
        indiceProteccion = "SOBREPROTEGIDO";
        document.getElementById("indice-proteccion").style.backgroundColor = "orange"; // Naranja para sobreprotegido
    } else if (leqAtenuado < 80.0) {
        indiceProteccion = "BUENA";
        document.getElementById("indice-proteccion").style.backgroundColor = "lightgreen"; // Verde para buena
    } else if (leqAtenuado > 85.0) {
        indiceProteccion = "INSUFICIENTE";
        document.getElementById("indice-proteccion").style.backgroundColor = "red"; // Rojo para insuficiente
    } else {
        indiceProteccion = "ACEPTABLE";
        document.getElementById("indice-proteccion").style.backgroundColor = "lightyellow"; // Verde claro para aceptable
    }
    
    // El color de la letra se fija en negro para todos los casos
    document.getElementById("indice-proteccion").style.color = "black";
    
    // Expresión del resultado (sin cambios)
    console.log(indiceProteccion);
    document.getElementById("indice-proteccion").textContent = indiceProteccion;
}

function borrarTodo() {
    const inputs = document.querySelectorAll('input'); // Selecciona todos los inputs
    inputs.forEach(input => {
      input.value = ''; // Borra el valor de cada input
    });
  }

  // Obtener el checkbox y agregar el evento 'change'
const checkbox = document.getElementById("cbox2");

checkbox.addEventListener('change', function() {
    // Verificar si ya existen resultados (puedes ajustar esta condición según tu lógica)
    const resultadosExisten = document.querySelector("#filaRuidoAtenuado .leq-resultado input").value !== ""; // Ejemplo

    if (resultadosExisten) {
        calcularTodo(); // Recalcular si ya hay resultados
    }
});

