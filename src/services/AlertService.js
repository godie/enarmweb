// src/services/AlertService.js
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css'

export function alertSuccess(title, text) {
  return Swal.fire({ icon: 'success', title, text });
}

export function alertError(title, text) {
  return Swal.fire({ icon: 'error', title, text });
}

export function alertInfo(title, text) {
  return Swal.fire({ icon: 'info', title, text });
}

export function alertConfirm(title, text, callback) {
  Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4caf50',
    cancelButtonColor: '#f44336',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed && callback) {
      callback();
    }
  });
}

export async function confirmDialog(title, text) {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4caf50',
    cancelButtonColor: '#f44336',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  });
  return result.isConfirmed;
}
