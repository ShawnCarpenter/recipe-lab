const pool = require('../utils/pool');
const Log = require('./log');

module.exports = class Recipe {
  id;
  name;
  directions;
  ingredients;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.directions = row.directions;
    this.ingredients = row.ingredients;
  }

  static async insert(recipe) {
    const { rows } = await pool.query(
      `INSERT into recipes (name, directions, ingredients) 
      VALUES ($1, $2, $3) RETURNING *`,
      [recipe.name, recipe.directions, recipe.ingredients]
    );

    return new Recipe(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM recipes'
    );

    return rows.map(row => new Recipe(row));
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM recipes WHERE id=$1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Recipe(rows[0]);
  }

  static async findByIdWithLogs(id){
    const { rows } = await pool.query(
      'SELECT * FROM recipes WHERE id=$1',
      [id]
    );
    if(!rows[0]) return null;
    else {
      const recipe = new Recipe(rows[0]);
      const logs = await Log.findByRecipeId(id);
      return { ...recipe, logs: [...logs] };
    }
  }

  static async update(id, recipe) {
    const { rows } = await pool.query(
      `UPDATE recipes
       SET name=$1,
           directions=$2,
           ingredients=$3
       WHERE id=$4
       RETURNING *
      `,
      [recipe.name, recipe.directions, recipe.ingredients, id]
    );

    return new Recipe(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM recipes WHERE id=$1 RETURNING *',
      [id]
    );

    return new Recipe(rows[0]);
  }
};
