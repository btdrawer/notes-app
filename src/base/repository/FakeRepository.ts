import { pipe } from "fp-ts/function";
import { Repository } from "./Repository";
import * as TE from "fp-ts/TaskEither";
import * as IO from "fp-ts/lib/IO";
import * as O from "fp-ts/lib/Option";

export class FakeRepository<ID, T> implements Repository<ID, T> {
  protected state: Map<ID, T> = new Map<ID, T>();

  protected getId: (entity: T) => ID;

  constructor(getId: (entity: T) => ID) {
    this.getId = getId;
  }

  save(entity: T): TE.TaskEither<RepositoryError, T> {
    return pipe(this.saveState(entity), this.getOptionOrNotFoundFromIO);
  }

  find(id: ID): TE.TaskEither<RepositoryError, T> {
    return pipe(this.findInState(id), this.getOptionOrNotFoundFromIO);
  }

  delete(id: ID): TE.TaskEither<RepositoryError, void> {
    return pipe(this.deleteFromState(id), TE.fromIO);
  }

  // TODO try using state
  private saveState(entity: T): IO.IO<O.Option<T>> {
    return pipe(() => {
      this.state.set(this.getId(entity), entity);
      return this.state.get(this.getId(entity));
    }, IO.map(O.fromNullable));
  }

  private findInState(id: ID): IO.IO<O.Option<T>> {
    return pipe(() => this.state.get(id), IO.map(O.fromNullable));
  }

  private deleteFromState(id: ID): IO.IO<void> {
    return () => this.state.delete(id);
  }

  private getOptionOrNotFoundFromIO(
    maybeEntityIO: IO.IO<O.Option<T>>
  ): TE.TaskEither<RepositoryError, T> {
    return pipe(
      TE.fromIO(maybeEntityIO),
      TE.flatMap(
        O.match(
          () => TE.left<RepositoryError, T>(new NotFoundRepositoryError("")),
          TE.right
        )
      )
    );
  }
}
