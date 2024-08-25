import { TaskEither } from "fp-ts/TaskEither";
import { Note, CreateNote } from "./types";
import { UserContext } from "../../base/contract/UserContext";

export interface NoteFacade {
  create(context: UserContext, input: CreateNote): TaskEither<NoteError, Note>;

  list(context: UserContext): TaskEither<NoteError, Note[]>;

  get(context: UserContext, id: string): TaskEither<NoteError, Note>;

  delete(context: UserContext, id: string): TaskEither<NoteError, void>;
}
