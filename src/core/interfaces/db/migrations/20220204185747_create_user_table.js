exports.up = async function (knex) {
  await knex.raw(`CREATE TYPE user_status AS ENUM ('ACTIVE', 'REMOVED')`);

  return knex.schema.createTable('user', (table) => {
    table.bigIncrements('id').primary().notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.specificType('status', 'user_status').notNullable();
    table.timestamp('create', { useTz: false, precision: 0 }).notNullable();
    table.timestamp('update', { useTz: false, precision: 0 });
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('user');
  return knex.raw(`DROP TYPE user_status`);
};
