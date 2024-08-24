interface RepositoryError extends Error {}

class NotFound implements RepositoryError {
  name = "not_found_repository";
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
