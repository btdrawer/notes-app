import { TaskEither } from "fp-ts/lib/TaskEither";
import { v4 as uuidv4 } from "uuid";
import { NoteFacade } from "../contract/NoteFacade";
import { CreateNote, Note } from "../contract/types";
import { NoteRepository } from "../repository/NoteRepository";

export class NoteDomain implements NoteFacade {
  repository: NoteRepository;

  constructor(repository: NoteRepository) {
    this.repository = repository;
  }

  create(input: CreateNote): TaskEither<NoteError, Note> {
    const entity = {
      id: uuidv4(),
      ...input,
    };
    return this.repository.save(entity);
  }
}
