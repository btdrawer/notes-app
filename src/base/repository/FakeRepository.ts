import { pipe } from "fp-ts/function";
import TE, { TaskEither } from "fp-ts/TaskEither";
import { Repository } from "./Repository";
import IO from "fp-ts/lib/IO";
import O, { Option } from "fp-ts/lib/Option";

export class FakeRepository<ID, T> implements Repository<ID, T> {
  private state: Map<ID, T> = new Map<ID, T>();

  private getId: (entity: T) => ID;

  constructor(getId: (entity: T) => ID) {
    this.getId = getId;
  }

  save(entity: T): TaskEither<RepositoryError, T> {
    return pipe(this.saveState(entity), this.getOptionOrNotFoundFromIO);
  }

  find(id: ID): TaskEither<RepositoryError, T> {
    return pipe(this.findInState(id), this.getOptionOrNotFoundFromIO);
  }

  delete(id: ID): TaskEither<RepositoryError, void> {
    return pipe(this.deleteFromState(id), TE.fromIO);
  }

  // TODO try using state
  private saveState(entity: T): IO.IO<Option<T>> {
    return pipe(() => {
      this.state.set(this.getId(entity), entity);
      return this.state.get(this.getId(entity));
    }, IO.map(O.fromNullable));
  }

  private findInState(id: ID): IO.IO<Option<T>> {
    return pipe(() => this.state.get(id), IO.map(O.fromNullable));
  }

  private deleteFromState(id: ID): IO.IO<void> {
    return () => this.state.delete(id);
  }

  private getOptionOrNotFoundFromIO(
    maybeEntityIO: IO.IO<Option<T>>
  ): TaskEither<RepositoryError, T> {
    return pipe(
      TE.fromIO(maybeEntityIO),
      TE.flatMap(
        O.match(() => TE.left<RepositoryError, T>(new NotFound("")), TE.right)
      )
    );
  }
}
