import { TaskEither } from "fp-ts/lib/TaskEither";
import { Repository } from "../../base/repository/Repository";
import { Note } from "../contract/types";

export type NoteRepository = Repository<string, Note> & {
  findByUserId(userId: string): TaskEither<RepositoryError, Note[]>;
};
