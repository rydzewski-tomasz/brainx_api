exports.up = function (knex) {
  return knex.schema.createTable('task', (table) => {
    table.bigIncrements('id').primary().notNullable();
    table.string('name').notNullable();
    table.string('color', 7).notNullable();
    table.string('description').notNullable();
    table.timestamp('create', { useTz: false, precision: 0 }).notNullable();
    table.timestamp('update', { useTz: false, precision: 0 });
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('task');
};
