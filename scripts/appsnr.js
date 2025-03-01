function calcularTodoSNR() {
    let dbC = parseFloat(document.querySelector("#dbC_snr input").value) || null; 
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
    sessionStorage.setItem("snr_dbA_protegido", dbA_protegido_fixed); // Clave sessionStorage específica de SNR
    sessionStorage.setItem("snr_indiceProteccion", indiceProteccion); // Clave sessionStorage específica de SNR
    sessionStorage.setItem("snr_indiceProteccionColor", indiceProteccionColor); // Clave sessionStorage específica de SNR
}

function borrarTodoSNR() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    });
    document.querySelector("#cbox3").checked = false;
    document.getElementById("indice-proteccionSNR").textContent = "";
    document.getElementById("indice-proteccionSNR").style.backgroundColor = "transparent";

    // Limpiar sessionStorage (claves sessionStorage específicas de SNR)
    sessionStorage.removeItem("snr_protectorAuditivo");
    sessionStorage.removeItem("snr_SNR");
    sessionStorage.removeItem("snr_lugarRuido");
    sessionStorage.removeItem("snr_dbC");
    sessionStorage.removeItem("snr_cbox3");
    sessionStorage.removeItem("snr_dbA_protegido");
    sessionStorage.removeItem("snr_indiceProteccion");
    sessionStorage.removeItem("snr_indiceProteccionColor"); // Remove the color
}

const checkbox = document.getElementById("cbox3");

checkbox.addEventListener('change', function () {
    calcularTodoSNR();
    saveAllDataSNR(); // Usar saveAllDataSNR() para guardar con claves específicas de SNR
});


// Guardar los datos en sessionStorage (claves sessionStorage específicas de SNR)
function saveAllDataSNR() {
    sessionStorage.setItem("snr_protectorAuditivo", document.getElementById("protector-auditivo").value); // Clave sessionStorage específica de SNR
    sessionStorage.setItem("snr_SNR", document.querySelector("#filaSNR input").value); // Clave sessionStorage específica de SNR
    sessionStorage.setItem("snr_lugarRuido", document.getElementById("ruido").value); // Clave sessionStorage específica de SNR
    sessionStorage.setItem("snr_dbC", document.querySelector("#dbC_snr input").value); // Clave sessionStorage específica de SNR - ID CORREGIDO: dbC_snr
    sessionStorage.setItem("snr_cbox3", document.querySelector("#cbox3").checked); // Clave sessionStorage específica de SNR
}

// Agregar event listeners a los inputs
document.getElementById("protector-auditivo").addEventListener("input", saveAllDataSNR); // Usar saveAllDataSNR()
document.querySelector("#filaSNR input").addEventListener("input", saveAllDataSNR); // Usar saveAllDataSNR()
document.getElementById("ruido").addEventListener("input", saveAllDataSNR); // Usar saveAllDataSNR()
document.querySelector("#dbC_snr input").addEventListener("input", saveAllDataSNR); // Usar saveAllDataSNR() - ID CORREGIDO: dbC_snr

// Cargar los valores de sessionStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("protector-auditivo").value = sessionStorage.getItem("snr_protectorAuditivo") || ""; // Clave sessionStorage específica de SNR
    document.querySelector("#filaSNR input").value = sessionStorage.getItem("snr_SNR") || ""; // Clave sessionStorage específica de SNR
    document.getElementById("ruido").value = sessionStorage.getItem("snr_lugarRuido") || ""; // Clave sessionStorage específica de SNR
    document.querySelector("#dbC_snr input").value = sessionStorage.getItem("snr_dbC") || ""; // Clave sessionStorage específica de SNR - ID CORREGIDO: dbC_snr
    document.getElementById("cbox3").checked = sessionStorage.getItem("snr_cbox3") === "true"; // Clave sessionStorage específica de SNR

    document.querySelector("#filaRuidoAtenuadoSNR input").value = sessionStorage.getItem("snr_dbA_protegido") || ""; // Clave sessionStorage específica de SNR
    document.getElementById("indice-proteccionSNR").textContent = sessionStorage.getItem("snr_indiceProteccion") || ""; // Clave sessionStorage específica de SNR
    document.getElementById("indice-proteccionSNR").style.backgroundColor = sessionStorage.getItem("snr_indiceProteccionColor") || "transparent"; // Clave sessionStorage específica de SNR
});