import { APPS, APPS_CATEGORIES, CATEGORIES, REVIEWS } from "../shopify-table-names";

export const selectCount = (table: string): string => {
  return `SELECT COUNT() AS c FROM ${table}`;
};

export const selectRowById = (id: number, table: string): string => {
  return `SELECT * FROM ${table} WHERE id = ${id}`;
};

export const selectCategoryByTitle = (title: string): string => {
  return `SELECT * FROM ${CATEGORIES} WHERE title = '${title}'`;
};

export const selectAppCategoriesByAppId = (appId: number): string => {
  return `SELECT apps.title AS app_title, category_id, 
  categories.title AS category_title
  FROM ${CATEGORIES} 
  LEFT JOIN ${APPS_CATEGORIES} ON categories.id = apps_categories.category_id
  LEFT JOIN ${APPS} ON apps_categories.app_id = apps.id
  WHERE app_id = ${appId}`;
};

export const selectUnigueRowCount = (tableName: string, columnName: string): string => {
  return `SELECT COUNT(DISTINCT ${columnName}) AS c
  FROM ${tableName}`;
};

export const selectReviewByAppIdAuthor = (appId: number, author: string): string => {
  return `SELECT * FROM ${REVIEWS}
  WHERE app_id = ${appId} AND author = '${author}'`;
};

export const selectColumnFromTable = (columnName: string, tableName: string): string => {
  return `SELECT ${columnName} FROM ${tableName}`;
};

