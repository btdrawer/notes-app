interface RepositoryError extends Error {}

class NotFoundRepositoryError implements RepositoryError {
  name = "not_found_repository";
  message: string;

  constructor(message: string = "The entity could not be found.") {
    this.message = message;
  }
}

class InternalRepositoryError implements RepositoryError {
  name = "internal_error_repository";
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
