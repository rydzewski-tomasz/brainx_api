exports.up = async function (knex) {
  await knex.raw(`CREATE TYPE task_status AS ENUM ('ACTIVE', 'REMOVED');`);

  return knex.schema.createTable('task', (table) => {
    table.bigIncrements('id').primary().notNullable();
    table.string('name').notNullable();
    table.specificType('status', 'task_status').notNullable();
    table.string('color', 7).notNullable();
    table.string('description').notNullable();
    table.timestamp('create', { useTz: false, precision: 0 }).notNullable();
    table.timestamp('update', { useTz: false, precision: 0 });
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('task');
  return knex.raw(`DROP TYPE task_status;`);
};
