import { InvalidParamError, MissingParamError } from "../../erros";
import { badRequest, ok, serverError } from "../../helper/httpHelper";
import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from "./signUp-protocols";

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount
  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];

      for (let field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password != passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
    
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account);
    } catch (error) {
      return serverError();
    }
  }
}
