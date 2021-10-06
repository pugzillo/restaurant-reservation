exports.up = function (knex) {
  return knex.schema.table("tables", (table) => {
    table.string("seated").notNullable().defaultTo("pending");
  });
};

exports.down = function (knex) {
  return knex.schema.table("tables", (table) => {
    table.dropColumns("seated");
  });
};
