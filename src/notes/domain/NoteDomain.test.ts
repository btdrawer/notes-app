import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { getNoteId } from "../contract/NoteFacade";
import { noteFacadeTests } from "../contract/NoteFacade.test.suite";
import { NoteFakeRepository } from "../repository/fake/NoteFakeRepository";
import { NoteDomain } from "./NoteDomain";

const unitTests = async () => {
  const repository = new NoteFakeRepository(getNoteId);
  const domain = new NoteDomain(repository);

  return noteFacadeTests(domain);
};

const integrationTests = async () => {
  const postgresqlContainer = await new PostgreSqlContainer().start();

  await postgresqlContainer.stop();
};

unitTests().then(integrationTests);
