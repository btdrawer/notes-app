import { Knex } from "knex";
import { pipe } from "fp-ts/function";
import TE, { TaskEither } from "fp-ts/lib/TaskEither";
import O from "fp-ts/Option";
import { Note } from "../../contract/types";
import { NoteRepository } from "../NoteRepository";
import {
  RepositoryError,
  NotFoundRepositoryError,
} from "../../../base/repository/error/RepositoryError";
import { handleKnexErrors } from "../../../base/repository/knex/handleKnexErrors";

export class NoteKnexRepository implements NoteRepository {
  private client: Knex<any, unknown[]>;
  private tableName: string;
  private fields: string[] = ["id", "title", "text", "userId"];

  constructor(client: Knex<any, unknown[]>, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  save(entity: Note): TaskEither<RepositoryError, Note> {
    return TE.tryCatch(
      () => this.client<Note>(this.tableName).insert(entity, this.fields),
      handleKnexErrors
    );
  }

  find(id: string): TaskEither<RepositoryError, Note> {
    return pipe(
      TE.tryCatch(
        () => this.client<Note>(this.tableName).where({ id }).select().first(),
        handleKnexErrors
      ),
      TE.map(O.fromNullable),
      TE.flatMap(
        O.match(
          () => TE.left<RepositoryError, Note>(new NotFoundRepositoryError()),
          TE.right
        )
      )
    );
  }

  findByUserId(userId: string): TaskEither<RepositoryError, Note[]> {
    return TE.tryCatch(
      () => this.client<Note>(this.tableName).where({ userId }).select(),
      handleKnexErrors
    );
  }

  delete(id: string): TaskEither<RepositoryError, void> {
    return TE.tryCatch(() => this.client.delete(id), handleKnexErrors);
  }
}
