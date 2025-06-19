// src/services/AlertService.js
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css'

export function alertSuccess(title, text) {
  return Swal.fire({ type: 'success', title, text });
}

export function alertError(title, text) {
  return Swal.fire({ type: 'error', title, text });
}
