import MissingParamError from "../erros/missing-param-errors";
import { badRequest } from "../helper/httpHelper";
import { HttpRequest, HttpResponse } from "../protocols/http";

export default class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const { name, email, password, passwordConfirmation } = httpRequest.body;

    if (!name) {
      return badRequest(new MissingParamError("name"));
    }
    if (!email) {
      return badRequest(new MissingParamError("email"));
    }
    if (!password) {
      return badRequest(new MissingParamError("password"));
    }
    if (password != passwordConfirmation) {
      return badRequest(new MissingParamError("passwordConfirmation"));
    }
    return;
  }
}
