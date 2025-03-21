import { InvalidParamError, MissingParamError } from "../erros";
import { badRequest, serverError } from "../helper/httpHelper";
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "../protocols";
export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ["name", "email", "password"];

      for (let field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailValidator.isValid("any_email@mail.com");

      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      return;
    } catch (error) {
      return serverError();
    }
  }
}
