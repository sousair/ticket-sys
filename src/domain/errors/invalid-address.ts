import { CustomError } from "@shared/custom-error";

export class InvalidAddressError extends CustomError {
  constructor() {
    super({
      name: "InvalidAddressError",
      message: "invalid address",
    });
  }
}
