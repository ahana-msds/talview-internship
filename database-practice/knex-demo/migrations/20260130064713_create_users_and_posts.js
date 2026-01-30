/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('users', (table) => {
            table.increments('id').primary();
            table.string('email').notNullable().unique();
            table.string('name');
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
        .createTable('profiles', (table) => {
            table.increments('id').primary();
            table.string('bio');
            table.integer('user_id').unsigned().notNullable().unique();
            table.foreign('user_id').references('users.id').onDelete('CASCADE');
        })
        .createTable('posts', (table) => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.text('content');
            table.boolean('published').defaultTo(false);
            table.integer('author_id').unsigned().notNullable();
            table.foreign('author_id').references('users.id').onDelete('CASCADE');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('posts')
        .dropTableIfExists('profiles')
        .dropTableIfExists('users');
};
