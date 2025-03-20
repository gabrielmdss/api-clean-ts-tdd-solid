import MissingParamError from "../erros/missing-param-errors";
import { HttpRequest, HttpResponse } from "./protocols/http";

export default class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const { name, email, password, passwordConfirmation } = httpRequest.body;

    if (!name) {
      return { statusCode: 400, body: new MissingParamError("name") };
    }
    if (!email) {
      return { statusCode: 400, body: new MissingParamError("email") };
    }
    if (!password) {
      return { statusCode: 400, body: new MissingParamError("password") };
    }
    if (password != passwordConfirmation) {
      return { statusCode: 400, body: new MissingParamError("passwordConfirmation") };
    }
    return;
  }
}
