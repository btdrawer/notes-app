import { Task } from "fp-ts/Task";
import { Note, CreateNote } from "./types";

export interface NoteFacade {
  create(input: CreateNote): Task<Note>;
}
