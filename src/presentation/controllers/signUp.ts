import { HttpRequest, HttpResponse } from "./protocols/http";

export default class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
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
    if(password != passwordConfirmation){
      return { statusCode: 400, body: new Error("Senhas devem ser iguais!") };
    }
    return;
  }
}
