import axios from 'axios';
import cheerio from 'cheerio';
import fs, { appendFileSync } from 'fs';

const startPage = 1
const endPage = 10

const getPostTitles = async ( pageNumber ) => {
	try {
		const { data } = await axios.get(
			`https://www.bbc.co.uk/programmes/b006qykl/episodes/player?page=${pageNumber}`
		);

        const $ = cheerio.load(data);
		const episodeTitles = []
        const episodeUrls = []
        const episodeData = []

		$('a.br-blocklink__link').each((_idx, el) => {
            let pageUrl = $(el).attr('href')
            episodeUrls.push(pageUrl)
		})

        $('span.programme__title.gamma').each((_idx, el) => {
            let exDashes = $(el).text().replace(/\s+/g, '-').toLowerCase()
            let episodeTitle = exDashes.replace(/['‘’"“”]/g, '')
            let cleanTitle = exDashes.replace(/[,]/g, '-')
            episodeTitles.push(cleanTitle)
        })
               
        for (const [index, url] of episodeUrls.entries()) {
            const episodeTitle = episodeTitles[index]
            episodeData.push([episodeTitle, url])
        }

		return episodeData;

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
for ( let i = startPage; i < endPage + 1; i++ ) {
    pageNums.push(i)
}

const bigLoop = async () => {

    const postList = []

    for (const pageNum of pageNums) {

        const postTitles = await getPostTitles(pageNum)

        console.log(`Processed page ${pageNum}`)   
        
        postTitles.forEach(entry => {
            postList.push(entry)
        })

    }

    await writeToFile("./pages.csv", postList);
    console.log(`Episode count: ${postList.length}`)

}

bigLoop()


