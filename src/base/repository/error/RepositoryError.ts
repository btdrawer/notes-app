export interface RepositoryError extends Error {}

export class NotFoundRepositoryError implements RepositoryError {
  name = "not_found_repository";
  message: string;

  constructor(message: string = "The entity could not be found.") {
    this.message = message;
  }
}

export class InternalRepositoryError implements RepositoryError {
  name = "internal_error_repository";
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
