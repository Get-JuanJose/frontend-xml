document.addEventListener("DOMContentLoaded", () => {
  const productoForm = document.getElementById("productoForm");
  const eliminarForm = document.getElementById("eliminarForm");
  const xmlDisplay = document.getElementById("xmlDisplay");
  const xmlDisplay2 = document.getElementById("xmlDisplay2");
  // Cargar el XML inicialmente
  obtenerXML();
  cargarTabla();
  obtenerCargoXML();
  // agregarSelect();
});

  // Función para actualizar la visualización del XML
  
  function agregarSelect(xml) {
  // Buscar si el <select> ya existe en el DOM
  const selectExistente = document.getElementById("miSelect");
  if (selectExistente) {
    selectExistente.remove(); // Eliminar el <select> existente
  }
    const select = document.createElement("select");
    select.id = "miSelect"; // Puedes establecer un id si lo necesitas

    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");

    // Obtener los elementos 'empleado' del XML
    const empleados = doc.getElementsByTagName("empleado");

    for (let i = 0; i < empleados.length; i++) {
      empleado = empleados[i];
      const option = document.createElement("option");
      option.value = empleado.querySelector("idEmpleado").textContent;
      option.textContent = empleado.querySelector("idEmpleado").textContent;
      select.appendChild(option);
    }

    const option1 = document.createElement("option");

    option1.textContent = "NUEVO";
    option1.value = 0;
    select.appendChild(option1);

    const contenedor = document.getElementById("productoForm");


    //const cantidad = document.getElementById("numero");
    //cantidad.append(empleados.length);
  // Actualizar la cantidad de empleados
  const cantidad = document.getElementById("numero");
  if (cantidad) {
    cantidad.textContent = empleados.length; // Actualizar el número de empleados
  }
    // Agregar el <select> al DOM (por ejemplo, dentro de un div con id 'contenedor')

    contenedor.insertBefore(select, contenedor.firstChild.nextSibling);

  }

  function obtenerXML() {
    fetch("https://backend-xml.onrender.com")
      .then((response) => response.text())
      .then((xml) => {
        agregarSelect(xml);
        xmlDisplay.innerText = xml;
      })
      .catch((error) => console.error("Error al obtener XML:", error));
  }

  // Funcion para Obtener el arbol  XML
  function obtenerCargoXML() { 
    fetch("https://backend-xml.onrender.com")
      .then((response) => response.text())
      .then((xml) => {
        xmlDisplay2.innerText = xml;
      })
      .catch((error) => console.error("Error al obtener XML:", error));
  }


// Cargador de la tabla 
  function crearFila(empleado) {
    const fila = tablaEmpleados.insertRow();

    fila.insertCell().textContent = empleado.id;
    fila.insertCell().textContent = empleado.nombre;
    fila.insertCell().textContent = empleado.salario;
    fila.insertCell().textContent = empleado.cargo;
    const celdaBoton = fila.insertCell();
  }


function cargarTabla() {
  fetch("https://backend-xml.onrender.com")
    .then((response) => response.text())
    .then((xml) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, "text/xml");

      // Obtener los elementos 'empleado' del XML
      const empleados = doc.getElementsByTagName("empleado");

      // Referencia al contenedor de la tabla
      const tablaEmpleados = document.getElementById("tabla-empleados");

      // Limpiar el contenido actual de la tabla
      tablaEmpleados.innerHTML = '';

      // Crear la tabla y los encabezados
      const tabla = document.createElement("table");

tabla.classList.add("table", "table-striped", "table-bordered", "table-hover");
      const encabezado = tabla.createTHead();
      const filaEncabezado = encabezado.insertRow();
      ["ID", "Nombre", "Salario", "Cargo"].forEach((encabezado) => {
        const celda = document.createElement("th");
        celda.textContent = encabezado;
        filaEncabezado.appendChild(celda);
      });

      // Crear las filas de datos
      const cuerpoTabla = tabla.createTBody();
      for (let i = 0; i < empleados.length; i++) {
        const empleado = empleados[i];
        const fila = cuerpoTabla.insertRow();
        
        const id = empleado.querySelector("idEmpleado").textContent;
        const nombre = empleado.querySelector("nameEmpleado").textContent;
        const salario = empleado.querySelector("salarioEmpleado").textContent;
        const cargo = empleado.querySelector("cargoEmpleado").textContent;

        fila.insertCell().textContent = id;
        fila.insertCell().textContent = nombre;
        fila.insertCell().textContent = salario;
        fila.insertCell().textContent = cargo;
      }

      // Agregar la tabla actualizada al contenedor
      tablaEmpleados.appendChild(tabla);
    })
    .catch((error) => console.error("Error al obtener XML:", error));
}



  // Manejar el envío del formulario de producto
  
  productoForm.addEventListener("submit", (e) => {
     e.preventDefault();

    const id = document.getElementById("miSelect").value;
    const name = document.getElementById("nameEmpleado").value;
    const salary = document.getElementById("salarioEmpleado").value;
    const cargo = document.getElementById("cargoEmpleado").value;

    const data = JSON.stringify({ id: parseInt(id), name, salary: parseInt(salary), cargo })

    //alert(data)
    //alert(id)
    //alert(name)
    //alert(salary)
    //alert(cargo)
    const metodo = id != 0 ? "PUT" : "POST"; // PUT para actualizar, POST para agregar
    const endpoint =
      id != 0
        ? `https://backend-xml.onrender.com/{id}`
        : "https://backend-xml.onrender.com/";
        console.log(endpoint)


    fetch(endpoint, {
      method: metodo,
      headers: {
          'Content-Type': 'application/json',
      },
      body: data 
    })

    .then((response) => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        //return response.json(); // O response.text() si esperas texto plano
    })
    .then(() => {
        alert("¡Empleado guardado correctamente!");
        obtenerXML(); // Actualiza el XML mostrado
        obtenerCargoXML();
        cargarTabla();
        productoForm.reset(); // Limpia el formulario
    })
    //.catch((error) => 
    //    //console.error("Error al guardar el empleado:" + error);
    //    alert(`Error: ${error.message}`);
    //});

    //cargarTabla(); // Actualiza la tabla si es necesario
  });

  // Manejar el formulario de eliminación
  eliminarForm.addEventListener("submit", (e) => {
     e.preventDefault();

    const empleadoId = document.getElementById("eliminarId").value;

    fetch(`https://backend-xml.onrender.com/${empleadoId}`, {
      method: "DELETE",
    })
      .then((response) => response.text())
      .then(() => {
        alert("Empleado eliminado !");

        obtenerXML(); // Actualiza el XML mostrado
        obtenerCargoXML();
        cargarTabla();
        eliminarForm.reset();
      })
      .catch((error) => alert("Error al eliminar producto:"  + error));
  });

  



