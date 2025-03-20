import { HttpRequest, HttpResponse } from "./protocols/http";

export default class SignUpController {
  handle(httpRequest: any): any {
    const { name, email, password, passwordConfirmation } = httpRequest.body;

    if (!name) {
      return { statusCode: 400, body: new Error("Nome não fornecido!") };
    }
    if (!email) {
      return { statusCode: 400, body: new Error("E-mail não fornecido!") };
    }
    if(!password){
      return { statusCode: 400, body: new Error("Senha não fornecida!") };
    }
    return;
  }
}
