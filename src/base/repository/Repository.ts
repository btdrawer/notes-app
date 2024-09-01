import * as TE from "fp-ts/TaskEither";
import { RepositoryError } from "./error/RepositoryError";

export interface Repository<ID, T> {
  save(entity: T): TE.TaskEither<RepositoryError, T>;

  find(id: ID): TE.TaskEither<RepositoryError, T>;

  delete(id: ID): TE.TaskEither<RepositoryError, void>;
}
