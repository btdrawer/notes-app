import { Knex } from "knex";
import TE, { TaskEither } from "fp-ts/lib/TaskEither";
import { Note } from "../contract/types";
import { NoteRepository } from "./types";

export class NoteKnexRepository implements NoteRepository {
  private client: Knex<Note, unknown[]>;
  private fields: string[] = ["id", "title", "text"];

  constructor(client: Knex<Note, unknown[]>) {
    this.client = client;
  }

  save(entity: Note): TaskEither<RepositoryError, Note> {
    return TE.tryCatch(
      () => this.client.insert(entity, this.fields),
      (reason) => new NotFound(reason as string)
    );
  }

  find(id: string): TaskEither<RepositoryError, Note> {
    return TE.tryCatch(
      () => this.client.where({ id }).select(this.fields),
      (reason) => new NotFound(reason as string)
    );
  }

  delete(id: string): TaskEither<RepositoryError, void> {
    return TE.tryCatch(
      () => this.client.delete(id),
      (reason) => new NotFound(reason as string)
    );
  }
}
