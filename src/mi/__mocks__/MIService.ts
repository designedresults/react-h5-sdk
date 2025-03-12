
import { Observable } from 'rxjs';
import { IMIRequest, IMIResponse, IMIServiceCore } from '../';

export class MIService {
  
  constructor(private mi: IMIServiceCore){
    
  }
  execute(request: IMIRequest): Observable<IMIResponse> {
    return this.mi.execute(request)
  }

  
}
