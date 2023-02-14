import fs from 'fs'
import csv from 'async-csv'
import download from 'image-downloader'

const bigLoop = async (files) => {

    for (const file of files) {

        if (file[1] != 'undefined') {

            const filename = extractFilename(file[2])
            const dest = `../../mp3s/${file[0]}-${filename}`

            const options = {
                url: file[2],
                dest: dest,
                extractFilename: false,
            };

            try {
                console.log(`Downloading ${dest}...`)
                await download.image(options)
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
    bigLoop(files)
}

run()




