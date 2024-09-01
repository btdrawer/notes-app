import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("users", (table) => {
      table.string("id", 255).notNullable().primary();
    })
    .createTable("notes", (table) => {
      table.string("id", 255).notNullable().primary();
      table.string("title", 255);
      table.text("text");
      table
        .string("userId", 255)
        .notNullable()
        .references("id")
        .inTable("users");
    });
}

export async function down(knex: Knex): Promise<void> {}
