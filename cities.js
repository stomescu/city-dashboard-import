import fs from "fs";
import { parse } from "csv-parse";
import slugify from "@sindresorhus/slugify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const parser = parse({ columns: true }, async (err, records) => {
  const cities = records.map((record) => ({
    name: record.city,
    slug: slugify(record.city),
    country: record.country,
    lat: parseFloat(record.lat),
    lng: parseFloat(record.lng),
    population: parseInt(record.population),
  }));
  await prisma.city.createMany({
    data: cities,
  })
});

fs.createReadStream(process.cwd() + "/data/cities.csv").pipe(parser);
