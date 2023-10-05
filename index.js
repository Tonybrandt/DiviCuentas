// Capturando elementos del DOM / capturing DOM elements

const form = document.querySelector("form");
const sectionForm = document.querySelector(".app");
const input = document.querySelectorAll(".input").values;
const message = document.querySelector("#message");

// Detener el envío de info del formulario normal para que no recargue la página y obtener los datos del usuario.
form.addEventListener("submit", (e) => {
  let personas = document.querySelector("#personas").value;

  if (personas == null || personas < 2 || personas >= 11 || isNaN(personas)) {
    message.textContent = `Ingresar números. Min: 2, Máx: 10`;
    message.style = "display: block";
    message.style = "color: red";
    message.setAttribute("class", "span");
    e.preventDefault();
  } else {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    // console.log(JSON.stringify(data));

    const numeroPersonas = data.numPersonas; // Número de personas en el evento
    const evento = data.evento; // Nombre del evento

    sectionForm.innerHTML = "";

    let newFormDiv = document.createElement("div");
    newFormDiv.setAttribute("id", "info");
    newFormDiv.className = "formContainer";
    const showcase = document.createElement("div");
    showcase.setAttribute("class", "showcase");
    showcase.innerHTML = `<h2 class="title_app">${evento}</h2>
    <hr class="hr">
    <p class="copy_showcase">Compartir con:</p>
    <h2 class="title_app_info">${numeroPersonas}</h2>
    `;

    // Creo el nuevo formulario con inputs dinámicos.
    let newForm = document.createElement("form");
    newForm.className = "form";

    for (let i = 1; i <= numeroPersonas; i++) {
      const inputParticipante = document.createElement("input");
      inputParticipante.className = "input";
      inputParticipante.setAttribute("type", "text");
      inputParticipante.setAttribute("name", `participante${i}`);
      inputParticipante.setAttribute("id", "participante");
      inputParticipante.setAttribute("required", "required");
      inputParticipante.setAttribute("maxlength", "20");
      inputParticipante.setAttribute(
        "placeholder",
        `Nombre del participante ${i}`
      );

      const gastoParticipante = document.createElement("input");
      gastoParticipante.className = "input";
      gastoParticipante.setAttribute("type", "number");
      gastoParticipante.setAttribute("name", `gastoParticipante${i}`);
      gastoParticipante.setAttribute("id", "gastoParticipante");
      gastoParticipante.setAttribute("required", "required");
      gastoParticipante.setAttribute(
        "placeholder",
        `Gasto del participante ${i}`
      );
      newForm.append(inputParticipante, gastoParticipante);
    }

    let btnSubmit = document.createElement("input");
    btnSubmit.className = "input_submit";
    btnSubmit.setAttribute("id", "submit");
    btnSubmit.setAttribute("type", "submit");
    btnSubmit.setAttribute("value", "Continuar");

    sectionForm.append(showcase, newFormDiv);
    newFormDiv.append(newForm);
    newForm.appendChild(btnSubmit);

    // De nuevo capturando el evento y evitando el envío del formulario. Capturando la info ingresada por el usuario
    newForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const participant = Object.fromEntries(new FormData(e.target));
      JSON.stringify(participant);
      // console.log(participant);

      const participantesIndividuales = [];
      let gastoIndividual = [];

      for (let i = 1; i <= numeroPersonas; i++) {
        const info = Object.entries(participant);
        info.forEach(([key, value]) => {
          if (key == `gastoParticipante${[i]}`) {
            gastoIndividual.push(parseFloat(value));
          }
          if (key == `participante${[i]}`) {
            participantesIndividuales.push(value);
          }
        });
      }
      
      gastoIndividual.forEach((value) => {
        if (value == null || value < 0 || value > 100000 || isNaN(value)) {
          newFormDiv.append(message);
          message.style = "display: block";
          message.textContent = `Ingresar números. Min: 0, Máx: 100.000`;
          message.style = "color: red";
          message.setAttribute("class", "spane");
          e.preventDefault();
          console.log("algo salio mal");
        }
      });

      message.removeAttribute("class", "spane");
      let suma = 0;

      for (let i = 0; i < gastoIndividual.length; i++) {
        suma += gastoIndividual[i];
      }

      // Calculo de lo que debería pagar cada participante
      let pagoParticipante = suma / numeroPersonas;

      // Calculo de las contribuciones ajustado al gasto total
      const contribucionesIndividuales = participantesIndividuales.map(
        (parti, index) => {
          const gastadoIndividual = gastoIndividual[index];
          return pagoParticipante - gastadoIndividual;
        }
      );

      showcase.innerHTML = `<h2 class="title_app">${evento}</h2>
          <hr class="hr">
          <p class="copy_showcase">Compartir con:</p>
          <h2 class="title_app_info">${numeroPersonas}</h2>
          <p class="copy_showcase">El total es:</p>
          <h2 class="title_app_info">$${suma}</h2>            
          <p class="copy_showcase">Cada uno debería pagar:</p>
          <h2 class="title_app_info">$${pagoParticipante.toFixed(2)}</h2>
          `;

      let respuesta;
      
      // Comparar saldos y mostrar quien debe devolver dinero, quien debe pagar y si están a mano.
      const respuestas = [];

      contribucionesIndividuales.forEach((contribucion, indexa) => {
        participantesIndividuales.forEach((persona, index) => {
        
          if (index == indexa) {
            if (contribucion > 0) {
              respuesta = `Participante ${persona} debe pagar: ${contribucion.toFixed(2)}💸`;
            } else if (contribucion === 0) {
              respuesta = `Participante ${persona} está a mano y no debe nada 👌`;
            } else {
              respuesta = `A participante ${persona} le deben: ${contribucion.toFixed(2) * (-1)}📉`;
            }
          }
        });
        respuestas.push(respuesta);
      });

      for (i = 0; i < respuestas.length; i++) {
        const resp = document.createElement("h4");
        resp.className = "info_app";
        resp.innerHTML = respuestas[i];
        sectionForm.append(resp);
      }

      newForm.removeChild(btnSubmit);
      newFormDiv.remove(newForm)
    });
  }
});

