import { getNoteId } from "../contract/NoteFacade";
import { noteFacadeTests } from "../contract/NoteFacade.test.suite";
import { NoteFakeRepository } from "../repository/NoteFakeRepository";
import { NoteDomain } from "./NoteDomain";

const fakeRepository = new NoteFakeRepository(getNoteId);
const domainWithFakeRepository = new NoteDomain(fakeRepository);

noteFacadeTests(domainWithFakeRepository);
