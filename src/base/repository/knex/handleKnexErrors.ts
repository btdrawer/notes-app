import { InternalRepositoryError } from "../error/RepositoryError";

export const handleKnexErrors = (error: unknown) => {
  if (error instanceof Error) {
    return new InternalRepositoryError(error.message);
  }
  return new InternalRepositoryError(error as string);
};
