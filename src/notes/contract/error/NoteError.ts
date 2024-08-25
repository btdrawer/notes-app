interface NoteError extends Error {}

class NotFound implements NoteError {
  name = "not_found_note";
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

class InternalError implements NoteError {
  name = "internal_error_note";
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
