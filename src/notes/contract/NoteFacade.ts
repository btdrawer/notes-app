import { TaskEither } from "fp-ts/TaskEither";
import { Note, CreateNote } from "./types";
import { UserContext } from "../../base/contract/UserContext";

export interface NoteFacade {
  create(context: UserContext, input: CreateNote): TaskEither<NoteError, Note>;

  list(context: UserContext): TaskEither<NoteError, Note[]>;
}
