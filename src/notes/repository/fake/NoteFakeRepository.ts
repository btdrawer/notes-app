import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as IO from "fp-ts/lib/IO";
import { FakeRepository } from "../../../base/repository/FakeRepository";
import { Note } from "../../contract/types";
import { NoteRepository } from "../NoteRepository";
import { RepositoryError } from "../../../base/repository/error/RepositoryError";

export class NoteFakeRepository
  extends FakeRepository<string, Note>
  implements NoteRepository
{
  findByUserId(userId: string): TE.TaskEither<RepositoryError, Note[]> {
    return pipe(this.findByUserIdInState(userId), TE.fromIO);
  }

  private findByUserIdInState(userId: string): IO.IO<Note[]> {
    return () =>
      Array.from(this.state.values()).filter((note) => note.userId === userId);
  }
}
