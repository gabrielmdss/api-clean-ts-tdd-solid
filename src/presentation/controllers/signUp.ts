import InvalidParamError from "../erros/invalid-param-errors";
import MissingParamError from "../erros/missing-param-errors";
import ServerError from "../erros/server-errors";
import { badRequest } from "../helper/httpHelper";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/emailValidator";
import { HttpRequest, HttpResponse } from "../protocols/http";

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor(emailValidator: EmailValidator){
    this.emailValidator = emailValidator
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      
      const requiredFields = ["name", "email", "password"];
  
      for (let field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
  
      const isValid = this.emailValidator.isValid('any_email@mail.com')
  
      if(!isValid){
        return badRequest(new InvalidParamError('email'))
      }
      return;
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
