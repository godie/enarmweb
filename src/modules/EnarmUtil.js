class EnarmUtil {
  static CATEGORIES_KEY = "categories";
  static CURRENT_CLINIC_CASE = "currentcc";

  static isEmpty(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
  }
  static isUndefined(obj) {
    return obj === undefined;
  }
  static getCategory(props) {
    var clinicCaseId = EnarmUtil.getCurrent() || 1;
    if (props && props.match && !EnarmUtil.isEmpty(props.match.params)) {
      if (!isNaN(parseInt(props.match.params.identificador))) {
        clinicCaseId = props.match.params.identificador;
      }
    }
    EnarmUtil.saveCurrent(clinicCaseId);
    return parseInt(clinicCaseId);
  }

  static getCategories() {
    return localStorage.getItem(EnarmUtil.CATEGORIES_KEY);
  }

  static clearCategories() {
    localStorage.removeItem(EnarmUtil.CATEGORIES_KEY);
  }

  static setCategories(categories) {
    localStorage.setItem(EnarmUtil.CATEGORIES_KEY, categories);
  }

  static saveCurrent(caseId) {
    localStorage.setItem(EnarmUtil.CURRENT_CLINIC_CASE, caseId);
  }
  static getCurrent() {
    return localStorage.getItem(EnarmUtil.CURRENT_CLINIC_CASE);
  }
}

export default EnarmUtil;
