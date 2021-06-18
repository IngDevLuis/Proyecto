import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  eliminaStorage,
  urlStorage
} from "../lib/storage.js";
import {
  cod,
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraEquipos
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";
import {
  guardaEquipos
} from "./guardaEquipos.js";

const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
const daoEquipos = getFirestore().
  collection("Equipos");
/** @type {HTMLFormElement} */
const forma = document["forma"];
const img = document.
  querySelector("img");
/** @type {HTMLUListElement} */
getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Cliente"] || ["Administrador"])) {
    busca();
  }
}

async function busca() {
  try {
    const doc = await daoEquipos.
      doc(id).
      get();
    if (doc.exists) {
      const data = doc.data();
      const nombre = cod(data.nombre);
      forma.nombre.value =
        data.nombre || "";
      forma.pais.value =
        data.pais || "";
      forma.campeonatos.value =
        data.campeonatos || "";
      img.src =
        await urlStorage(nombre);
        forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    }
  } catch (e) {
    muestraError(e);
    muestraEquipos();
  }
}


/** 
 * @param {Event} evt */
 async function guarda(evt) {
  evt.preventDefault();
  const formData =
    new FormData(forma);
  const id = getString(
    formData, "nombre").trim();

  await guardaEquipos(evt,
   formData, id);
}


async function elimina() {
  try {
    const formData =
    new FormData(forma);
  const nombre = getString(
    formData, "nombre").trim();
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoEquipos.
        doc(id).
        delete();
      await eliminaStorage(nombre);
      muestraEquipos();
    }
  } catch (e) {
    muestraError(e);
  }
}
