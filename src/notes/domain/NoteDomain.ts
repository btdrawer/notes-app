import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { v4 as uuidv4 } from "uuid";
import { NoteFacade } from "../contract/NoteFacade";
import { CreateNote, Note } from "../contract/types";
import { NoteRepository } from "../repository/NoteRepository";
import { UserContext } from "../../base/contract/UserContext";
import {
  InternalNoteError,
  NoteError,
  NotFoundNoteError,
} from "../contract/error/NoteError";
import {
  NotFoundRepositoryError,
  RepositoryError,
} from "../../base/repository/error/RepositoryError";

export class NoteDomain implements NoteFacade {
  repository: NoteRepository;

  constructor(repository: NoteRepository) {
    this.repository = repository;
  }

  create(
    context: UserContext,
    input: CreateNote
  ): TE.TaskEither<NoteError, Note> {
    const entity = {
      id: uuidv4(),
      ...input,
      userId: context.userId,
    };
    return pipe(
      this.repository.save(entity),
      TE.mapLeft(this.transformRepositoryError)
    );
  }

  list(context: UserContext): TE.TaskEither<NoteError, Note[]> {
    return pipe(
      this.repository.findByUserId(context.userId),
      TE.mapLeft(this.transformRepositoryError)
    );
  }

  get(context: UserContext, id: string): TE.TaskEither<NoteError, Note> {
    return pipe(
      this.repository.find(id),
      TE.mapLeft(this.transformRepositoryError),
      TE.flatMap(this.validateNoteIsOwnedByUser(context))
    );
  }

  delete(context: UserContext, id: string): TE.TaskEither<NoteError, void> {
    return pipe(
      this.repository.find(id),
      TE.mapLeft(this.transformRepositoryError),
      TE.flatMap(this.validateNoteIsOwnedByUser(context)),
      TE.flatMap(() => this.repository.delete(id))
    );
  }

  private validateNoteIsOwnedByUser(
    context: UserContext
  ): (note: Note) => TE.TaskEither<NoteError, Note> {
    return (note) =>
      pipe(
        TE.right(
          O.fromPredicate<Note>((n) => n.userId === context.userId)(note)
        ),
        TE.flatMap(
          O.match(
            () => TE.left<NoteError, Note>(new NotFoundNoteError()),
            TE.right
          )
        )
      );
  }

  private transformRepositoryError(error: RepositoryError): NoteError {
    if (error instanceof NotFoundRepositoryError) {
      return new NotFoundNoteError(error.message);
    } else {
      return new InternalNoteError(error.message);
    }
  }
}
