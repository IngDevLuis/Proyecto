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
  muestraTenis
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";
import {
  guardaTenis
} from "./teniss.js";

const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
const daoTenis = getFirestore().
  collection("Tenis");
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
    const doc = await daoTenis.
      doc(id).
      get();
    if (doc.exists) {
      const data = doc.data();
      const modelo = cod(data.modelo);
      forma.marca.value =
        data.marca || "";
      forma.modelo.value =
        data.modelo || "";
      forma.lkcompra.value =
        data.lkcompra || "";
      img.src =
        await urlStorage(modelo);
        forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    }
  } catch (e) {
    muestraError(e);
    muestraTenis();
  }
}


/** 
 * @param {Event} evt */
 async function guarda(evt) {
  evt.preventDefault();
  const formData =
    new FormData(forma);
  const id = getString(
    formData, "modelo").trim();

  await guardaTenis(evt,
   formData, id);
}


async function elimina() {
  try {
    const formData =
    new FormData(forma);
  const modelo = getString(
    formData, "modelo").trim();
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoTenis.
        doc(id).
        delete();
      await eliminaStorage(modelo);
      muestraTenis();
    }
  } catch (e) {
    muestraError(e);
  }
}
