exports.up = async function (knex) {
  await knex.raw(`CREATE TYPE user_token_status AS ENUM ('ACTIVE', 'INACTIVE')`);

  return knex.schema.createTable('user_token_register', (table) => {
    table.bigIncrements('id').primary().notNullable();
    table.bigInteger('user_id').notNullable().references('id').inTable('user');
    table.specificType('status', 'user_token_status').notNullable();
    table.timestamp('create', { useTz: false, precision: 0 }).notNullable();
    table.timestamp('expire', { useTz: false, precision: 0 }).notNullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('user_token');
  return knex.raw(`DROP TYPE user_token_status`);
};
