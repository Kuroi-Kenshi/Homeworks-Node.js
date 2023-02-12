import { createFileWithIntegers, joinIntegersFromFiles, splitFileOnChunksWithSort } from "./utils.js";

const fileSize = 100 * 1024 * 1024; // 100mb in bytes
const fileName = 'numbers.txt';
const numberOfChunks = 5;


await createFileWithIntegers(fileName, fileSize)
await splitFileOnChunksWithSort('./numbers.txt', numberOfChunks)
joinIntegersFromFiles()
