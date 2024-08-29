import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import * as E from "fp-ts/Either";
import { toBeLeft, toBeRight } from "@relmify/jest-fp-ts";
import { UserFacade } from "./UserFacade";

expect.extend({ toBeLeft, toBeRight });

export const userFacadeTests = (facade: UserFacade) =>
  describe("UserFacade", () => {
    describe("create", () => {
      it("should create a new user", async () => {
        const either = await facade.create({})();

        expect(either).toEqualRight({
          id: expect.any(String),
        });
      });
    });

    describe("delete", () => {
      it("should delete a user", async () => {
        const either = await pipe(
          TE.Do,
          TE.bind("entity", () => facade.create({})),
          TE.bind("deleteResult", ({ entity }) =>
            facade.delete({ userId: entity.id })
          ),
          TE.flatMap(({ entity, deleteResult }) =>
            pipe(
              T.Do,
              T.flatMap(() => facade.delete({ userId: entity.id })),
              T.map((either) =>
                E.right({ entity, deleteResult, secondDeleteResult: either })
              )
            )
          )
        )();

        expect(either).toEqualRight({
          entity: {
            id: expect.any(String),
          },
          deleteResult: true,
          secondDeleteResult: E.left(expect.any(Object)),
        });
      });
    });
  });
