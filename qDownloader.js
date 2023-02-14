import fs from 'fs'
import csv from 'async-csv'
import download from 'image-downloader'

const downloadedCount = 0
let counter = 1

const bigLoop = async (file) => {

        if (file[1] != 'undefined') {

            const filename = extractFilename(file[1])
            const dest = `../../mp3s/${file[0]}-${filename}`

            const options = {
                url: file[1],
                dest: dest,
                extractFilename: false,
            };

            try {
                console.log(`Downloading #${counter} - ${filename} to ${dest}...`)
                await download.image(options)
                counter += 1
            } catch (err) {
                console.log(err)
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

const removeDownloaded = (files) => {
    const cleanList = files.slice(downloadedCount)
    return cleanList
}

const run = async () => {
    const files = await readCsv()

    const filesToProcess = removeDownloaded(files)

    for (const fileToProcess of filesToProcess) {
        await bigLoop(fileToProcess)
    }

    //bigLoop(filesToProcess)
}

run()




