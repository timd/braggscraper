import axios from 'axios';
import cheerio from 'cheerio';
import fs, { appendFileSync } from 'fs';
import csv from 'async-csv'
import { get } from 'http';

const urlList = [];

const getPostTitles = async ( pageNumber ) => {
	try {
		const { data } = await axios.get(
			`https://www.bbc.co.uk/programmes/b006qykl/episodes/player?page=${pageNumber}`
		);

        const $ = cheerio.load(data);
		const postTitles = []
        let pageUrl = ""
        let episodeTitle = ""

		$('a.br-blocklink__link').each((_idx, el) => {
			pageUrl = $(el).attr('href')
		});

        $('span.programme__title.gamma').each((_idx, el) => {
            let exDashes = $(el).text().replace(/\s+/g, '-').toLowerCase()
            episodeTitle = exDashes.replace(/['‘’"“”]/g, '')
		});

  

        postTitles.push([episodeTitle, pageUrl])
		return postTitles;

	} catch (error) {
		throw error;
	}
};

const writeToFile = async (filename, urlJson) => {

    const filePath = `./${filename}`;
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) throw err
        })
    }

    urlJson.forEach( async url => {
        try {
            await appendFileSync(filename, `${url}\n`)
        } catch (err) {
            console.log(err)
        }
    })

};

const pageNums = []
for ( let i = 1; i < 6; i++ ) {
    pageNums.push(i)
}

const bigLoop = async () => {

    for (const pageNum of pageNums) {

        const postTitles = await getPostTitles(pageNum)

        postTitles.forEach(title => {
            urlList.push(title)
        })

        console.log(`Processed page ${pageNum}`)    

        await writeToFile("./pages.csv", urlList);

        console.log(`Episode count: ${urlList.length}`)

    }

}

bigLoop()


