import MissingParamError from "../erros/missing-param-errors";
import { badRequest } from "../helper/httpHelper";
import { Controller } from "../protocols/controller";
import { HttpRequest, HttpResponse } from "../protocols/http";

export default class SignUpController implements Controller{
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ["name", "email", "password"]

    for(let field of requiredFields){
      if(!httpRequest.body[field]){
        return badRequest(new MissingParamError(field))
      }
    }
    return;
  }
}
