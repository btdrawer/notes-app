import { Repository } from "../../base/repository/Repository";
import { User } from "../contract/types";

export type UserRepository = Repository<string, User>;
