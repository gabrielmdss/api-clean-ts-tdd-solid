import InvalidParamError from "../erros/invalid-param-errors";
import MissingParamError from "../erros/missing-param-errors";
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
    const requiredFields = ["name", "email", "password"];

    for (let field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const isValid = this.emailValidator.isValid(httpRequest.body.email)
    
    if(!isValid){
      return badRequest(new InvalidParamError('email'))
    }
    return;
  }
}
