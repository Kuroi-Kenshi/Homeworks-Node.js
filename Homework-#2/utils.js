import fs from 'node:fs';
import readline from 'node:readline';
import colors from 'ansi-colors';
import child_process from "node:child_process";
import { writeFile } from "node:fs/promises";

const writeToFile = (chunkToWrite, outputStream) => new Promise((res, rej) => {
  try {
    if (
      !outputStream.write(chunkToWrite, 'utf-8', (err) => {
        if (err) rej(err);
        res();
      })
    ) {
      outputStream.once("drain", () => {
        res()
      });
    }
  } catch (error) {
    console.log(colors.red(error));
  }
});

export const joinIntegersFromFiles = async (numberOfChunks) => {
  console.log(colors.yellowBright('Join and sort integers has been started'));
  const outputFileName = 'output.txt';
  const streamGenerators = [];

  for (let i = 1; i <= numberOfChunks; i++) {
    const generator = readline
      .createInterface({
        input: fs.createReadStream(`chunk_${i}.txt`),
        crlfDelay: Infinity,
      })[Symbol.asyncIterator]();

    streamGenerators.push(generator);
  }

  const output = fs.createWriteStream(outputFileName)

  const numbers = [];

  for await (let generator of streamGenerators) {
    const { done, value } = await generator.next();
    if (done) continue;

    const generatorVal = parseInt(value);

    if (!Number.isNaN(generatorVal)) {
      numbers.push(generatorVal);
    }
  }

  let min = Infinity;
  let minIdx = 0;
  let chunkSize = 0;
  let outputString = '';

  while (true) {
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] < min) {
        min = numbers[i];
        minIdx = i;
      }
    }

    if (min === Infinity) {
      outputString && (await writeToFile(outputString, output))
      break;
    }

    const strToWrite = String(min) + "\n";
    chunkSize += Buffer.byteLength(strToWrite);

    if (chunkSize > output.writableHighWaterMark) {
      await writeToFile(outputString, output);
      chunkSize = 0
      outputString = ''
    }

    outputString += strToWrite

    const { value } = await streamGenerators[minIdx].next();

    Number.isNaN(parseInt(value))
      ? numbers[minIdx] = Infinity
      : numbers[minIdx] = Number(value);

    min = Infinity;
  }
}

export const splitFileOnChunksWithSort = (fileName, numberOfChunks) => {
  return new Promise(async (resolve, reject) => {
    console.log(colors.yellowBright('Chunking has been started'));
    let currentChunk = 1;
    let lines = 0;

    try {
      lines = Number(
        child_process.execSync(`wc -l numbers.txt`).toString().split(/\s+/)[0]
      );
    } catch (e) {
      console.error("Please run this function in any unix-like shell");
      process.exit(0);
    }

    let linesPerChunk = Math.floor(lines / numberOfChunks);
    const remainder = lines % numberOfChunks;

    const readStream = fs.createReadStream(fileName, {
      encoding: "utf-8"
    });

    const rl = readline.createInterface({
      input: readStream,
    });
  
    let arr = [];
    for await (const line of rl) {
      if (Number.isNaN(line)) {
        continue;
      }

      arr.push(line)

      if (arr.length === linesPerChunk + (currentChunk ^ numberOfChunks ? 0 : remainder)) {
        try {
          await writeFile(
            `chunk_${currentChunk}.txt`,
            arr
              .sort((a, b) => Number(a) - Number(b))
              .join("\n") + "\n",
            {
              encoding: "utf8",
            }
          );
  
          arr = []
          currentChunk++
        } catch (error) {
          console.log('error', error);
          reject(error)
        }
      }
    }
  
    resolve()
    console.log(colors.green('Finished chunking'));
  })
}

export const createFileWithIntegers = async (fileName, fileSize) => {
  return new Promise((resolve, reject) => {
    console.log(colors.green('Write integers to file has been started'));

    if (!fs.existsSync(fileName)) {
      fs.writeFile(fileName, '', (err) => {
        if (err) throw err;
      }); 
    }

    const file = fs.createWriteStream(fileName);
    let currentFileSize = 0;

    function writeChunk() {
      if (currentFileSize >= fileSize) {
        file.close();
        return;
      }

      let ok = true;

      while (currentFileSize < fileSize && ok) {
        ok = file.write(`${Math.floor(Math.random() * fileSize)}\n`);
      }

      file.once('drain', writeChunk);
      fs.stat(fileName, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        currentFileSize = stats.size

        process.stdout.write(`\r \x1b[1m\x1b[93m ${(currentFileSize / 1024 / 1024).toFixed(2)} MB written to file. \x1b[0m\x1b[0m`);
      });
    }

    file.on('close', () => {
      console.log(colors.green('File created successfully'));
      resolve()
    });

    file.on('error', (error) => {
      console.log(colors.green('File created successfully'));
      console.log(colors.red(`File not created: ${error}`));
    });

    writeChunk();

  })
}
