const fs = require('fs');
const http = require('http');
const url = require('url');
//core modul leri dahil ettik
const slugify = require('slugify');
//third party module dahil ettik
const replaceTemplate = require('./modules/replaceTemplate');
//kendi olştrdğmz modulu dahil ettik


//nodemon paketi değşklkleri otomatk algılayp server tekrar kaptp açyr
//nodemon index.js global kurarssak böyle kullanblyrz
//local olarak çaılştrmak için package.json içine script içine nodemon index.js yazdk
//çalştrmak içinde npm run start komutunu verrz. start script içindeki name oldğu için 


//npm outdated out date olmuş paket listesini verr
//^1.4.5 burda ^ ile patch ve minor değişlik olan paketleri kabul edyrz yüklemeyi
//~1.4.5 ~ ile sadece patch değişlkliği olan paketleri kabul edyrz.
//*1.4.5 ile major değişk olan paketi de kabul edyrz
//1.4.5 1 major değişlk, 4 minor değişklk, 5 patch değişlkliğini belirtir.

//npm update ... günceller paketi, npm uninstall ... paketi kalldrr


/////////////////////////////////
// FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR! 💥');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written 😁');
//       })
//     });
//   });
// });
// console.log('Will read file!');

/////////////////////////////////
// SERVER
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);


//create server her request te tekrar çağrılır.
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //req.url bize domain name sonrasını dönyr. parse ile de daha detaylı ayrştryz
//burda url.parse obje dönyr. ve içinde query, pathname var. const objesi ile aynı isimle iki değşken olştrdk


  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    //dataObj objesini map ile foreach gibi dönüp array döndryr. replaceTemplate modulune temp ve el ile bilrtlen array çevrilmş product datası gidyr
    //join ile map den dönen array leri birleştrdk
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    //header da 200 ve text/html olcağını beltyrz

    const product = dataObj[query.id];
    //query {id:...} obje donyr parse dan yukardaki
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //request sonucu gönderilen response

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
