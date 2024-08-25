import { pipe } from "fp-ts/function";
import TE, { TaskEither } from "fp-ts/lib/TaskEither";
import { FakeRepository } from "../../base/repository/FakeRepository";
import { Note } from "../contract/types";
import { NoteRepository } from "./NoteRepository";
import { IO } from "fp-ts/lib/IO";

export class NoteFakeRepository
  extends FakeRepository<string, Note>
  implements NoteRepository
{
  findByUserId(userId: string): TaskEither<RepositoryError, Note[]> {
    return pipe(this.findByUserIdInState(userId), TE.fromIO);
  }

  private findByUserIdInState(userId: string): IO<Note[]> {
    return () =>
      Array.from(this.state.values()).filter((note) => note.userId === userId);
  }
}
