import fs from 'node:fs';
import readline from 'node:readline';
import colors from 'ansi-colors';
import child_process from "node:child_process";
import { writeFile } from "node:fs/promises";

export const joinIntegersFromFiles = (prefix) => {
  console.log(`\r \x1b[1m\x1b[93m Join and sort integers has been started \x1b[0m\x1b[0m`);
  const highWaterMark = 2;

  const file1 = fs.createReadStream('chunk_1.txt', { highWaterMark });
  const file2 = fs.createReadStream('chunk_2.txt', { highWaterMark });
  const file3 = fs.createReadStream('chunk_3.txt', { highWaterMark });
  const file4 = fs.createReadStream('chunk_4.txt', { highWaterMark });
  const file5 = fs.createReadStream('chunk_5.txt', { highWaterMark });
  
  const output = fs.createWriteStream('output.txt')
  
  const streams = [
    file1,
    file2,
    file3,
    file4,
    file5
  ];
  
  const writeToOutputMinValue = () => {
    const filteredValues = Object.entries(numbers).sort((a,b) => {
      const aInt = Number.parseInt(a[1]);
      const bInt = Number.parseInt(b[1]);
      if(aInt > bInt) return 1;
      if(aInt < bInt) return -1;
      if(aInt === bInt) return -1;
    })
  
    const minValue = filteredValues[0][1]
    const minValueStreamIdx = filteredValues[0][0]

    output.write(minValue)
    numbers[minValueStreamIdx] = null
    streams[minValueStreamIdx].resume()
  }

  const numbers = {};
  
  streams.forEach((stream, idx) => {
    stream.on('data', function (chunk) {
      if (chunk !== null && Object.values(numbers).length <= streams.length) {
        stream.pause();
        numbers[idx] = chunk;

        if (Object.values(numbers).length === streams.length && !Object.values(numbers).includes(null)) {
          writeToOutputMinValue()
        }
      }
    })
  })
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
    console.log(`\r \x1b[1m\x1b[92m Write integers to file has been started \x1b[0m\x1b[0m`);
    //создаем файл если его нет
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
      console.log(`\r \x1b[1m\x1b[93m File created successfully \x1b[0m\x1b[0m`);
      resolve()
    });

    file.on('error', (error) => {
      console.log(`\r \x1b[1m\x1b[43m File created successfully \x1b[0m\x1b[0m`);
      console.log(`File not created: ${error}`);
    });

    writeChunk();

  })
  
}
