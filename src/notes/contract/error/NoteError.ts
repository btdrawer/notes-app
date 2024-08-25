interface NoteError extends Error {}

class NotFoundNoteError implements NoteError {
  name = "not_found_note";
  message: string;

  constructor(message: string = "The note was not found.") {
    this.message = message;
  }
}

class InternalNoteError implements NoteError {
  name = "internal_error_note";
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
