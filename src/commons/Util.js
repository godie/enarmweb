
class Util {

  static isEmpty(obj) {
   for(var prop in obj) {
       if(obj.hasOwnProperty(prop))
           return false;
   }
   return JSON.stringify(obj) === JSON.stringify({});
 }

 /**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
 static shuffleArray(array) {
   let suffle = array.slice(0);
    for (var i = suffle.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = suffle[i];
        suffle[i] = suffle[j];
        suffle[j] = temp;
    }
    return suffle;
}

static showToast(message){
  if(typeof M !== 'undefined'){
      M.toast({html:message});     // eslint-disable-line no-undef
  } 
}


}

export default Util;
