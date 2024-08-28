import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import { toBeLeft, toBeRight } from "@relmify/jest-fp-ts";
import { NoteFacade } from "./NoteFacade";

expect.extend({ toBeLeft, toBeRight });

export const noteFacadeTests = (facade: NoteFacade) =>
  describe("NoteFacade", () => {
    const firstContext = { userId: "user-id" };
    const secondContext = { userId: "another-user-id" };

    const basicCreateNote = {
      title: "New note",
      text: "Hello world",
    };

    const cleanup = pipe(
      TE.Do,
      TE.flatMap(() => facade.list(firstContext)),
      TE.flatMap((notes) =>
        TE.sequenceArray(
          notes.map((note) => facade.delete(firstContext, note.id))
        )
      ),
      TE.flatMap(() => facade.list(secondContext)),
      TE.flatMap((notes) =>
        TE.sequenceArray(
          notes.map((note) => facade.delete(secondContext, note.id))
        )
      )
    );

    afterEach(cleanup);

    describe("create", () => {
      it("should create a new note", async () => {
        const either = await facade.create(firstContext, basicCreateNote)();

        expect(either).toEqualRight({
          id: expect.any(String),
          title: "New note",
          text: "Hello world",
          userId: "user-id",
        });
      });
    });

    describe("list", () => {
      it("should list a user's notes", async () => {
        const either = await pipe(
          TE.Do,
          TE.bind("firstNote", () =>
            facade.create(firstContext, basicCreateNote)
          ),
          TE.bind("secondNote", () =>
            facade.create(firstContext, basicCreateNote)
          ),
          TE.bind("thirdNote", () =>
            facade.create(secondContext, basicCreateNote)
          ),
          TE.bind("result", () => facade.list(firstContext)),
          TE.bind("anotherContextResult", () => facade.list(secondContext)),
          TE.map(({ result, anotherContextResult }) => ({
            result,
            anotherContextResult,
          }))
        )();

        expect(either).toSubsetEqualRight({
          result: [
            {
              id: expect.any(String),
              ...basicCreateNote,
              ...firstContext,
            },
            {
              id: expect.any(String),
              ...basicCreateNote,
              ...firstContext,
            },
          ],
          anotherContextResult: [
            {
              id: expect.any(String),
              ...basicCreateNote,
              ...secondContext,
            },
          ],
        });
      });
    });

    describe("delete", () => {
      it("should delete a note", async () => {
        const either = await pipe(
          TE.Do,
          TE.bind("entity", () => facade.create(firstContext, basicCreateNote)),
          TE.bind("deleteResult", ({ entity }) =>
            facade.delete(firstContext, entity.id)
          ),
          TE.map(({ entity }) => entity)
        )();

        expect(either).toEqualRight({
          id: expect.any(String),
          ...basicCreateNote,
          ...firstContext,
        });
      });

      it(
        "should not delete a note if different user",
        pipe(
          TE.Do,
          TE.flatMap(() => facade.create(firstContext, basicCreateNote)),
          TE.flatMap((entity) => facade.delete(secondContext, entity.id)),
          T.map((deleteEither) => expect(deleteEither).toBeLeft())
        )
      );
    });
  });
