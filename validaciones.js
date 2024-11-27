document.addEventListener('DOMContentLoaded', function () {
  document.querySelector("#reservas-form").addEventListener("submit", function (event) {
    event.preventDefault();

    let errores = [];


    const nombre = document.getElementById("nombre").value.trim();
    if (!nombre) {
      errores.push("El nombre no puede estar vacío.");
    } else if (!/^[a-zA-Z\s]+$/.test(nombre)) {
      errores.push("El nombre debe contener solo letras.");
    }

    const edad = document.getElementById("edad").value.trim();
    if (!edad) {
      errores.push("La edad no puede estar vacía.");
    } else if (isNaN(edad) || parseInt(edad) < 18) {
      errores.push("La edad debe ser igual o mayor a 18.");
    }

    const direccion = document.getElementById("direccion").value.trim();
    if (!direccion) {
      errores.push("La dirección no puede estar vacía.");
    }

    const sexoSeleccionado = document.querySelector("input[name='sexo']:checked");
    if (!sexoSeleccionado) {
      errores.push("Debe seleccionar un sexo.");
    }

    const peliculasSeleccionadas = document.querySelectorAll("input[type='checkbox']:checked");
    if (peliculasSeleccionadas.length < 1) {
      errores.push("Debe seleccionar al menos una película.");
    } else if (peliculasSeleccionadas.length > 3) {
      errores.push("Solo puede seleccionar hasta tres películas.");
    }

    if (errores.length > 0) {
      console.log("Errores:", errores);
      Swal.fire({
        icon: "error",
        title: "Error...",
        text:"Errores:\n " + errores.join("\n "),
      });

      
    } else {
      // enivar formulario php
      console.log("No hay errores, enviando formulario...");
      const formData = new FormData(this);
      fetch('./procesar_formulario.php', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json().catch(error => {
          throw new Error('Invalid JSON: ' + error.message);
        });
      })
      .then(data => {
        console.log('Response data:', data);
        if (data.success) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Guardado correctamente"
          });
          this.reset();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Algo salio mal!",
            data: data.message
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: "Algo salio mal!",
          data: data.message
        });
      });
    }
  });
});
