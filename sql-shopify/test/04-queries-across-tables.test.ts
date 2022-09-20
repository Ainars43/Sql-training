import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
    let db: Database;

    beforeAll(async () => {
        db = await Database.fromExisting("03", "04");
    }, minutes(1));

    it("should select count of apps which have free pricing plan", async done => {
        const query = `SELECT COUNT(*) AS count
        FROM apps_pricing_plans
        WHERE pricing_plan_id = 1
        OR pricing_plan_id = 13 `;
        const result = await db.selectSingleRow(query);
        expect(result).toEqual({
            count: 1112
        });
        done();
    }, minutes(1));

    it("should select top 3 most common categories", async done => {
        const query = `SELECT COUNT(*) AS count, title AS category 
        FROM apps_categories
        JOIN categories ON categories.id = category_id
        GROUP BY title
        ORDER BY count DESC
        LIMIT 3`;
        const result = await db.selectMultipleRows(query);
        expect(result).toEqual([
            { count: 1193, category: "Store design" },
            { count: 723, category: "Sales and conversion optimization" },
            { count: 629, category: "Marketing" }
        ]);
        done();
    }, minutes(1));

    it("should select top 3 prices by appearance in apps and in price range from $5 to $10 inclusive (not matters monthly or one time payment)", async done => {
        const query = `SELECT COUNT(*) AS count, price, 
        CASE 
        WHEN price LIKE '%/%' THEN CAST(substr(price, instr(price, '$')+1, instr(price, '/')-2) AS REAL) 
        ELSE CAST(substr(price, instr(price, '$')+1, instr(price, 'one')-2) AS REAL) 
        END AS casted_price
        FROM pricing_plans
        JOIN apps_pricing_plans ON pricing_plan_id = id
        WHERE casted_price BETWEEN 5 AND 10
        GROUP BY casted_price
        ORDER BY count DESC
        LIMIT 3`;
        const result = await db.selectMultipleRows(query);
        expect(result).toEqual([
            { count: 225, price: "$9.99/month", casted_price: 9.99 },
            { count: 135, price: "$5/month", casted_price: 5 },
            { count: 114, price: "$10/month", casted_price: 10 }
        ]);
        done();
    }, minutes(1));
});