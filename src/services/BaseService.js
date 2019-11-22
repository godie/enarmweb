
class BaseService {

  static getURL(url){
    var host = window.location.hostname;
    //console.log(host);
    if(host === 'localhost'){
      return 'http://localhost:3000/'+url;
    }else{
      return 'https://enarmapi.godieboy.com/'+url;
    }
  }

}

export default BaseService;
