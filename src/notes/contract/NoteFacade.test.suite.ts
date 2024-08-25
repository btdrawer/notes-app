import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { isRight } from "fp-ts/Either";
import { NoteFacade } from "./NoteFacade";
import { NotFoundNoteError } from "./error/NoteError";

export const noteFacadeTests = (facade: NoteFacade) =>
  describe("NoteFacade", () => {
    const firstContext = { userId: "user-id" };
    const secondContext = { userId: "another-user-id" };

    describe("create", () => {
      it("should create a new note", async () => {
        /** given */

        /** when */
        const result = await facade.create(firstContext, {
          title: "New note",
          text: "Hello world",
        })();

        /** then */
        if (isRight(result)) {
          expect(result.right.title).toEqual("New note");
          expect(result.right.text).toEqual("Hello world");
          expect(result.right.userId).toEqual("user-id");
        } else {
          expect(isRight(result)).toBe(true);
        }
      });
    });

    describe("list", () => {
      it("should list a user's notes", async () => {
        /** given */
        const notes = await pipe(
          facade.create(firstContext, {
            title: "New note",
            text: "Hello world",
          }),
          TE.bindTo("firstNote"),
          TE.bind("secondNote", () =>
            facade.create(firstContext, {
              title: "New note",
              text: "Hello world",
            })
          ),
          TE.bind("thirdNote", () =>
            facade.create(secondContext, {
              title: "New note",
              text: "Hello world",
            })
          )
        )();

        /** when */
        const result = await facade.list(firstContext)();
        const anotherContextResult = await facade.list(secondContext)();

        /** then */
        if (
          isRight(notes) &&
          isRight(result) &&
          isRight(anotherContextResult)
        ) {
          expect(result.right.sort).toEqual(
            [notes.right.firstNote, notes.right.secondNote].sort
          );
          expect(anotherContextResult.right.sort).toEqual(
            [notes.right.thirdNote].sort
          );
        } else {
          expect(isRight(notes)).toBe(true);
          expect(isRight(result)).toBe(true);
          expect(isRight(anotherContextResult)).toBe(true);
        }
      });
    });

    describe("delete", () => {
      it("should delete a note", () => {
        return pipe(
          facade.create(firstContext, {
            title: "New note",
            text: "Hello world",
          }),
          TE.bindTo("entity"),
          TE.flatMap(({ entity }) =>
            pipe(
              facade.delete(firstContext, entity.id),
              TE.flatMap(() => facade.get(firstContext, entity.id)),
              TE.mapLeft((error) =>
                expect(error instanceof NotFoundNoteError).toBe(true)
              ),
              TE.map(() => {
                throw new Error(
                  "Expected function result to be left but was right"
                );
              })
            )
          )
        )();
      });

      it("should not delete a note if different user", () => {
        return pipe(
          facade.create(firstContext, {
            title: "New note",
            text: "Hello world",
          }),
          TE.bindTo("entity"),
          TE.flatMap(({ entity }) =>
            pipe(
              facade.delete(secondContext, entity.id),
              TE.mapLeft((error) =>
                expect(error instanceof NotFoundNoteError).toBe(true)
              ),
              TE.map(() => {
                throw new Error(
                  "Expected function result to be left but was right"
                );
              })
            )
          )
        )();
      });
    });
  });
