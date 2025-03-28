
import { InvalidParamError, MissingParamError, ServerError } from "../../erros";
import { EmailValidator } from "../../protocols";

import SignUpController from "./signUp";
import { AccountModel, AddAccount, AddAccountModel } from "./signUp-protocols";


interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAcount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  };
};
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      throw new Error();
    }
  }
  return new EmailValidatorStub();
};
const makeAddAcount = (): AddAccount => {
  class AddAcountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@email.com",
        password: "valid_password"
      };

      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAcountStub();
};

describe("SignUp Controller", () => {
  test("Should return 400 if no name provider",  async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });
  test("Should return 400 if no email provider", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
  test("Should return 400 if no password provider", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });
  test("Should return 400 if password not equal to passwordConfirmation", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "diferent_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("passwordConfirmation"));
  });
  test("Should return 400 if an invalid email is provider", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        email: "invalid_email@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });
  test("Should call emailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
  test("Should return 500 if emailValidator throw", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
       throw new ServerError();
    });
    const httpRequest = {
      body: {
        email: "Any_email@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  test("Should call addAcount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(
      {
        email: "any_email@mail.com",
        name: "any_name",
        password: "any_password"
      }
    );
  });
  test("Should return 500 if AddAccount throw", async () => {
    const { sut, emailValidatorStub, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
      return new Promise((resolve, reject) => reject(new Error()))
    });
    const httpRequest = {
      body: {
        email: "Any_email@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  test("Should return 200 if valid data is provider", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@email.com",
        password: "valid_password",
        passwordConfirmation: "valid_password"
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
    });
  });
});
