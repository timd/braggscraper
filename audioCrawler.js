import axios from 'axios';
import cheerio from 'cheerio';
import fs, { appendFileSync } from 'fs';
import csv from 'async-csv'

const getMp3Data = async ( url ) => {
	try {

        const { data } = await axios.get(url);

        const $ = cheerio.load(data);
		const mp3Links = [];

		$('a.link-complex').each((_idx, el) => {
			const mp3Url = $(el).attr('href')
			mp3Links.push(`https:${mp3Url}`)
		});

        return mp3Links;

	} catch (error) {
		throw error;
	}
};

const clearFile = async (filename) => {
    const filePath = `./${filename}`;
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) throw err
        })
        console.log(`Cleared ${filename}`)
    }
}

const writeToFile = async (filename, title, mp3Url) => {

        try {
            await appendFileSync(filename, `${title}|${mp3Url}\n`)
        } catch (err) {
            console.log(err)
        }

};

const bigLoop = async (pagesList) => {

    for (const pageRecord of pagesList) {

        const mp3data = await getMp3Data(pageRecord[1])
        const title = pageRecord[0]
        const url = mp3data[0]

        console.log(`title: ${title}`)
        console.log(`url: ${url}\n`)

        await writeToFile("./mp3s.csv", title, url);

    }
    
}

const readCsv = async () => {

    try {
      const data = fs.readFileSync('./pages.csv');
      const rows = await csv.parse(data.toString());
      return rows
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
    }
    
  }

const runLoop = async () => {

    await clearFile('./mp3s.csv')

    const pagesList = await readCsv()

    await bigLoop(pagesList)

    console.log("completed")

}

runLoop()
