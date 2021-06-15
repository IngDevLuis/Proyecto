import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  urlStorage
} from "../lib/storage.js";
import {
  cod,
  muestraError
} from "../lib/util.js";
import {
  tieneRol
} from "./seguridad.js";

/** @type {HTMLUListElement} */
const lista = document.
  querySelector("#lista");
const firestore = getFirestore();
const daoEquipos = firestore.
  collection("Equipos");

getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
    async function protege(usuario) {
      if (tieneRol(usuario,
        ["Cliente"] || ["Administrador"])) {
        consulta();
        }
    }

function consulta() {
  daoEquipos.
    orderBy("nombre")
    .onSnapshot(
      htmlLista, errConsulta);
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap */
async function htmlLista(snap) {
  let html = "";
  if (snap.size > 0) {
    /** @type {
          Promise<string>[]} */
    let usuarios = [];
    snap.forEach(doc => usuarios.
      push(htmlFila(doc)));
    const htmlFilas =
      await Promise.all(usuarios);
    /* Junta el todos los
     * elementos del arreglo en
     * una cadena. */
    html += htmlFilas.join("");
  } else {
    html += /* html */
      `<li class="vacio">
        -- No hay equipos
        registrados. --
      </li>`;
  }
  lista.innerHTML = html;
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
async function htmlFila(doc) {
  /**
   * @type {import("./tipos.js").
                      Tenis} */
  const data = doc.data();
  const nombre = cod(data.nombre);
  const pais = cod(data.pais);
  const campeonatos = cod(data.campeonatos);
  const img = cod(
    await urlStorage(nombre));
  const parámetros =
  new URLSearchParams();
  parámetros.append("id", doc.id);
  return (/* html */
    `<li>
      <a class="fila conImagen"
          href=
    "equipo.html?${parámetros}">
    
        <span class="texto">
           <img src="${img}"
            alt="Falta el Avatar">
            <strong
              class="primario">
            ${nombre}
          </strong>
          <span
          class="secundario">
          ${pais}<br>
          Campeonatos: ${campeonatos}
      </span>
        </span>
      </a>
    </li>`);
}


/** @param {Error} e */
function errConsulta(e) {
  muestraError(e);
  consulta();
}
