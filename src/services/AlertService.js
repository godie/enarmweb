// src/services/AlertService.js
import Swal from 'sweetalert2';

export function alertSuccess(title, text) {
  return Swal.fire({ type: 'success', title, text });
}

export function alertError(title, text) {
  return Swal.fire({ type: 'error', title, text });
}
