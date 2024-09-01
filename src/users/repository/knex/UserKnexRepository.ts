import { Knex } from "knex";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { User } from "../../contract/types";
import { UserRepository } from "../UserRepository";
import {
  RepositoryError,
  InternalRepositoryError,
  NotFoundRepositoryError,
} from "../../../base/repository/error/RepositoryError";

export class UserKnexRepository implements UserRepository {
  private client: Knex<any, unknown[]>;
  private tableName: string;
  private fields: string[] = ["id", "title", "text", "userId"];

  constructor(client: Knex<any, unknown[]>, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  save(entity: User): TE.TaskEither<RepositoryError, User> {
    return TE.tryCatch(
      () => this.client<User>(this.tableName).insert(entity, this.fields),
      (reason) => new InternalRepositoryError(reason as string)
    );
  }

  find(id: string): TE.TaskEither<RepositoryError, User> {
    return pipe(
      TE.tryCatch(
        () => this.client<User>(this.tableName).where({ id }).select().first(),
        (reason) => new InternalRepositoryError(reason as string)
      ),
      TE.map(O.fromNullable),
      TE.flatMap(
        O.match(
          () => TE.left<RepositoryError, User>(new NotFoundRepositoryError()),
          TE.right
        )
      )
    );
  }

  delete(id: string): TE.TaskEither<RepositoryError, void> {
    return TE.tryCatch(
      () => this.client.delete(id),
      (reason) => new InternalRepositoryError(reason as string)
    );
  }
}
