export interface NoteError extends Error {}

export class NotFoundNoteError implements NoteError {
  name = "not_found_note";
  message: string;

  constructor(message: string = "The note was not found.") {
    this.message = message;
  }
}

export class InternalNoteError implements NoteError {
  name = "internal_error_note";
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
