import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { knex } from "knex";
import { getUserId } from "../contract/UserFacade";
import { UserDomain } from "./UserDomain";
import { UserFakeRepository } from "../repository/fake/UserFakeRepository";
import { UserKnexRepository } from "../repository/knex/UserKnexRepository";
import { userFacadeTests } from "../contract/UserFacade.test.suite";

const unitTests = async () => {
  const repository = new UserFakeRepository(getUserId);
  const domain = new UserDomain(repository);

  userFacadeTests(domain);
};

const integrationTests = async () => {
  const postgresqlContainer = await new PostgreSqlContainer().start();

  const knexClient = knex({});
  await knexClient.migrate.latest();

  const repository = new UserKnexRepository(knexClient, "users");
  const domain = new UserDomain(repository);

  userFacadeTests(domain);

  await postgresqlContainer.stop();
};

unitTests().then(integrationTests);
