import { FakeRepository } from "../../../base/repository/FakeRepository";
import { User } from "../../contract/types";
import { UserRepository } from "../UserRepository";

export class UserFakeRepository
  extends FakeRepository<string, User>
  implements UserRepository {}
