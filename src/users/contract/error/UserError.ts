export interface UserError extends Error {}

export class NotFoundUserError implements UserError {
  name = "not_found_user";
  message: string;

  constructor(message: string = "The user was not found.") {
    this.message = message;
  }
}

export class InternalUserError implements UserError {
  name = "internal_error_user";
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
