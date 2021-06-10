import {
  getAuth
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  tieneRol
} from "./seguridad.js";
import {
  guardaTenis
} from "./teniss.js";


/** @type {HTMLFormElement} */
const forma = document["forma"];
getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    forma.addEventListener(
      "submit", guarda);
  }
}

/** 
 * @param {Event} evt */
async function guarda(evt) {
  const formData =
    new FormData(forma);
  const id = getString(
    formData, "modelo").trim();

  await guardaTenis(evt,
   formData, id);
}
