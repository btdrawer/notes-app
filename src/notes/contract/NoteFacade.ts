import { TaskEither } from "fp-ts/TaskEither";
import { Note, CreateNote } from "./types";

export interface NoteFacade {
  create(input: CreateNote): TaskEither<NoteError, Note>;
}
