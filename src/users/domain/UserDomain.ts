import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../../base/contract/UserContext";
import {
  InternalUserError,
  NotFoundUserError,
  UserError,
} from "../contract/error/UserError";
import { CreateUser, User } from "../contract/types";
import { UserFacade } from "../contract/UserFacade";
import { UserRepository } from "../repository/UserRepository";
import {
  NotFoundRepositoryError,
  RepositoryError,
} from "../../base/repository/error/RepositoryError";

export class UserDomain implements UserFacade {
  repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  create(input: CreateUser): TE.TaskEither<UserError, User> {
    const entity = {
      id: uuidv4(),
      ...input,
    };
    return pipe(
      this.repository.save(entity),
      TE.mapLeft(this.transformRepositoryError)
    );
  }

  delete(context: UserContext): TE.TaskEither<UserError, void> {
    return pipe(
      this.repository.find(context.userId),
      TE.mapLeft(this.transformRepositoryError),
      TE.flatMap(() => this.repository.delete(context.userId))
    );
  }

  private transformRepositoryError(error: RepositoryError): UserError {
    if (error instanceof NotFoundRepositoryError) {
      return new NotFoundUserError(error.message);
    } else {
      return new InternalUserError(error.message);
    }
  }
}
