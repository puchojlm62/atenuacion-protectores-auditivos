function calcularTodoSNR() {
    let dbC = parseFloat(document.querySelector("#dbC input").value) || null;
    let SNR = parseFloat(document.querySelector("#filaSNR input").value) || null;

    if ([dbC, SNR].includes(null)) {
        alert("Por favor, ingrese todos los valores antes de calcular.");
        return;
    }

    //calculo de la atenuaciòn por una simple resta

    let dbA_protegido = dbC - SNR;
    if (document.querySelector("#cbox3").checked) {
        dbA_protegido += 4;
    }

    const dbA_protegido_fixed = dbA_protegido.toFixed(1);
    document.querySelector("#filaRuidoAtenuadoSNR input").value = dbA_protegido_fixed;

    let indiceProteccion;
    let indiceProteccionColor;
    if (dbA_protegido < 70.0) {
        indiceProteccion = "SOBREPROTEGIDO";
        indiceProteccionColor = "orange";
    } else if (dbA_protegido < 80.0) {
        indiceProteccion = "BUENA";
        indiceProteccionColor = "lightgreen";
    } else if (dbA_protegido > 85.0) {
        indiceProteccion = "INSUFICIENTE";
        indiceProteccionColor = "red";
    } else {
        indiceProteccion = "ACEPTABLE";
        indiceProteccionColor = "lightyellow";
    }

    document.getElementById("indice-proteccionSNR").style.color = "black";
    document.getElementById("indice-proteccionSNR").textContent = indiceProteccion;
    document.getElementById("indice-proteccionSNR").style.backgroundColor = indiceProteccionColor;

    // Guardar los resultados del cálculo.
    sessionStorage.setItem("dbA_protegido", dbA_protegido_fixed);
    sessionStorage.setItem("indiceProteccion", indiceProteccion);
    sessionStorage.setItem("indiceProteccionColor", indiceProteccionColor);
}

function borrarTodoSNR() { // Renamed to borrarTodoSNR()
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    });
    document.querySelector("#cbox3").checked = false;
    document.getElementById("indice-proteccionSNR").textContent = "";
    document.getElementById("indice-proteccionSNR").style.backgroundColor = "transparent";

    // Limpiar sessionStorage
    sessionStorage.removeItem("protectorAuditivo");
    sessionStorage.removeItem("SNR");
    sessionStorage.removeItem("lugarRuido");
    sessionStorage.removeItem("dbC");
    sessionStorage.removeItem("cbox3");
    sessionStorage.removeItem("dbA_protegido");
    sessionStorage.removeItem("indiceProteccion");
    sessionStorage.removeItem("indiceProteccionColor"); // Remove the color
}

const checkbox = document.getElementById("cbox3");

checkbox.addEventListener('change', function () {
    calcularTodoSNR(); // Correct function name
    saveAllData();
});


// Guardar los datos en sessionStorage
function saveAllData() {
    sessionStorage.setItem("protectorAuditivo", document.getElementById("protector-auditivo").value);
    sessionStorage.setItem("SNR", document.querySelector("#filaSNR input").value);
    sessionStorage.setItem("lugarRuido", document.getElementById("ruido").value);
    sessionStorage.setItem("dbC", document.querySelector("#dbC input").value);
    sessionStorage.setItem("cbox3", document.querySelector("#cbox3").checked);
}

// Agregar event listeners a los inputs
document.getElementById("protector-auditivo").addEventListener("input", saveAllData);
document.querySelector("#filaSNR input").addEventListener("input", saveAllData);
document.getElementById("ruido").addEventListener("input", saveAllData);
document.querySelector("#dbC input").addEventListener("input", saveAllData);

// Cargar los valores de sessionStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("protector-auditivo").value = sessionStorage.getItem("protectorAuditivo") || "";
    document.querySelector("#filaSNR input").value = sessionStorage.getItem("SNR") || "";
    document.getElementById("ruido").value = sessionStorage.getItem("lugarRuido") || "";
    document.querySelector("#dbC input").value = sessionStorage.getItem("dbC") || "";
    document.getElementById("cbox3").checked = sessionStorage.getItem("cbox3") === "true";

    document.querySelector("#filaRuidoAtenuadoSNR input").value = sessionStorage.getItem("dbA_protegido") || "";
    document.getElementById("indice-proteccionSNR").textContent = sessionStorage.getItem("indiceProteccion") || "";
    document.getElementById("indice-proteccionSNR").style.backgroundColor = sessionStorage.getItem("indiceProteccionColor") || "transparent";
});