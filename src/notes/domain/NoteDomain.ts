import { pipe } from "fp-ts/function";
import TE, { TaskEither } from "fp-ts/TaskEither";
import O from "fp-ts/Option";
import { v4 as uuidv4 } from "uuid";
import { NoteFacade } from "../contract/NoteFacade";
import { CreateNote, Note } from "../contract/types";
import { NoteRepository } from "../repository/NoteRepository";
import { UserContext } from "../../base/contract/UserContext";

export class NoteDomain implements NoteFacade {
  repository: NoteRepository;

  constructor(repository: NoteRepository) {
    this.repository = repository;
  }

  create(context: UserContext, input: CreateNote): TaskEither<NoteError, Note> {
    const entity = {
      id: uuidv4(),
      ...input,
      userId: context.userId,
    };
    return this.repository.save(entity);
  }

  list(context: UserContext): TaskEither<NoteError, Note[]> {
    return this.repository.findByUserId(context.userId);
  }

  get(context: UserContext, id: string): TaskEither<NoteError, Note> {
    return pipe(
      this.repository.find(id),
      TE.flatMap(this.validateNoteIsOwnedByUser(context))
    );
  }

  delete(context: UserContext, id: string): TaskEither<NoteError, void> {
    return pipe(
      this.repository.find(id),
      TE.flatMap(this.validateNoteIsOwnedByUser(context)),
      TE.flatMap(() => this.repository.delete(id))
    );
  }

  private validateNoteIsOwnedByUser(
    context: UserContext
  ): (note: Note) => TaskEither<NoteError, Note> {
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
}
