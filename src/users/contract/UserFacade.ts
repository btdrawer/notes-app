import { TaskEither } from "fp-ts/TaskEither";
import { User, CreateUser } from "./types";
import { UserContext } from "../../base/contract/UserContext";
import { UserError } from "./error/UserError";

export interface UserFacade {
  create(input: CreateUser): TaskEither<UserError, User>;

  delete(context: UserContext): TaskEither<UserError, void>;
}

export const getUserId = (user: User) => user.id;
