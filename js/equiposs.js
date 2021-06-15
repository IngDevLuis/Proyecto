import {
  getFirestore
} from "../lib/fabrica.js";
import {
  subeStorage
} from "../lib/storage.js";
import {
  muestraError
} from "../lib/util.js";
import {
  muestraEquipos
} from "./navegacion.js";


const firestore = getFirestore();
const daoEquipos = firestore.
  collection("Equipos");

/**
 * @param {Event} evt
 * @param {FormData} formData
 * @param {string} id  */
export async function
guardaEquipos(evt, formData,
    id) {
  try {
    evt.preventDefault();
  const nombre = 
    formData.get("nombre");
  const pais = 
    formData.get("pais");
  const campeonatos = 
    formData.get("campeonatos");
  
    const modeloo = {
      nombre,pais,campeonatos
    };
    await daoEquipos.
    doc(id).
    set(modeloo);
    
  const avatar =
    formData.get("avatar");
    await subeStorage(id, avatar);
    muestraEquipos();
  } catch (e) {
    muestraError(e);
  }
}  
  
