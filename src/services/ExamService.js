import axios from 'axios';
import BaseService from './BaseService';
import Auth from '../modules/Auth';

class ExamService {



    static getExams(page) {
      let token = `bearer ${Auth.getToken()}`;
      let headers = {headers:{'Authorization': token}, params:{ page: page}};
      //Todo exams are differentes :P
      let url = "clinical_cases";
      return axios.get(BaseService.getURL(url),headers);
    }

    static getQuestions(clinicCaseId){
      let token = `bearer ${Auth.getToken()}`;
      let url = "questions/"+clinicCaseId+"/clinic_case";
      return axios.get(BaseService.getURL(url));
    }

    static getCaso(clinicCaseId){
      let token = `bearer ${Auth.getToken()}`;
      let url = "clinical_cases/"+clinicCaseId;
      let headers = {headers:{'Authorization': token}};
      return axios.get(BaseService.getURL(url),headers);

    }

    static loadCategories(){
      let token = `bearer ${Auth.getToken()}`;
      let url = "categories";
      let headers = {headers:{'Authorization':token}};
      return axios.get(BaseService.getURL(url),headers);
    }

    static saveCaso(caso){
      let token = `bearer ${Auth.getToken()}`;
      let url = "clinical_cases";
      let headers = {headers:{'Authorization': token}};

      if(caso.id > 0 ){
         url = url+'/'+caso.id;
         return axios.put(BaseService.getURL(url),{clinical_case:caso},headers);
      }else{
         return axios.post(BaseService.getURL(url),{clinical_case:caso},headers);
      }
    }

    static sendAnswers(playerAnswers){
      let token = `bearer ${Auth.getToken()}`;
      let url = "player_answers";
      let headers = {headers:{'Authorization': token}};

      if(playerAnswers.id > 0 ){
         url = url+'/'+playerAnswers.id;
         return axios.put(BaseService.getURL(url),playerAnswers,headers);
      }else{
         return axios.post(BaseService.getURL(url),playerAnswers,headers);
      }
    }


}

export default ExamService;
