import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { knex } from "knex";
import { getNoteId } from "../contract/NoteFacade";
import { noteFacadeTests } from "../contract/NoteFacade.test.suite";
import { NoteFakeRepository } from "../repository/fake/NoteFakeRepository";
import { NoteKnexRepository } from "../repository/knex/NoteKnexRepository";
import { NoteDomain } from "./NoteDomain";

const unitTests = async () => {
  const repository = new NoteFakeRepository(getNoteId);
  const domain = new NoteDomain(repository);

  return noteFacadeTests(domain);
};

const integrationTests = async () => {
  const postgresqlContainer = await new PostgreSqlContainer().start();

  const knexClient = knex({});
  await knexClient.migrate.latest();

  const repository = new NoteKnexRepository(knexClient, "notes");
  const domain = new NoteDomain(repository);

  noteFacadeTests(domain);

  await postgresqlContainer.stop();
};

unitTests().then(integrationTests);
