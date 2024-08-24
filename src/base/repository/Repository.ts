import { TaskEither } from "fp-ts/TaskEither";

export interface Repository<ID, T> {
  save(entity: T): TaskEither<RepositoryError, T>;

  find(id: ID): TaskEither<RepositoryError, T>;

  delete(id: ID): TaskEither<RepositoryError, void>;
}
