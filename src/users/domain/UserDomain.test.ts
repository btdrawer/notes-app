import { getUserId } from "../contract/UserFacade";
import { UserDomain } from "./UserDomain";
import { UserFakeRepository } from "../repository/fake/UserFakeRepository";
import { userFacadeTests } from "../contract/UserFacade.test.suite";

const unitTests = async () => {
  const repository = new UserFakeRepository(getUserId);
  const domain = new UserDomain(repository);

  userFacadeTests(domain);
};

unitTests();
