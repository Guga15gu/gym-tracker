/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("muscles", {
    id: {
      type: "uuid",
      default: pgm.func("gen_random_uuid()"),
      primaryKey: true,
    },
    name: { type: "text", notNull: true, unique: true },
    created_at: { type: "timestamptz", default: pgm.func("now()") },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("muscles");
};
