class EnarmUtil{
	static CATEGORIES_KEY = 'categories';
	static CURRENT_CLINIC_CASE = 'currentcc';

	static isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
  }
	static isUndefined(obj){
		return obj === undefined;
	}
	static getCategory(props){
		var categoryId = EnarmUtil.getCurrent() || 1;
		if (!EnarmUtil.isUndefined(props.params) && !EnarmUtil.isEmpty(props.params)) {
        if(!isNaN(parseInt(props.params.identificador))){
          categoryId = props.params.identificador;
        }
    }
		EnarmUtil.saveCurrent(categoryId);
    return categoryId;
	}

	static getCategories(){
			return localStorage.getItem(EnarmUtil.CATEGORIES_KEY);
	}

	static setCategories(categories){
		localStorage.setItem(EnarmUtil.CATEGORIES_KEY, categories);
		}

	static saveCurrent(caseId){
		localStorage.setItem(EnarmUtil.CURRENT_CLINIC_CASE,caseId);
	}
	static getCurrent(){
		return localStorage.getItem(EnarmUtil.CURRENT_CLINIC_CASE);
	}
}

export default EnarmUtil ;
