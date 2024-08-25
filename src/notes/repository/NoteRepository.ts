import { Repository } from "../../base/repository/Repository";
import { Note } from "../contract/types";

export type NoteRepository = Repository<string, Note>;
