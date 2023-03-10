import { createFileWithIntegers, joinIntegersFromFiles, splitFileOnChunksWithSort } from "./utils.js";

const fileSize = 100 * 1024 * 1024; // 100mb in bytes
const fileName = 'numbers.txt';
const numberOfChunks = 20;


await createFileWithIntegers(fileName, fileSize)
await splitFileOnChunksWithSort(fileName, numberOfChunks)
joinIntegersFromFiles(numberOfChunks)
