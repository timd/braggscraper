import axios from'axios'
import cheerio from 'cheerio'
import fs, { read } from 'fs'
import csv from 'async-csv'
import download from 'image-downloader'

const bigLoop = async (files) => {

    for (const file of files) {

        if (file[1] != 'undefined') {

            const filename = extractFilename(file[1])
            const dest = `../../mp3s/${file[0]}-${filename}`

            const options = {
                url: file[1],
                dest: dest,
                extractFilename: false,
            };

            try {
                console.log(`Downloading ${dest}...`)
                const result = await download.image(options)
                console.log(result)
            } catch (err) {
                console.log(err)
            }

        }

    }    

}

const extractFilename = (filename) => {
    return filename.split('/').slice(-1)[0]
}

const readCsv = async () => {

  try {
    const data = fs.readFileSync('./mp3s.csv');
    const rows = await csv.parse(data.toString(), {
        delimiter: '|'
      });
    return rows
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
  
}

const run = async () => {
    const files = await readCsv()
    console.log(files)
    bigLoop(files)
}

run()




