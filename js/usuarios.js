import {
  getFirestore
} from "../lib/fabrica.js";
import {
  subeStorage
} from "../lib/storage.js";
import {
  cod, getForánea, muestraError
} from "../lib/util.js";
import {
  muestraUsuarios
} from "./navegacion.js";

const SIN_EQUIPO = /* html */
  `<option value="">
    -- Sin equipo favorito --
  </option>`;

const firestore = getFirestore();
const daoRol = firestore.
  collection("Rol");
const daoEquipos = firestore.
  collection("Equipos");
const daoUsuario = firestore.
  collection("Usuario");

/**
 * @param {
    HTMLSelectElement} select
 * @param {string} valor */
export function
selectEquipos(select,
    valor) {
  valor = valor || "";
  daoEquipos.
    orderBy("nombre").
    onSnapshot(
      snap => {
        let html = SIN_EQUIPO;
        snap.forEach(doc =>
          html += htmlEquipos(
            doc, valor));
        select.innerHTML = html;
      },
      e => {
        muestraError(e);
        selectEquipos(
          select, valor);
      }
    );
}

/**
 * @param {
  import("../lib/tiposFire.js").
  DocumentSnapshot} doc
 * @param {string} valor */
function
  htmlEquipos(doc, valor) {
  const selected =
    doc.id === valor ?
      "selected" : "";
  /**
   * @type {import("./tipos.js").
                  Equipos} */
  const data = doc.data();
  return (/* html */
    `<option
        value="${cod(doc.id)}"
        ${selected}>
      ${cod(data.nombre)}
    </option>`);
}

/**
 * @param {HTMLElement} elemento
 * @param {string[]} valor */
export function
  checksRoles(elemento, valor) {
  const set =
    new Set(valor || []);
  daoRol.onSnapshot(
    snap => {
      let html = "";
      if (snap.size > 0) {
        snap.forEach(doc =>
          html +=
          checkRol(doc, set));
      } else {
        html += /* html */
          `<li class="vacio">
              -- No hay roles
              registrados. --
            </li>`;
      }
      elemento.innerHTML = html;
    },
    e => {
      muestraError(e);
      checksRoles(
        elemento, valor);
    }
  );
}

/**
 * @param {
    import("../lib/tiposFire.js").
    DocumentSnapshot} doc
 * @param {Set<string>} set */
export function
  checkRol(doc, set) {
  /**
   * @type {
      import("./tipos.js").Rol} */
  const data = doc.data();
  const checked =
    set.has(doc.id) ?
      "checked" : "";
  return (/* html */
    `<li>
      <label class="fila">
        <input type="checkbox"
            name="rolIds"
            value="${cod(doc.id)}"
          ${checked}>
        <span class="texto">
          <strong
              class="primario">
            ${cod(doc.id)}
          </strong>
          <span
              class="secundario">
          ${cod(data.descripción)}
          </span>
        </span>
      </label>
    </li>`);
}

/**
 * @param {Event} evt
 * @param {FormData} formData
 * @param {string} id  */
export async function
  guardaUsuario(evt, formData,
    id) {
  try {
    evt.preventDefault();
    const equiposId =
      getForánea(formData,
        "equiposId");
    const rolIds =
      formData.getAll("rolIds");
    await daoUsuario.
      doc(id).
      set({
        equiposId,
        rolIds
      });
    const avatar =
      formData.get("avatar");
    await subeStorage(id, avatar);
    muestraUsuarios();
  } catch (e) {
    muestraError(e);
  }
}

