import { NoteFacade } from "./NoteFacade";
import { isRight } from "fp-ts/lib/Either";

export const noteFacadeTests = (facade: NoteFacade) =>
  describe("NoteFacade", () => {
    it("should create a new note", async () => {
      /** given */

      /** when */
      const result = await facade.create(
        {
          userId: "user-id",
        },
        {
          title: "New note",
          text: "Hello world",
        }
      )();

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
