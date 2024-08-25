import { TaskEither } from "fp-ts/lib/TaskEither";
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
}
